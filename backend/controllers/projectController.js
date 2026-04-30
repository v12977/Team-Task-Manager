const Project = require("../models/project");

// CREATE PROJECT
exports.createProject = async (req, res) => {
  const project = await Project.create({
    ...req.body,
    createdBy: req.user.id,
    members: [req.user.id] // 🔥 creator auto member
  });

  res.json(project);
};

// GET PROJECTS (ROLE BASED)
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { members: req.user.id }
      ]
    }).populate("members", "name email");

    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
};

// ADD MEMBER
exports.addMember = async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.id);

  if (!project.members.includes(userId)) {
    project.members.push(userId);
    await project.save();
  }

  res.json(project);
};

// REMOVE MEMBER
exports.removeMember = async (req, res) => {
  const { userId } = req.body;

  const project = await Project.findById(req.params.id);

  project.members = project.members.filter(
    m => m.toString() !== userId
  );

  await project.save();

  res.json(project);
};