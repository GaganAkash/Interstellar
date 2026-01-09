import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import "./index.css";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import UploadPage from "./pages/upload";
import DownloadPage from "./pages/download";
import FileActivity from "./pages/FileActivity.jsx";
import RegisterPage from "./pages/register";
import ContactPage from "./pages/contact";
import AboutPage from "./pages/about";
import Navbar from "./components/Navbar";
import NavbarWithFileActivity from "./components/NavbarWithFileActivity";

function AppWrapper() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status from backend
    async function checkAuth() {
      try {
        const response = await fetch("http://localhost:5000/api/auth-status", {
          credentials: "include",
        });
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    // On root URL refresh, log out user and redirect to login
    if (location.pathname === "/") {
      // Clear authentication state and redirect to login
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  // Pages that should NOT show the navbar
  const pagesWithoutFileActivityNav = ["/login", "/register"];

  // Pages where File Activity nav should be shown
  const pagesWithFileActivityNav = ["/home", "/upload", "/download"];

  return (
    <>
      {/* Always render Navbar */}
      {pagesWithFileActivityNav.includes(location.pathname) ? (
        <NavbarWithFileActivity setIsAuthenticated={setIsAuthenticated} />
      ) : (
        <Navbar setIsAuthenticated={setIsAuthenticated} />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/home" /> : <RegisterPage />
          }
        />
        <Route
          path="/home"
          element={
            isAuthenticated ? <HomePage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/upload"
          element={
            isAuthenticated ? <UploadPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/download"
          element={
            isAuthenticated ? <DownloadPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/file-activity"
          element={
            isAuthenticated ? <FileActivity /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/contact"
          element={
            isAuthenticated ? <ContactPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/about"
          element={
            isAuthenticated ? <AboutPage /> : <Navigate to="/login" />
          }
        />
        {/* Add a catch-all route to redirect unknown paths to home or login */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
