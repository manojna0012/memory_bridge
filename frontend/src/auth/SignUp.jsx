import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Camera } from "lucide-react";

const Signup = () => {

  const navigate = useNavigate();

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("patient");
  const [photos,setPhotos] = useState([]);

  const handlePhoto = (e) => {

    const files = Array.from(e.target.files).slice(0,3);

    const readers = [];

    files.forEach(file => {

      const reader = new FileReader();

      reader.onload = () => {

        readers.push(reader.result);

        if(readers.length === files.length){
          setPhotos(readers);
        }

      };

      reader.readAsDataURL(file);

    });

  };

  const handleSignup = async () => {

  if(!name || !email || !password) return;

  if(role === "patient" && photos.length === 0){
    alert("Please upload at least one face photo");
    return;
  }

  try{

    const formData = new FormData();

    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);

    // append photos
    photos.forEach((photo, index) => {

      const blob = fetch(photo)
        .then(res => res.blob())
        .then(blob => {
          formData.append("photos", blob, `${name}_${index+1}.jpg`);
        });

    });

    // wait for blob conversions
    await Promise.all(
      photos.map(async (photo, index)=>{
        const blob = await fetch(photo).then(r=>r.blob());
        formData.append("photos", blob, `${name}_${index+1}.jpg`);
      })
    );

    await fetch("http://localhost:5000/signup",{
      method:"POST",
      body:formData
    });

    navigate("/login");

  }catch(err){
    console.error(err);
  }
};

  return (

    <div className="min-h-screen flex items-center justify-center bg-background px-4">

      <div className="bg-card w-full max-w-sm p-8 rounded-2xl shadow-soft space-y-4">

        <div className="text-center">
          <Brain className="mx-auto text-primary mb-2"/>
          <h1 className="font-heading font-bold text-lg">
            Create Account
          </h1>
        </div>

        <input
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        />

        <select
          value={role}
          onChange={(e)=>setRole(e.target.value)}
          className="border border-border px-3 py-2 rounded-md w-full"
        >
          <option value="patient">Patient</option>
          <option value="caregiver">Caregiver</option>
        </select>

        {/* Face Upload for Patients */}

        {role === "patient" && (

          <label className="flex items-center gap-2 text-sm text-primary cursor-pointer">

            <Camera size={16}/>
            Upload up to 3 face photos

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhoto}
            />

          </label>

        )}

        {/* Photo Preview */}

        {photos.length > 0 && (

          <div className="flex gap-2 justify-center">

            {photos.map((p,i)=>(
              <img
                key={i}
                src={p}
                className="w-16 h-16 object-cover rounded-full"
              />
            ))}

          </div>

        )}

        <button
          onClick={handleSignup}
          className="bg-primary text-white w-full py-2 rounded-md"
        >
          Sign Up
        </button>

      </div>

    </div>

  );
};

export default Signup;