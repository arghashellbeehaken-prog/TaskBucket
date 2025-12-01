import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import UserModal from "../features/auth/UserModal";

const Navbar = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (err) {
      alert("error logging out");
    }
  };
  return (
    <div className="navbar">
      <div className="brand">
        <div className="brand-logo">
          <img className="logo-image" src="logo.png" alt="logo-image" />
        </div>
        <div>
          <h1 style={{ margin: 0 }}>TaskBucket</h1>
          <div className="small">Organize your task libraries</div>
        </div>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <div className="small" style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
              {user.username}{" "}
            </div>
            <button className="btn ghost" onClick={handleLogout}>
              Logout
            </button>
            <UserModal isOpen={showModal} onClose={() => setShowModal(false)} />
          </>
        ) : (
          <>
            <button className="btn ghost" onClick={() => (window.location.href = "/login")}>
              Login
            </button>
            <button className="btn" onClick={() => (window.location.href = "/signup")}>
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
