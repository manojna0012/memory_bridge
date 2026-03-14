import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Camera } from "lucide-react";
import { useAuth } from "./AuthContext";
import Webcam from "react-webcam";
import axios from "axios";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("caregiver");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const webcamRef = useRef(null);

  // ---------------------------
  // Patient Face Login
  // ---------------------------
  const captureFace = async () => {
    setMessage("");
    setLoading(true);

    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        setMessage("Camera not ready");
        setLoading(false);
        return;
      }

      // Convert base64 to Blob
      const blob = await (await fetch(imageSrc)).blob();
      const formData = new FormData();
      formData.append("image", blob, "face.jpg");

      const res = await axios.post("http://localhost:5000/login/face", formData);

      const { user_id, role: userRole, name } = res.data;

      // Use AuthContext login for patient
      login(null, null, userRole, user_id, name);

      navigate("/"); // Redirect to home page
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Face login failed");
    }

    setLoading(false);
  };

  // ---------------------------
  // Caregiver Email/Password Login
  // ---------------------------
  const handleLogin = () => {
    setMessage("");
    if (role === "caregiver") {
      const success = login(email, password, role);
      if (success) navigate("/"); // Redirect to home page
      else setMessage("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="bg-card w-full max-w-sm p-8 rounded-2xl shadow-soft space-y-4">
        <div className="text-center">
          <Brain className="mx-auto text-primary mb-2" />
          <h1 className="font-heading font-bold text-lg">MemoryBridge Login</h1>
        </div>

        {/* Role Select */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        >
          <option value="caregiver">Caregiver</option>
          <option value="patient">Patient</option>
        </select>

        {/* Caregiver Login */}
        {role === "caregiver" && (
          <>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-border px-3 py-2 rounded-md w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-border px-3 py-2 rounded-md w-full"
            />
            <button
              onClick={handleLogin}
              className="bg-primary text-white w-full py-2 rounded-md"
            >
              Login
            </button>
          </>
        )}

        {/* Patient Face Login */}
        {role === "patient" && (
          <div className="flex flex-col items-center gap-2">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-48 h-48 rounded-xl border"
            />
            <button
              onClick={captureFace}
              disabled={loading}
              className="bg-primary text-white px-4 py-2 rounded-md"
            >
              {loading ? "Logging in..." : "Login with Face"}
            </button>
          </div>
        )}

        {/* Message */}
        {message && <p className="text-sm text-center text-red-500">{message}</p>}

        {/* Signup */}
        <p className="text-xs text-center text-muted-foreground">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-primary font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;