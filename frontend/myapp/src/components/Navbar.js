// src/components/Navbar.js
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token or any auth info
    localStorage.removeItem("token");
    // Redirect to login
    navigate("/");
  };

  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Placement Admin</h2>
      <div style={styles.links}>
        <Link to="/admin/drives" style={styles.link}>Drives</Link>
        <Link to="/admin/create-drive" style={styles.link}>Create Drive</Link>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#2c3e50",
    color: "#fff"
  },
  logo: { margin: 0 },
  links: { display: "flex", gap: "15px", alignItems: "center" },
  link: { color: "#fff", textDecoration: "none", fontWeight: "bold" },
  logout: {
    backgroundColor: "#e74c3c",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold"
  }
};

export default Navbar;
