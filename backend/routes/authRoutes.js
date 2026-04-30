const router = require("express").Router();
const ctrl = require("../controllers/authController");
const auth = require("../middleware/auth"); // ✅ FIXED PATH

router.post("/register", ctrl.register);
router.post("/login", ctrl.login);

// 🔐 Protected route
router.get("/users", auth, ctrl.getUsers);

module.exports = router;