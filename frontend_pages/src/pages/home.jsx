import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { FaUpload, FaDownload } from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();

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
      <motion.div
        className="z-10 w-full max-w-full sm:max-w-md px-4 sm:px-6 md:px-8 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-10">
          Welcome to <span className="text-cyan-400">Interstellar</span>
        </h1>

        <div className="flex justify-center space-x-6">
          <Button
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl shadow-lg text-lg font-medium"
            onClick={() => navigate("/upload")}
          >
            <FaUpload />
            <span>Upload</span>
          </Button>
          <Button
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl shadow-lg text-lg font-medium"
            onClick={() => navigate("/download")}
          >
            <FaDownload />
            <span>Download</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
