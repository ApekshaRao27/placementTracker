// src/components/StudentNavbar.js
import { Link, useNavigate, useLocation} from "react-router-dom";
import api from "../utils/api";
import { useEffect, useState } from "react";

function StudentNavbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUnreadCount();
  }, [location.pathname]); // Re-fetch when the page changes

  const fetchUnreadCount = () => {
    api.get("/student/notifications")
      .then(res => {
        // Only count notifications where isRead is false
        const unread = res.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      })
      .catch(err => console.error("Notif error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Improved helper to handle different student sub-routes
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" style={{ backgroundColor: "#1a252f" }}>
      <div className="container">
        <Link className="navbar-brand fw-bold d-flex align-items-center" to="/student/dashboard">
          <span className="bg-success text-white px-2 py-1 rounded me-2" style={{ fontSize: '0.9rem' }}>S</span>
          Placement<span className="text-success">Student</span>
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#studentNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="studentNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item mx-lg-2">
              <Link 
                to="/student" 
                className={`nav-link px-3 transition-all ${isActive("/student/dashboard") ? "active fw-bold text-white" : ""}`}
              >
                Available Drives
              </Link>
            </li>
            
            <li className="nav-item mx-lg-2">
              <Link 
                to="/student/notifications" 
                className={`nav-link px-3 position-relative transition-all ${isActive("/student/notifications") ? "active fw-bold text-white" : ""}`}
              >
                Notifications
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow-sm" style={{ fontSize: '0.65rem', border: '2px solid #1a252f' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            </li>

            <li className="nav-item ms-lg-3">
              <button 
                onClick={handleLogout} 
                className="btn btn-outline-danger btn-sm px-4 fw-bold rounded-pill shadow-sm"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        .navbar { padding: 0.8rem 0; }
        .nav-link { position: relative; color: rgba(255,255,255,0.7) !important; transition: all 0.3s ease; }
        .nav-link:hover { color: #fff !important; }
        
        .nav-link.active::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 15%;
          width: 70%;
          height: 2px;
          background-color: #198754; 
          border-radius: 2px;
        }
        
        @media (max-width: 991px) {
          .nav-item { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); width: 100%; }
          .btn { width: 100%; margin-top: 10px; }
        }
      `}</style>
    </nav>
  );
}

export default StudentNavbar;