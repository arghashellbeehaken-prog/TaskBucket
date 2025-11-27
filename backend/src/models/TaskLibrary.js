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
    subtasks: [SubtaskSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskLibrary", TaskLibrarySchema);
