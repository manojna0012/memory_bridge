from flask import Flask, request, jsonify, send_from_directory
import cv2
import numpy as np
from models.face_model import FaceRecognizer
from google import genai
import os
from dotenv import load_dotenv
from datetime import datetime
from flask_cors import CORS
from database import init_db, get_db

# -----------------------------
# Initialize
# -----------------------------
init_db()
load_dotenv()
app = Flask(__name__)
CORS(app)

# Gemini AI
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Faces folder
os.makedirs("faces", exist_ok=True)

# Face recognition model
model = FaceRecognizer(faces_folder="faces")


# -----------------------------
# Home
# -----------------------------
@app.route("/")
def home():
    return "MemoryBridge Backend Running"


# -----------------------------
# Signup (Caregiver / Patient)
# -----------------------------
@app.route("/signup", methods=["POST"])
def signup():
    name = request.form.get("name")
    email = request.form.get("email")
    password = request.form.get("password")
    role = request.form.get("role")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)",
        (name, email, password, role)
    )
    user_id = cursor.lastrowid
    conn.commit()
    conn.close()

    photos = request.files.getlist("photos")
    safe_name = name.lower().replace(" ", "_")

    if role == "patient":
        for i, file in enumerate(photos):
            filename = f"{safe_name}_{i+1}.jpg"
            path = os.path.join("faces", filename)
            file.save(path)
        try:
            model.train()
        except:
            print("Model training skipped")

    return jsonify({"message": "Signup successful", "user_id": user_id})


# -----------------------------
# Face login (Patient)
# -----------------------------
@app.route("/login/face", methods=["POST"])
def face_login():
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    # Convert to OpenCV image
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    # Predict face
    predicted_name, confidence_score = model.predict(img)
    print(f"Debug: Predicted {predicted_name} ({confidence_score:.2f})")

    # Convert confidence to 0-100 scale
    if confidence_score <= 1:
        confidence_score *= 100

    # Accept threshold (lowered to reduce false negatives)
    if confidence_score < 45:
        return jsonify({"error": "Face not recognized"}), 401

    # Clean predicted name
    predicted_name_clean = predicted_name.replace("This is", "").strip().lower()

    # Check DB for patient
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE LOWER(name)=? AND role='patient'",
        (predicted_name_clean,)
    ).fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "No patient found with this face"}), 401

    # Success
    return jsonify({
        "message": f"Welcome {user['name']}!",
        "user_id": user["id"],
        "role": user["role"],
        "name": user["name"]
    })


# -----------------------------
# Serve faces
# -----------------------------
@app.route("/faces/<filename>")
def serve_face(filename):
    return send_from_directory("faces", filename)


# -----------------------------
# Add person (Caregiver)
# -----------------------------
@app.route("/add_person", methods=["POST"])
def add_person():
    name = request.form.get("name")
    age = request.form.get("age")
    relation = request.form.get("relation")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO people (name, age, relation) VALUES (?, ?, ?)",
        (name, age, relation)
    )
    person_id = cursor.lastrowid
    conn.commit()
    conn.close()

    photos = request.files.getlist("photos")
    safe_name = name.lower().replace(" ", "_")
    for i, file in enumerate(photos):
        filename = f"{safe_name}_{i+1}.jpg"
        path = os.path.join("faces", filename)
        file.save(path)

    try:
        model.train()
    except:
        print("Model training skipped")

    return jsonify({"message": "Person added", "id": person_id})


# -----------------------------
# Get all people
# -----------------------------
@app.route("/people", methods=["GET"])
def get_people():
    conn = get_db()
    cursor = conn.cursor()
    rows = cursor.execute("SELECT * FROM people").fetchall()
    people = [{"id": r["id"], "name": r["name"], "age": r["age"], "relation": r["relation"]} for r in rows]
    conn.close()
    return jsonify(people)


# -----------------------------
# Delete person
# -----------------------------
@app.route("/delete_person/<int:id>", methods=["DELETE"])
def delete_person(id):
    conn = get_db()
    cursor = conn.cursor()

    person = cursor.execute("SELECT name FROM people WHERE id=?", (id,)).fetchone()
    if not person:
        return jsonify({"error": "Person not found"})

    name = person["name"]
    safe_name = name.lower().replace(" ", "_")

    cursor.execute("DELETE FROM people WHERE id=?", (id,))
    conn.commit()
    conn.close()

    # Remove face images
    for file in os.listdir("faces"):
        if file.startswith(safe_name):
            os.remove(os.path.join("faces", file))

    try:
        model.train()
    except:
        print("Model training skipped")

    return jsonify({"message": "Person deleted"})


# -----------------------------
# Face detection (for testing)
# -----------------------------
@app.route("/detect", methods=["POST"])
def detect():
    if "image" not in request.files:
        return jsonify({"result": "No image uploaded"})

    file = request.files["image"]
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)

    result_message, confidence_score = model.predict(img)
    print(f"Debug: {result_message} ({confidence_score:.2f})")

    return jsonify({"result": result_message, "speak": result_message})


# -----------------------------
# Chatbot
# -----------------------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    message = data.get("message", "").strip().lower()

    context = "You are MemoryBridge, a gentle AI assistant for elderly users with memory issues.\nSpeak clearly and simply."

    if any(word in message for word in ["date", "time", "day", "today"]):
        now = datetime.now()
        context += f"\nCurrent date: {now.strftime('%A, %B %d, %Y')}"
        context += f"\nCurrent time: {now.strftime('%I:%M %p')}"

    if "table" in message or "multiplication" in message:
        context += "\nFormat number tables like '5 x 1 = 5'"

    try:
        prompt = f"{context}\n\nUser: {message}"
        response = client.models.generate_content(model="gemini-2.5-flash", contents=prompt)
        reply = response.text
    except Exception as e:
        print("GEMINI ERROR:", e)
        reply = "Chatbot error"

    return jsonify({"reply": reply})


# -----------------------------
# Run
# -----------------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)