// src/pages/DriveDetails.js
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";
import Navbar from "../components/Navbar";

function DriveDetails() {
  const { id } = useParams();
  const [drive, setDrive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState(0);

  const fetchDrive = async () => {
    try {
      const res = await api.get(`/admin/drives/${id}`);
      setDrive(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrive();
  }, [id]);

  const handleClearStudent = async (studentId, studentName) => {
    // 1. Confirmation Step
    const confirmMove = window.confirm(
      `Are you sure you want to promote ${studentName} to the next round?`
    );

    if (!confirmMove) return;

    try {
      // 2. API Call to Clear/Promote
      await api.post(`/admin/drives/${id}/rounds/${selectedRound}/clear/${studentId}`);
      
      // 3. Re-fetch data to update UI instantly
      fetchDrive(); 
    } catch (err) {
      alert(err.response?.data?.msg || "Error promoting student");
    }
  };

  if (loading || !drive) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const handleRejectStudent = async (studentId, studentName) => {
  if (!window.confirm(`Are you sure you want to REJECT ${studentName} from this drive?`)) return;

  try {
    await api.post(`/admin/drives/${id}/rounds/${selectedRound}/reject/${studentId}`);
    fetchDrive(); // Refresh UI
  } catch (err) {
    alert("Error rejecting student");
  }
};
  const currentRoundData = drive.rounds[selectedRound];
  const studentsInRound = currentRoundData?.attendees || [];
  
  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      
      <div className="container py-5">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold text-dark mb-1">{drive.companyName}</h1>
            <p className="text-muted mb-0">Role: <span className="fw-bold">{drive.role}</span></p>
          </div>
          
          {/* Round Navigation Tabs */}
          <div className="btn-group shadow-sm">
            {drive.rounds.map((r, i) => (
              <button 
                key={i} 
                className={`btn ${selectedRound === i ? 'btn-primary' : 'btn-white border'}`}
                onClick={() => setSelectedRound(i)}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-4">
          {/* Statistics Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h6 className="fw-bold text-uppercase small text-muted mb-3">Round Analytics: {currentRoundData.name}</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Total Candidates:</span>
                  <span className="fw-bold">{currentRoundData.attendees.length}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Cleared:</span>
                  <span className="fw-bold">{currentRoundData.cleared.length}</span>
                </div>
                <div className="d-flex justify-content-between text-danger">
                  <span>Rejected:</span>
                  <span className="fw-bold">{currentRoundData.rejected.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Management Table */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm overflow-hidden">
              <div className="card-header bg-white py-3">
                <h5 className="fw-bold mb-0">Candidate Management</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Candidate Name</th>
                      <th>Email Address</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  {/* Student Management Table Body */}
                                  <tbody>
                  {studentsInRound.length > 0 ? (
                    studentsInRound.map((student) => {
                      // 1. Check if student is Cleared
                      const isCleared = currentRoundData.cleared.some((c) => {
                        const clearedId = c._id ? c._id.toString() : c.toString();
                        return clearedId === student._id.toString();
                      });

                      // 2. Check if student is Rejected
                      const isRejected = currentRoundData.rejected.some((r) => {
                        const rejectedId = r._id ? r._id.toString() : r.toString();
                        return rejectedId === student._id.toString();
                      });

                      return (
                        <tr key={student._id}>
                          <td className="ps-4 fw-semibold text-dark">{student.name}</td>
                          <td className="text-muted small">{student.email}</td>
                          <td className="text-center">
                            {isCleared ? (
                              /* Show Cleared Badge */
                              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                                ✓ Cleared & Promoted
                              </span>
                            ) : isRejected ? (
                              /* Show Rejected Badge */
                              <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2">
                                ✕ Rejected
                              </span>
                            ) : (
                              /* Show BOTH buttons if neither cleared nor rejected */
                              <div className="d-flex justify-content-center gap-2">
                                <button 
                                  className="btn btn-sm btn-success px-3 shadow-sm fw-bold"
                                  onClick={() => handleClearStudent(student._id, student.name)}
                                >
                                  Cleared
                                </button>
                                <button 
                                  className="btn btn-sm btn-outline-danger px-3 fw-bold"
                                  onClick={() => handleRejectStudent(student._id, student.name)}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-5 text-muted">
                        No candidates reached this round yet.
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
  );
}

export default DriveDetails;
