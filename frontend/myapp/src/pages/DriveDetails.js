// src/pages/DriveDetails.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function DriveDetails() {
  const { id } = useParams();
  const [drive, setDrive] = useState(null);

  useEffect(() => {
    api.get(`/admin/drives/${id}`)
      .then(res => setDrive(res.data))
      .catch(err => console.error("Drive details error:", err.response?.data));
  }, [id]);

  if (!drive) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>{drive.companyName} - {drive.role}</h1>
        <p>Date: {new Date(drive.date).toLocaleDateString()}</p>
        <p>Eligibility: {drive.eligibility}</p>

        <h3>Rounds</h3>
        {drive.rounds.map((round, i) => (
          <div key={i} style={styles.card}>
            <h4>{round.name}</h4>
            <p>Attendees: {round.attendees.length}</p>
            <p>Cleared: {round.cleared.length}</p>
            <p>Rejected: {round.rejected.length}</p>
            <ul>
              {round.attendees.map(student => (
                <li key={student._id}>{student.name} ({student.email})</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "900px", margin: "20px auto", padding: "20px" },
  card: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    margin: "15px 0",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
  }
};

export default DriveDetails;
