import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, updateTask } from "./tasksSlice";

const TaskFormModal = ({ isOpen, editingTask, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("linear-gradient(90deg,#3b82f6,#60a5fa)");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setColor(editingTask.color || "linear-gradient(90deg,#3b82f6,#60a5fa)");
    } else {
      setTitle("");
      setDescription("");
      setColor("linear-gradient(90deg,#3b82f6,#60a5fa)");
    }
  }, [editingTask, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await dispatch(
          updateTask({ id: editingTask._id, payload: { title, description, color } })
        ).unwrap();
      } else {
        await dispatch(createTask({ title, description, color })).unwrap();
      }
      onClose();
    } catch (err) {
      alert("cannot save task.");
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: 20 }}>
          <h3>{editingTask ? "Edit Task Library" : "New Task Library"} </h3>
          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <div className="field">
              <label>Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="field">
              <label>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="row" style={{ justifyContent: "flex-end", marginTop: 12 }}>
              <button className="btn ghost" type="button" onClick={onClose}>
                Cancel
              </button>
              <button className="btn" style={{ marginLeft: 8 }} type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
