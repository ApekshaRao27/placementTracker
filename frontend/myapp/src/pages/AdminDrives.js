// src/pages/AdminDrives.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function AdminDrives() {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    api.get("/admin/drives")
      .then(res => setDrives(res.data))
      .catch(err => console.error("Drives error:", err.response?.data));
  }, []);

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Placement Drives</h1>
        

        {drives.length > 0 ? (
          drives.map(drive => (
            <Link key={drive._id} to={`/admin/drives/${drive._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={styles.card}>
                <h2>{drive.companyName} - {drive.role}</h2>
                <p>Date: {new Date(drive.date).toLocaleDateString()}</p>
                <p>Eligibility: {drive.eligibility}</p>
                <h3>Rounds</h3>
                <ul>
                  {drive.rounds.map((round, i) => (
                    <li key={i}>{round.name}</li>
                  ))}
                </ul>
              </div>
            </Link>
          ))
        ) : (
          <p>No drives created yet.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "20px auto", padding: "20px" },
  card: {
    backgroundColor: "#fff",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    cursor: "pointer"
  },
  button: {
    padding: "8px 15px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default AdminDrives;
