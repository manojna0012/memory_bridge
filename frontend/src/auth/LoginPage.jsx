import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Camera } from "lucide-react";
import { useAuth } from "./AuthContext";

const LoginPage = () => {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("caregiver");
  const [photo,setPhoto] = useState(null);

  const handlePhoto = (e) => {

    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleLogin = () => {

    const success = login(email,password);

    if(success){
      navigate("/");
    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-background px-4">

      <div className="bg-card w-full max-w-sm p-8 rounded-2xl shadow-soft space-y-4">

        <div className="text-center">

          <Brain className="mx-auto text-primary mb-2"/>

          <h1 className="font-heading font-bold text-lg">
            MemoryBridge Login
          </h1>

        </div>

        {/* Role Select */}

        <select
          value={role}
          onChange={(e)=>setRole(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        >
          <option value="caregiver">Caregiver</option>
          <option value="patient">Patient</option>
        </select>

        {/* Email */}

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        />

        {/* Password */}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        />

        {/* Patient Face Upload (future feature) */}

        {role === "patient" && (

          <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">

            <Camera size={16}/>
            Upload face photo (future face login)

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhoto}
            />

          </label>

        )}

        {photo && (
          <img
            src={photo}
            className="w-16 h-16 object-cover rounded-full mx-auto"
          />
        )}

        {/* Login Button */}

        <button
          onClick={handleLogin}
          className="bg-primary text-white w-full py-2 rounded-md"
        >
          Login
        </button>

        {/* Signup Redirect */}

        <p className="text-xs text-center text-muted-foreground">

          Don't have an account?{" "}

          <button
            onClick={()=>navigate("/signup")}
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