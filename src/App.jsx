import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <NavBar />

      {/* Dark Mode Toggle */}
      <button
        className="dark-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Routed Pages Render Here */}
      <Outlet />
    </div>
  );
}

export default App;


