import React from "react";

const TaskCard = ({ task, onClick, onDelete, onEdit }) => {
  const completedCount = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalCount = task.subtasks?.length || 0;
  const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  // color comes from the backend; comes as string
  const headerStyle = {
    background: task.color || "linear-gradient(90deg,#3b82f6,#60a5fa)",
    padding: 16,
    color: "white",
  };

  return (
    <div className="taskcard-container" onClick={onClick}>
      <div className="taskcard-header" style={headerStyle}>
        <div className="taskcard-title">{task.title}</div>
        <div className="taskcard-desc">{task.description}</div>
      </div>

      <div className="taskcard-body">
        {totalCount === 0 ? (
          <div className="small">No subtasks yet</div>
        ) : (
          <>
            <div className="taskcard-body-progress">
              <span className="small">Progress</span>
              <span className="small">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </>
        )}
        <div className="taskcard-remaining">
          <div className="small">{totalCount - completedCount} remaining</div>
          <div className="right">
            <button
              className="btn ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              Edit
            </button>
            <button
              className="btn delete"
              style={{ marginLeft: 8 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
