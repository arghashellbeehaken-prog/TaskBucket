import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addSubtask, toggleSubtask, deleteSubtask, editSubtask } from "./tasksSlice";

const TaskModal = ({ task, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [newText, setNewText] = useState("");
  const [editing, setEditing] = useState({});

  const latestTask =
    useSelector((s) => (task ? s.tasks.items.find((t) => t._id === task._id) : null)) || task;

  useEffect(() => {
    if (isOpen) {
      setNewText("");
      setEditing({});
    }
  }, [isOpen, task]);

  if (!isOpen || !latestTask) return null;

  const getSid = (sub) => sub.id || (sub._id ? sub._id.toString() : undefined);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newText.trim()) return;
    try {
      await dispatch(addSubtask({ id: latestTask._id, text: newText })).unwrap();
      setNewText("");
    } catch (err) {
      alert(err || "Failed to add subtask");
    }
  };

  const handleToggle = async (sub) => {
    const subId = getSid(sub);
    if (!subId) return alert("Invalid subtask id");
    try {
      await dispatch(toggleSubtask({ id: latestTask._id, subId })).unwrap();
    } catch (err) {
      alert(err || "Failed to toggle subtask");
    }
  };

  const handleDelete = async (sub) => {
    const subId = getSid(sub);
    if (!subId) return alert("Invalid subtask id");

    /* eslint-disable-next-line no-restricted-globals */
    if (!confirm("Delete this subtask?")) return;
    try {
      await dispatch(deleteSubtask({ id: latestTask._id, subId })).unwrap();
    } catch (err) {
      alert(err || "Failed to delete subtask");
    }
  };

  const startEdit = (sub) => setEditing((s) => ({ ...s, [getSid(sub)]: sub.text }));
  const cancelEdit = (sub) =>
    setEditing((s) => {
      const copy = { ...s };
      delete copy[getSid(sub)];
      return copy;
    });
  const saveEdit = async (sub) => {
    const subId = getSid(sub);
    const text = editing[subId];
    if (!text || !text.trim()) return;
    try {
      await dispatch(editSubtask({ id: latestTask._id, subId, text })).unwrap();
      cancelEdit(sub);
    } catch (err) {
      alert(err || "Failed to edit subtask");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 20, background: latestTask.color || "#3b82f6", color: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ margin: 0 }}>{latestTask.title}</h3>
              <div style={{ opacity: 0.9, fontSize: 13 }}>{latestTask.description}</div>
            </div>
            <div>
              <button className="btn ghost close" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="modal-subtasks-list">
          {(!latestTask.subtasks || latestTask.subtasks.length === 0) && (
            <div style={{ textAlign: "center", padding: 28, color: "#9aa4b2" }}>
              No subtasks yet.
            </div>
          )}

          {latestTask.subtasks?.map((sub) => {
            const sid = getSid(sub);
            const isEditing = !!editing[sid];
            return (
              <div className="subtask-item" key={sid}>
                <input
                  type="checkbox"
                  checked={!!sub.completed}
                  onChange={() => handleToggle(sub)}
                />
                {isEditing ? (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", flex: 1 }}>
                    <input
                      value={editing[sid]}
                      onChange={(e) => setEditing((s) => ({ ...s, [sid]: e.target.value }))}
                      style={{ flex: 1 }}
                    />
                    <button className="btn ghost cancel" onClick={() => cancelEdit(sub)}>
                      Cancel
                    </button>
                    <button className="btn" onClick={() => saveEdit(sub)}>
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className={`subtask-text ${sub.completed ? "task-completed" : ""}`}
                      style={{ flex: 1 }}
                    >
                      {sub.text}
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <button className="btn ghost" onClick={() => startEdit(sub)}>
                        Edit
                      </button>
                      <button className="btn ghost delete" onClick={() => handleDelete(sub)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="modal-addSubtask">
          <form className="modal-form" onSubmit={handleAdd}>
            <input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Add subtask..."
            />
            <button className="btn" type="submit">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
