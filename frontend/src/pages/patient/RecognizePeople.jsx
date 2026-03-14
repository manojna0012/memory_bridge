import { useRef, useState } from "react";
import { Camera, Search } from "lucide-react";

import AppHeader from "../../components/AppHeader";
import BottomNav from "../../components/BottomNav";
import FloatingAI from "../../components/FloatingAI";

const RecognizePeople = () => {

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      videoRef.current.srcObject = stream;

    } catch (err) {
      alert("Camera access denied");
      console.error(err);
    }
  };

  // Capture frame and send to backend
  const recognize = async () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video.srcObject) {
      alert("Start camera first");
      return;
    }

    setLoading(true);

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {

      const formData = new FormData();
      formData.append("image", blob, "capture.jpg");

      try {

        const res = await fetch("http://localhost:5000/detect", {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        setResult(data.result);
        setLoading(false);

        // voice output
        if (data.speak) {
          const speech = new SpeechSynthesisUtterance(data.speak);
          speech.rate = 0.9;
          window.speechSynthesis.speak(speech);
        }

      } catch (err) {

        console.error(err);
        setLoading(false);
        alert("Backend error");

      }

    }, "image/jpeg");
  };

  return (

    <div className="min-h-screen bg-background pb-20">

      <AppHeader
        title="Recognize Person"
        subtitle="Scan a face"
      />

      <main className="max-w-lg mx-auto px-4 py-8 text-center space-y-6">

        {/* Camera Preview */}

        <div className="w-64 h-64 mx-auto bg-card rounded-xl overflow-hidden shadow-soft">

          <video
            ref={videoRef}
            autoPlay
            className="w-full h-full object-cover"
          />

        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Buttons */}

        <div className="flex justify-center gap-4">

          <button
            onClick={startCamera}
            className="bg-primary text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Camera size={16}/>
            Start Camera
          </button>

          <button
            onClick={recognize}
            className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2"
          >
            <Search size={16}/>
            {loading ? "Recognizing..." : "Recognize"}
          </button>

        </div>

        {result && (
          <p className="text-lg font-medium">
            Result: {result}
          </p>
        )}

      </main>

      <FloatingAI/>
      <BottomNav/>

    </div>

  );
};

export default RecognizePeople;