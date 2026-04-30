const Task = require("../models/task");

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, projectId, assignedTo, dueDate, priority } = req.body;

    const task = await Task.create({
      title,
      projectId,
      assignedTo,
      dueDate,
      priority,
      status: "todo"
    });

    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET TASKS (ROLE BASED)
exports.getTasks = async (req, res) => {
  try {
    let tasks = await Task.find({
      projectId: req.params.projectId
    }).populate("assignedTo", "name email");

    // 🔐 Member sees only assigned tasks
    if (req.user.role === "member") {
      tasks = tasks.filter(
        t => t.assignedTo?._id.toString() === req.user.id
      );
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE TASK
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json(err);
  }
};