const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/projectController");

// 🔐 Only admin can create project
router.post("/", auth, (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Only admin can create project" });
  }
  next();
}, ctrl.createProject);

// Get projects
router.get("/", auth, ctrl.getProjects);

// Members
router.put("/:id/add-member", auth, ctrl.addMember);
router.put("/:id/remove-member", auth, ctrl.removeMember);

module.exports = router;