// src/pages/AdminDrives.js
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/drives")
      .then(res => {
        setDrives(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Drives error:", err.response?.data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      
      <div className="container py-5" style={{ maxWidth: "1000px" }}>
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">Placement Drives</h2>
            <p className="text-muted small">Manage ongoing and upcoming recruitment drives</p>
          </div>
          <Link to="/admin/create-drive" className="btn btn-primary shadow-sm px-4 fw-bold">
            + Create New Drive
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : drives.length > 0 ? (
          <div className="row">
            {drives.map((drive) => (
              <div key={drive._id} className="col-12 mb-3">
                <Link 
                  to={`/admin/drives/${drive._id}`} 
                  className="text-decoration-none"
                >
                  <div className="card border-0 shadow-sm admin-card transition-all">
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        {/* Company & Role */}
                        <div className="col-md-5">
                          <h5 className="fw-bold text-primary mb-1">{drive.companyName}</h5>
                          <p className="text-dark mb-0 fw-semibold">{drive.role}</p>
                          <span className="badge bg-info-subtle text-info mt-2 border border-info-subtle">
                             Eligibility: {drive.eligibility} cgpa
                          </span>
                        </div>

                        {/* Date & Rounds Info */}
                        <div className="col-md-4 text-center text-md-start my-3 my-md-0">
                          <div className="d-flex align-items-center mb-2">
                            <span className="text-muted small uppercase fw-bold me-2">Scheduled:</span>
                            <span className="small">{new Date(drive.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                          </div>
                          <div>
                            <span className="text-muted small uppercase fw-bold d-block mb-1">Rounds</span>
                            <div className="d-flex flex-wrap gap-1">
                              {drive.rounds.map((round, i) => (
                                <span key={i} className="badge bg-light text-dark border py-1">
                                  {i + 1}. {round.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Action Hint */}
                        <div className="col-md-3 text-end">
                          <button className="btn btn-outline-secondary btn-sm">
                            Manage Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5 bg-white rounded shadow-sm">
            <p className="text-muted mb-0">No drives created yet. Start by adding your first recruitment drive.</p>
          </div>
        )}
      </div>

      <style>{`
        .admin-card {
          border-left: 4px solid transparent !important;
        }
        .admin-card:hover {
          transform: translateX(5px);
          border-left: 4px solid #0d6efd !important;
          background-color: #f8f9ff;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08) !important;
        }
        .transition-all {
          transition: all 0.2s ease-in-out;
        }
        .uppercase {
          text-transform: uppercase;
          letter-spacing: 0.8px;
          font-size: 0.7rem;
        }
      `}</style>
    </div>
  );
}

export default AdminDrives;