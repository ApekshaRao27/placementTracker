// src/pages/DriveDetails.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function DriveDetails() {
  const { id } = useParams();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/drives/${id}`)
      .then(res => {
        setDrive(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Drive details error:", err.response?.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  if (!drive) return <div className="container mt-5">Drive not found.</div>;

  // For "Applied Students", we usually look at Round 1 Attendees
  const appliedStudents = drive.rounds[0]?.attendees || [];

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      
      <div className="container py-5">
        {/* Header Breadcrumb / Title */}
        <div className="mb-4">
          <h1 className="fw-bold text-dark mb-1">{drive.companyName}</h1>
          <p className="text-muted">
            <span className="badge bg-primary me-2">{drive.role}</span>
            Scheduled for {new Date(drive.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
          </p>
        </div>

        <div className="row g-4">
          {/* Statistics Section */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Pipeline Overview</h5>
                {drive.rounds.map((round, i) => (
                  <div key={i} className="mb-3 p-2 rounded bg-white border">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold small">{i + 1}. {round.name}</span>
                      <span className="badge bg-secondary">{round.attendees.length}</span>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{ width: `${(round.cleared.length / (round.attendees.length || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.75rem' }}>
                      <span className="text-success">Cleared: {round.cleared.length}</span>
                      <span className="text-danger">Rejected: {round.rejected.length}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card border-0 shadow-sm bg-primary text-white">
              <div className="card-body p-4 text-center">
                <h2 className="fw-bold mb-0">{appliedStudents.length}</h2>
                <p className="small mb-0 opacity-75">Total Applicants</p>
              </div>
            </div>
          </div>

          {/* Student List Section */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3">
                <h5 className="fw-bold mb-0">Applied Students List</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th className="ps-4">Student Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        
                      </tr>
                    </thead>
                    <tbody>
                      {appliedStudents.length > 0 ? (
                        appliedStudents.map((student) => (
                          <li key={student._id} style={{ display: 'table-row' }}>
                            <td className="ps-4 fw-semibold text-dark">{student.name}</td>
                            <td className="text-muted small">{student.email}</td>
                            <td>
                              <span className="badge bg-success-subtle text-success border border-success-subtle">
                                Applied
                              </span>
                            </td>
                          </li>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center py-5 text-muted">
                            No students have applied yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriveDetails;
