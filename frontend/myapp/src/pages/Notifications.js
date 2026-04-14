import { useEffect, useState } from "react";
import api from "../utils/api";
import StudentNavbar from "../components/studentNavbar";

function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get("/student/notifications")
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-light min-vh-100">
      <StudentNavbar />
      <div className="container py-5" style={{ maxWidth: "800px" }}>
        <h2 className="fw-bold mb-4 text-dark">Recent Notifications</h2>
        
        {notifications.length === 0 ? (
          <div className="text-center p-5 bg-white rounded shadow-sm">
            <p className="text-muted mb-0">No new updates yet.</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n._id} className={`card mb-3 border-0 shadow-sm border-start border-4 border-${n.type}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="mb-0 fw-medium">{n.message}</p>
                  <small className="text-muted">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notifications;