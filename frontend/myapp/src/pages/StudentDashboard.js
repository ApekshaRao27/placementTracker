// src/pages/StudentDashboard.js
import { useEffect, useState } from "react";
import api from "../utils/api";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }

    // Fetch student-specific data (if you have a student endpoint)
    api.get("/student/dashboard")
      .then(res => {
        console.log("Student Dashboard response:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error("Student Dashboard error:", err.response?.data);
        setData({ msg: "Failed to load dashboard" });
      });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-12">
          <h1>Student Dashboard</h1>
          {userInfo && (
            <div className="alert alert-info">
              <p><strong>Welcome, {userInfo.name}</strong></p>
              <p>Email: {userInfo.email}</p>
              <p>USN: {userInfo.usn}</p>
            </div>
          )}
          
          <p>{data.msg}</p>

          {data.placements && (
            <div className="mt-4">
              <h3>Your Placements</h3>
              <ul>
                {data.placements.map((placement, idx) => (
                  <li key={idx}>{placement}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
