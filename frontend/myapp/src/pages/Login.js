import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Assuming you use react-router

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // Redirect based on user role
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="register-card"> {/* Using the same card class for consistency */}
            <h2 className="text-center mb-2 fw-bold">Welcome Back</h2>
            <p className="text-muted text-center mb-4">Please enter your details to login</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input 
                  className="form-control custom-input" 
                  type="email" 
                  name="email" 
                  placeholder="name@college.edu" 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label">Password</label>
                  <a href="/forgot" className="small text-decoration-none">Forgot?</a>
                </div>
                <input 
                  className="form-control custom-input" 
                  type="password" 
                  name="password" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <button 
                className="btn btn-primary btn-register w-100 mb-3" 
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Login"
                )}
              </button>
              
              <p className="text-center text-muted small">
                New user? <a href="/register" className="text-decoration-none fw-bold">Create an account</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;