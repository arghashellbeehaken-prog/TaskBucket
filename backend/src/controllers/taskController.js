const TaskLibrary = require("../models/TaskLibrary");
const crypto = require("crypto");

const generateId = () => crypto.randomBytes(8).toString("hex");

// create SuperTask
exports.createTask = async (req, res) => {
  try {
    const { title, description, color } = req.body;
    const task = await TaskLibrary.create({
      owner: req.userId,
      title,
      description,
      color,
      subtasks: [],
    });
    res.status(201).json({
      message: "Task created successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get all supertasks for user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await TaskLibrary.find({ owner: req.userId }).sort("-createdAt");
    res.json({
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// get a supertask by id
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await TaskLibrary.findById(id);
    if (!task) return res.status(404).json({ message: "task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update supertask
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, color } = req.body;
    const updated = await TaskLibrary.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { title, description, color },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Task Not Found" });
    res.json({
      message: "Task updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete a super task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await TaskLibrary.findOneAndDelete({ _id: id, owner: req.userId });
    if (!deleted)
      return res.status(404).json({ message: "Could not find the Task you wanted to delete." });
    res.json({ message: "Task deleted.", deleted });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// add a subtask
exports.addSubtask = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const subId = generateId();
    console.log(`[addSubtask] user=${req.userId} taskId=${id} text=${text}`);

    const task = await TaskLibrary.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { $push: { subtasks: { id: subId, text, completed: false } } },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task Not Found" });
    console.log(`[addSubtask] created subId=${subId} subtasksCount=${task.subtasks.length}`);

    res.json({
      message: "Subtask added successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// subtask completion
exports.toggleSubtask = async (req, res) => {
  try {
    const { id, subId } = req.params;
    console.log(`[toggleSubtask] user=${req.userId} taskId=${id} subId=${subId}`);
    const task = await TaskLibrary.findOne({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ message: "Task Not Found" });
    // robust id matching: coerce both sides to strings to handle legacy shapes
    const findSub = (list, target) =>
      list.find((s) => {
        const sid =
          s.id !== undefined && s.id !== null
            ? String(s.id)
            : s._id !== undefined && s._id !== null
            ? String(s._id)
            : undefined;
        return sid === String(target);
      });

    const sub = findSub(task.subtasks || [], subId);
    console.log(
      `[toggleSubtask] foundSub=${!!sub} subtasks=${JSON.stringify(
        task.subtasks.map((s) => ({
          id: s.id,
          _id: s._id ? String(s._id) : null,
          text: s.text,
          completed: s.completed,
        }))
      )}`
    );
    if (!sub) return res.status(404).json({ message: "Subtask Not Found" });
    sub.completed = !sub.completed;
    await task.save();
    res.json({
      message: "Subtask toggled successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// update subtask text
exports.updateSubtask = async (req, res) => {
  try {
    const { id, subId } = req.params;
    const { text } = req.body;
    console.log(`[updateSubtask] user=${req.userId} taskId=${id} subId=${subId} text=${text}`);

    const task = await TaskLibrary.findOne({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ message: "Task Not Found" });
    const findSub = (list, target) =>
      list.find((s) => {
        const sid =
          s.id !== undefined && s.id !== null
            ? String(s.id)
            : s._id !== undefined && s._id !== null
            ? String(s._id)
            : undefined;
        return sid === String(target);
      });

    const sub = findSub(task.subtasks || [], subId);
    console.log(
      `[updateSubtask] foundSub=${!!sub} subtasks=${JSON.stringify(
        task.subtasks.map((s) => ({ id: s.id, _id: s._id ? String(s._id) : null, text: s.text }))
      )}`
    );
    if (!sub) return res.status(404).json({ message: "Subtask Not Found" });
    sub.text = text;
    await task.save();
    res.json({
      message: "Subtask updated successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// delete subtask
exports.deleteSubtask = async (req, res) => {
  try {
    const { id, subId } = req.params;
    console.log(`[deleteSubtask] user=${req.userId} taskId=${id} subId=${subId}`);

    const task = await TaskLibrary.findOne({ _id: id, owner: req.userId });
    if (!task) return res.status(404).json({ message: "Task Not Found" });

    const originalLength = task.subtasks.length;
    console.log(
      `[deleteSubtask] beforeCount=${originalLength} subtasks=${JSON.stringify(
        task.subtasks.map((s) => ({ id: s.id, _id: s._id ? String(s._id) : null, text: s.text }))
      )}`
    );
    task.subtasks = task.subtasks.filter((s) => {
      const sid =
        s.id !== undefined && s.id !== null
          ? String(s.id)
          : s._id !== undefined && s._id !== null
          ? String(s._id)
          : null;
      return sid !== String(subId);
    });

    if (task.subtasks.length === originalLength)
      return res.status(404).json({ message: "Task or subtask not found" });

    await task.save();
    res.json({
      message: "Subtask deleted successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
