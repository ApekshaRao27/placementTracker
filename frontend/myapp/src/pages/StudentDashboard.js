// src/pages/StudentDashboard.js
import { useEffect, useState } from "react";
import api from "../utils/api";
import StudentNavbar from "../components/studentNavbar";

function StudentDashboard() {
  const [drives, setDrives] = useState([]);
  const [studentCgpa, setStudentCgpa] = useState(0); // Added to store student's CGPA
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/drives");
      setDrives(res.data.drives || res.data); 
      setStudentCgpa(res.data.studentCgpa || 0);
    } catch (err) {
      console.error("Failed to fetch drives", err);
    } finally {
      setLoading(false);
    }
  };

  const applyDrive = async (id) => {
    try {
      await api.post(`/student/apply/${id}`);
      alert("Applied successfully!");
      fetchDrives();
    } catch (err) {
      // This will now catch the "Eligibility failed" message from backend
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'cleared': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'in progress': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
    <StudentNavbar/>
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark">Placement Drives</h2>
        <div className="text-end">
           <span className="badge bg-primary me-2 px-3 py-2">My CGPA: {studentCgpa}</span>
           <span className="badge bg-light text-dark border">{drives.length} Opportunities</span>
        </div>
      </div>

      <div className="row g-4">
        {drives.map((d) => {
          // LOCAL ELIGIBILITY CHECK
          const isEligible = studentCgpa >= d.eligibility;

          return (
            <div key={d._id} className="col-md-6 col-lg-4">
              <div className={`card h-100 shadow-sm border-0 transition-all ${!d.applied && !isEligible ? 'opacity-75' : 'hover-shadow'}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title fw-bold mb-0 text-primary">{d.companyName}</h5>
                    {d.applied && (
                      <span className={`badge rounded-pill ${getStatusBadge(d.status)}`}>
                        {d.status}
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-muted small mb-1 uppercase fw-semibold">Role</p>
                    <p className="mb-2 text-dark font-medium">{d.role}</p>
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <p className="text-muted small mb-1 uppercase fw-semibold">Date</p>
                      <p className="small mb-0 text-dark">📅 {new Date(d.date).toLocaleDateString()}</p>
                    </div>
                    {/* Visual Eligibility indicator */}
                    <div className="col-6 text-end">
                      <p className="text-muted small mb-1 uppercase fw-semibold">Min. CGPA</p>
                      <p className={`small mb-0 fw-bold ${!isEligible ? 'text-danger' : 'text-success'}`}>
                        {d.eligibility}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto border-top pt-3">
                    {d.applied ? (
                      <button className="btn btn-light w-100 text-muted fw-bold py-2" disabled>
                        ✓ Applied
                      </button>
                    ) : !isEligible ? (
                      <div className="text-center">
                        <small className="text-danger fw-bold d-block mb-2">Not Eligible</small>
                        <button className="btn btn-secondary w-100 py-2 opacity-50" disabled>
                          Locked
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline-primary w-100 fw-bold py-2 shadow-sm"
                        onClick={() => applyDrive(d._id)}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
          transition: all 0.3s ease;
        }
        .transition-all { transition: all 0.3s ease; }
        .uppercase { text-transform: uppercase; letter-spacing: 0.5px; }
      `}</style>
    </div>
    </>
  );
}

export default StudentDashboard;