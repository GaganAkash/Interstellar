import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { FaCube } from "react-icons/fa";
import IpfsDataFlow from "../components/IpfsDataFlow";
import IpfsDataReassembly from "../components/IpfsDataReassembly";

export default function DownloadPage() {
  const [cid, setCid] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const handleCidChange = (e) => {
    setCid(e.target.value);
  };

  const simulateReassemblySteps = async () => {
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

  const handleDownload = async () => {
    if (!cid) return;
    setDownloading(true);
    setProgress(0);
    setMessage("Downloading from IPFS via backend...");
    setCurrentStep(0);

    try {
      simulateReassemblySteps();

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) return prev + 10;
          clearInterval(interval);
          return prev;
        });
      }, 300);

      const response = await fetch("http://localhost:5000/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Download failed");
      }

      // Get filename from content-disposition header
      const disposition = response.headers.get("content-disposition");
      let filename = "downloaded_file";
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const filenameMatch = disposition.match(/filename="?(.+)"?/);
        if (filenameMatch.length === 2) filename = filenameMatch[1];
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setProgress(100);
      setMessage(`Download complete: ${filename}`);
      setCurrentStep(0);
    } catch (error) {
      setMessage(`An error occurred during download: ${error.message}`);
      setCurrentStep(0);
    } finally {
      setDownloading(false);
    }
  };

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

      {/* Download Card */}
      <motion.div
        className={`z-10 w-full max-w-full sm:max-w-md px-6 sm:px-6 md:px-8 transition-all duration-700 relative download-container mb-8 mt-8`}
        style={{ top:'20%', left: "0%" }}
        initial={{ opacity: 0, y: -50, left: "0%" }}
        animate={{ opacity: 1, y: 0, left: "0%" }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-opacity-90 backdrop-blur-sm shadow-xl border-2 border-cyan-600 rounded-2xl p-4 sm:p-6 md:p-8">
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <FaCube className="text-cyan-500 text-4xl" />
              <h2 className="text-3xl font-bold text-white">Download from IPFS</h2>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleDownload(); }}>
              <Input
                type="text"
                placeholder="Enter CID"
                className="bg-gray-900 text-white placeholder-gray-400"
                value={cid}
                onChange={handleCidChange}
                required
              />
              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl py-3 text-lg"
                disabled={downloading}
              >
                {downloading ? "Downloading..." : "Download"}
              </Button>
            </form>
            {message && (
              <div className="text-center text-sm text-cyan-300">{message}</div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* IPFS Data Reassembly Visualization */}
      <div style={{ position: 'relative', marginTop: '2rem' }}>
        <IpfsDataReassembly currentStep={currentStep} />
      </div>
    </div>
  );
}
