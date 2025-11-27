const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const taskController = require("../controllers/taskController");

router.use(auth);

// supertask operation CRUD
router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

// subtask operation
router.post("/:id/subtasks", taskController.addSubtask);
router.patch("/:id/subtasks/:subId", taskController.updateSubtask);
router.patch("/:id/subtasks/:subId/toggle", taskController.toggleSubtask);
router.delete("/:id/subtasks/:subId", taskController.deleteSubtask);

module.exports = router;
