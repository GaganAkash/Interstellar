import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Progress } from "../components/ui/progress";
import { motion } from "framer-motion";
import IpfsDataFlow from "../components/IpfsDataFlow";

export default function UploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [cid, setCid] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let stars = [];
    let width, height;
    let animationFrameId;

    function init() {
      resize();
      for (let i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          speed: Math.random() * 0.5 + 0.2,
        });
      }
      animate();
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        star.x -= star.speed;
        if (star.x < 0) star.x = width;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);
    init();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const simulateSteps = async () => {
    setCurrentStep(1);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep(2);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep(3);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep(4);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep(5);
    await new Promise((r) => setTimeout(r, 1000));
    setCurrentStep(6);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setMessage("Uploading to IPFS via backend...");
    setCurrentStep(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      simulateSteps();

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 10;
          clearInterval(interval);
          return prev;
        });
      }, 300);

      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      setProgress(100);
      setMessage(`Upload complete!`);
      setCid(data.cid);
      setQrCode(data.qr_code);
      setCurrentStep(6);
    } catch (error) {
      setMessage("An error occurred during upload.");
      setCurrentStep(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-sky-900 via-cyan-900 to-sky-900 relative overflow-auto px-8 py-8 text-white" style={{minHeight: '100vh', width: '100vw',position:'absolute',left:0}}>
      {/* IPFS Nodes Background */}
      <div className="absolute inset-0 z-0 overflow-auto">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="glow" r="1">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f0e17" stopOpacity="0" />
            </radialGradient>
          </defs>
          {[...Array(40)].map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 100 + "%"}
              cy={Math.random() * 100 + "%"}
              r="3"
              fill="url(#glow)"
              className="animate-pulse"
            />
          ))}
        </svg>
      </div>
      {/* Upload Card */}
      <motion.div
        className={`z-10 w-full max-w-full sm:max-w-md px-6 sm:px-6 md:px-8 transition-all duration-700 relative upload-container mb-8`}
        style={{ top:'20%', left: "0%" }}
        initial={{ opacity: 0, y: -50, left: "-32.5%" }}
        animate={{ opacity: 1, y: 0, left: "-32.3%" }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-opacity-90 backdrop-blur-sm shadow-xl border-2 border-cyan-600 rounded-2xl p-4 sm:p-6 md:p-8 bg-gray-900" >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-300 text-center">
            Upload to IPFS
          </h1>
          <div className="w-full max-w-xl bg-gray-900 p-6 rounded-xl shadow-lg space-y-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full bg-gray-800 text-white p-2 rounded"
            />
            <Button
              onClick={handleUpload}
              className="bg-cyan-600 hover:bg-cyan-700 w-full"
            >
              Upload
            </Button>
            {uploading && (
              <div className="space-y-2">
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Progress value={progress} className="h-4 bg-gray-700" />
                </motion.div>
                <p className="text-sm text-cyan-300">{message}</p>
              </div>
            )}
            {!uploading && message && (
              <p className="text-sm text-cyan-300">{message}</p>
            )}
          </div>
        </div>
      </motion.div>
      {/* IPFS Data Flow Visualization */}
      <div className="mb-8" style={{ position: 'absolute', top: '3%', left: '20%', width: '100%' }}>
        <IpfsDataFlow currentStep={currentStep} />
      </div>
      {/* CID and QR Code Display */}
      {!uploading && cid && (
        <div className="z-10 w-full max-w-md px-6 bg-opacity-90 backdrop-blur-sm shadow-xl border-2 border-cyan-600 rounded-2xl p-8 text-center mt-4 pointer-events-auto" style={{ position: 'absolute', top: '75%', left: '2.4%' }}>
          <h2 className="text-cyan-300 text-xl mb-4">Upload Successful</h2>
          <p className="text-cyan-400 break-all mb-4">CID: {cid}</p>
          <img
            src={qrCode.startsWith('data:image') ? qrCode : `data:image/png;base64,${qrCode}`}
            alt="QR Code"
            className="mx-auto"
          />
        </div>
      )}
    </div>
  );
}
