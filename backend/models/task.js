const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: String,

  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  dueDate: Date,

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium"
  },

  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  }
});

module.exports = mongoose.model("Task", taskSchema);