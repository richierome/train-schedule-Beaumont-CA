import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [crossings, setCrossings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false); // Burger menu state

  const appStyle = {
    backgroundColor: "#121212", // Always dark mode
    color: "#ffffff",
    minHeight: "100vh",
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
  };

  const toggleMenu = () => setShowMenu(!showMenu);

  // Fetch crossings from backend
  const fetchCrossings = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/trains");
      setCrossings(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching crossings:", error);
    }
  };

  useEffect(() => {
    fetchCrossings();
    const interval = setInterval(fetchCrossings, 10000); // Refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  const streets = ["California St", "Pennsylvania Ave"];
  const crossingData = streets.map((street) => {
    const data = crossings.find((c) => c.crossing_name === street);
    return data || { crossing_name: street, last_crossing_time: null, is_active: false, id: street };
  });

  return (
    <div style={appStyle}>
      {/* Burger Menu */}
      <div style={{ position: "fixed", top: "1rem", right: "1rem" }}>
        <button
          onClick={toggleMenu}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "30px",
            height: "22px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ height: "4px", width: "100%", background: "#fff", borderRadius: "2px" }}></span>
          <span style={{ height: "4px", width: "100%", background: "#fff", borderRadius: "2px" }}></span>
          <span style={{ height: "4px", width: "100%", background: "#fff", borderRadius: "2px" }}></span>
        </button>

        {showMenu && (
          <div
            style={{
              position: "absolute",
              top: "35px",
              right: "0",
              backgroundColor: "#1e1e1e",
              padding: "1rem",
              borderRadius: "5px",
              minWidth: "200px",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
              zIndex: 100,
            }}
          >
            <span
              onClick={() => setShowMenu(false)}
              style={{
                position: "absolute",
                top: "5px",
                right: "10px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              ×
            </span>
            <p>Email: info@beaumonttrains.com</p>
            <p>Emergency: 911</p>
          </div>
        )}
      </div>

      <h1 style={{ textAlign: "center" }}>🚦 Train Crossings - Beaumont, CA</h1>
      <p style={{ textAlign: "center" }}>Tracking train activity at key crossings:</p>

      <div style={{ marginTop: "2rem" }}>
        {crossingData.map((train) => (
          <div
            key={train.id}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "5px",
              backgroundColor: train.is_active ? "#ff4d4d" : "#1e1e1e",
              animation: train.is_active ? "pulse 1.5s infinite" : "none",
            }}
          >
            <h3>{train.crossing_name}</h3>
            <p>
              Last Crossing:{" "}
              <b>
                {train.last_crossing_time
                  ? new Date(train.last_crossing_time).toLocaleString()
                  : "N/A"}
              </b>
            </p>
            <p>
              Active Train: <b>{train.is_active ? "Yes! Train is currently crossing." : "No ✅"}</b>
            </p>
          </div>
        ))}
      </div>

      {/* CSS for pulsing */}
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 10px #ff4d4d; }
            50% { box-shadow: 0 0 20px #ff0000; }
            100% { box-shadow: 0 0 10px #ff4d4d; }
          }
        `}
      </style>
    </div>
  );
}

export default App;
