import cv2
import numpy as np
import os

class FaceRecognizer:
    def __init__(self, faces_folder="faces"):
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
        self.recognizer = cv2.face.LBPHFaceRecognizer_create()
        self.label_map_reverse = {}
        self.train_model(faces_folder)

    def preprocess_face(self, gray_img):
        """Standardizes the face image for better accuracy."""
        faces = self.face_cascade.detectMultiScale(gray_img, 1.1, 4)
        if len(faces) == 0:
            return None
        (x, y, w, h) = faces[0]
        face = gray_img[y:y+h, x:x+w]
        face = cv2.resize(face, (200, 200))
        # EqualizeHist helps the model ignore lighting differences
        face = cv2.equalizeHist(face)
        return face

    def train_model(self, faces_folder):
        training_faces = []
        training_labels = []
        label_map = {}
        current_label = 0

        for file in os.listdir(faces_folder):
            if not file.endswith(('.jpg', '.jpeg', '.png')):
                continue
            
            path = os.path.join(faces_folder, file)
            img = cv2.imread(path)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            face = self.preprocess_face(gray)
            if face is not None:
                name = file.split("_")[0]
                if name not in label_map:
                    label_map[name] = current_label
                    current_label += 1
                
                training_faces.append(face)
                training_labels.append(label_map[name])

        self.recognizer.train(training_faces, np.array(training_labels))
        self.label_map_reverse = {v: k for k, v in label_map.items()}

    def predict(self, img):
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face = self.preprocess_face(gray)
        
        if face is None:
            return "No face detected", 0
        
        label, confidence = self.recognizer.predict(face)
        name = self.label_map_reverse.get(label, "Unknown")
        
        # Lower confidence = closer match. 
        # 55 is a good balance for LBPH.
        if confidence/100 < 70:
            return f"This is {name}", confidence
        elif confidence/100 < 85:
            return f"I think this is {name}, but I'm not sure.", confidence
        else:
            return "This is someone I don't recognize", confidence