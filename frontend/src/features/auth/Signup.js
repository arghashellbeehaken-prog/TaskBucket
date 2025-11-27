import { useState } from "react";
import { signup } from "./authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(signup({ username, email, password })).unwrap();
      navigate("/");
    } catch (err) {
      alert(err?.message || "Signup Failed!");
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="row">
            <button className="btn" type="submit">
              Sign up
            </button>
            <div className="small">
              <span>Already have an account? </span>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
