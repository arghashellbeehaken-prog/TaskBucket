import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "./authSlice";

const UserModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleStartEdit = () => {
    setEditing(true);
    setUsername(user.username || "");
  };

  const handleCancel = () => {
    setEditing(false);
    setPassword("");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {};
      if (username && username !== user.username) payload.username = username;
      if (password) payload.password = password;
      if (Object.keys(payload).length === 0) {
        setSaving(false);
        setEditing(false);
        return;
      }
      await dispatch(updateProfile(payload)).unwrap();
      setPassword("");
      setEditing(false);
    } catch (err) {
      alert(err || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>{user.username}</h3>
              <div className="small">{user.email}</div>
            </div>
            <div>
              <button className="btn ghost close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: 16 }}>
          {!editing ? (
            <div>
              <p className="small">Click Settings to change username or password.</p>
              <div style={{ marginTop: 8 }}>
                <button className="btn ghost" onClick={handleStartEdit}>
                  Settings
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label>Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label>New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
                <button className="btn ghost close" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
