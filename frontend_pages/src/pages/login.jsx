import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardContent } from "../components/ui/card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";
import { FaCube } from "react-icons/fa";

import Navbar from "../components/Navbar";

export default function LoginPage({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
      } else {
        setMessage("Login successful");
        if (typeof setIsAuthenticated === "function") {
          setIsAuthenticated(true);
        }
        navigate("/home");
      }
    } catch (error) {
      setMessage("An error occurred during login.");
    } finally {
      setLoading(false);
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
      <motion.div
        className="z-10 w-full max-w-full sm:max-w-md px-4 sm:px-6 md:px-8 border-2 border-cyan-600 rounded-2xl bg-opacity-90 backdrop-blur-sm shadow-xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <CardContent className="space-y-8 p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <FaCube className="text-cyan-500 text-4xl" />
            <h2 className="text-3xl font-bold text-white">Login to Interstellar</h2>
          </div>
          <form className="space-y-6" onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Email"
              className="bg-gray-900 text-white placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              className="bg-gray-900 text-white placeholder-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl py-3 text-lg"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          {message && (
            <div className="text-center text-sm text-red-500">{message}</div>
          )}
          <div className="text-center text-sm text-gray-400">
            Don’t have an account?{" "}
            <a href="#" onClick={() => navigate('/register')} className="text-cyan-400 hover:underline cursor-pointer">
              Sign up
            </a>
          </div>
        </CardContent>
      </motion.div>
    </div>
  );
}
