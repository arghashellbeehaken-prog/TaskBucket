import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTask, deleteTask } from "./tasksSlice";
import TaskModal from "./TaskModal";
import TaskCard from "./TaskCard";
import TaskFormModal from "./TaskFormModal";

const Dashboard = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((s) => s.tasks.items);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTask());
  }, [dispatch]);

  const openCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };
  const openEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <div className="container">
      <div className="dashboard">
        <div>
          <h2 style={{ margin: 18 }}>My Library</h2>
          <p className="small">Manage your task libraries.</p>
        </div>
        <div>
          <button className="btn add-library" onClick={openCreate}>
            New Collection
          </button>
        </div>
      </div>
      <div className="grid">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => setSelectedTask(task)}
            onDelete={() => dispatch(deleteTask(task._id))}
            onEdit={() => openEdit(task)}
          />
        ))}
        <div className="taskcard-container taskcard-dashboard" onClick={openCreate}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>+</div>
            <div>Create new task library</div>
          </div>
        </div>
      </div>
      <TaskModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
      />
      <TaskFormModal
        isOpen={isFormOpen}
        editingTask={editingTask}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
