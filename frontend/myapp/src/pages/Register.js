import { useState } from "react";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", usn: "", branch: "", cgpa: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("Account created successfully!");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="register-card">
            <h2 className="text-center mb-2 fw-bold">Create Account</h2>
            <p className="text-muted text-center mb-4">Enter your details to get started</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input className="form-control custom-input" name="name" placeholder="John Doe" onChange={handleChange} required />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input className="form-control custom-input" type="email" name="email" placeholder="name@college.edu" onChange={handleChange} required />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">USN</label>
                  <input className="form-control custom-input" name="usn" placeholder="4SF..." onChange={handleChange} required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">CGPA</label>
                  <input className="form-control custom-input" name="cgpa" placeholder="9.5" onChange={handleChange} required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Branch</label>
                <input className="form-control custom-input" name="branch" placeholder="Computer Science" onChange={handleChange} required />
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input className="form-control custom-input" type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
              </div>

              <button className="btn btn-primary btn-register w-100 mb-3">Sign Up</button>
              
              <p className="text-center text-muted small">
                Already have an account? <a href="/" className="text-decoration-none fw-bold">Login</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;