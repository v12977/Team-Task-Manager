const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/taskController");

// 🔐 Only admin can create task
router.post("/", auth, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only admin can create tasks" });
  }
  next();
}, ctrl.createTask);

// Get tasks
router.get("/:projectId", auth, ctrl.getTasks);

// Update task
router.put("/:id", auth, ctrl.updateTask);

module.exports = router;