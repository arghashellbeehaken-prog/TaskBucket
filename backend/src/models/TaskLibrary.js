const mongoose = require("mongoose");

const SubtaskSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const TaskLibrarySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    color: { type: String, default: "linear-gradient(90deg,#3b82f6,#60a5fa)" },
    completedPercentage: { type: Number, default: 0 },
    subtasks: [SubtaskSchema],
  },
  { timestamps: true }
);

TaskLibrarySchema.pre("save", function () {
  if (!this.subtasks || this.subtasks.length === 0) {
    this.completedPercentage = 0;
    this.color = "linear-gradient(90deg,#3b82f6,#60a5fa)";
    return;
  }

  const total = this.subtasks.length;
  const completed = this.subtasks.filter((st) => st.completed).length;
  this.completedPercentage = Math.round((completed / total) * 100);

  if (this.completedPercentage === 100) this.color = "linear-gradient(90deg,#dc2626,#ef4444)";
  else if (this.completedPercentage > 80) this.color = "linear-gradient(90deg,#f97316,#facc15)";
  else if (this.completedPercentage > 50) this.color = "linear-gradient(90deg,#10b981,#22c55e)";
  else if (this.completedPercentage > 25) this.color = "linear-gradient(90deg,#3b82f6,#60a5fa)";
  else this.color = "linear-gradient(90deg,#6b7280,#9ca3af)";
});

module.exports = mongoose.model("TaskLibrary", TaskLibrarySchema);
