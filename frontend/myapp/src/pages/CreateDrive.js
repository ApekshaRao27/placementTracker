// src/pages/CreateDrive.js
import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CreateDrive() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    role: "",
    date: "",
    eligibility: "",
    rounds: []
  });

  const [roundOptions] = useState([
    "Aptitude",
    "Coding",
    "Technical Interview",
    "HR",
    "Group Discussion"
  ]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleRound = round => {
    setForm(prev => {
      const exists = prev.rounds.includes(round);
      return {
        ...prev,
        rounds: exists ? prev.rounds.filter(r => r !== round) : [...prev.rounds, round]
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/admin/drives", {
        ...form,
        rounds: form.rounds.map(r => ({
          name: r,
          attendees: [],
          cleared: [],
          rejected: []
        }))
      });
      alert("Drive created successfully!");
      navigate("/admin/drives");
    } catch (err) {
      console.error("Drive creation error:", err.response?.data || err.message);
      alert("Error creating drive");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Create Placement Drive</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label>Company Name</label>
          <input name="companyName" onChange={handleChange} required />

          <label>Role</label>
          <input name="role" onChange={handleChange} required />

          <label>Date</label>
          <input type="date" name="date" onChange={handleChange} required />

          <label>Eligibility</label>
          <input name="eligibility" onChange={handleChange} />

          <label>Select Rounds</label>
          <div style={styles.rounds}>
            {roundOptions.map(r => (
              <div key={r}>
                <input
                  type="checkbox"
                  checked={form.rounds.includes(r)}
                  onChange={() => toggleRound(r)}
                />
                <span>{r}</span>
              </div>
            ))}
          </div>

          <button type="submit" style={styles.button}>Create Drive</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "500px", margin: "30px auto", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  form: { display: "flex", flexDirection: "column", gap: "15px" },
  rounds: { display: "flex", flexDirection: "column", gap: "5px" },
  button: { padding: "10px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }
};

export default CreateDrive;
