import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "./authSlice";
import api from "../../api/apiClient";

const UserModal = ({ isOpen, onClose }) => {
  console.log("hjsjhadjha");
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [historyTasks, setHistoryTasks] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen || !user) return null;

  console.log(user);

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
      const payload = { userId: user.id };
      if (!currentPassword) {
        alert("put current password for authentication.");
        return;
      }
      if (username && username !== user.username) payload.username = username;
      if (password) payload.password = password;
      payload.currentPassword = currentPassword;

      if (Object.keys(payload).length <= 1 && !password && !username) {
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

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await api.get(`/tasks?owner=${user.id}`);
      setHistoryTasks(res.data.data);
      console.log(res.data.data);
    } catch (err) {
      console.error("Failed to load history", err);
      alert(err.response?.data?.message || "Failed to load history");
    } finally {
      setLoadingHistory(false);
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
              <div className="small">{user.id}</div>
            </div>
            <div>
              <h3>User task history</h3>
              {loadingHistory ? (
                <p className="small">Loading...</p>
              ) : historyTasks.length === 0 ? (
                <p className="small">No tasks found.</p>
              ) : (
                historyTasks.map((t, index) => (
                  <p key={t._id} className="small">
                    {index + 1}. {t.title}
                  </p>
                ))
              )}
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
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
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
