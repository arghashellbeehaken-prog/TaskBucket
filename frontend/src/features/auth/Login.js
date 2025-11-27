import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./authSlice";

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login({ identifier, password })).unwrap();
      navigate("/");
    } catch (err) {
      alert(err?.message || "Login failed");
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username or Email</label>
            <input value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </div>
          <div className="field">
            <label>password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="row">
            <div>
              <button className="btn" type="submit">
                Login
              </button>
            </div>
            <div className="small">
              <span>New to TaskBucket? </span>
              <Link to="/signup">Create an account.</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
