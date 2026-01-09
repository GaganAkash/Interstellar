import React from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-sky-900 via-cyan-900 to-sky-900 relative overflow-auto px-4 py-8 text-white" style={{minHeight: '100vh', width: '100vw',position:'absolute',left:0}}>
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-300">
          Contact Us
        </h1>
        <p className="max-w-xl mx-auto text-white text-lg">
          For any inquiries, please email us at{" "}
          <a href="mailto:support@interstellar.com" className="text-cyan-400 underline">
            support@interstellar.com
          </a>{" "}
          or call us at (123) 456-7890.
        </p>
      </motion.div>
    </div>
  );
}
