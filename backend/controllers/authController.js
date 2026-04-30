const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ======================
// 🔐 REGISTER
// ======================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "All fields are required"
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        msg: "User already exists"
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      msg: "User registered successfully",
      user
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err); // 🔥 Debug log
    res.status(500).json({
      msg: "Internal server error"
    });
  }
};



// ======================
// 🔐 LOGIN
// ======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        msg: "Email and password are required"
      });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User not found"
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        msg: "Wrong password"
      });
    }

    // ✅ Generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // 🔥 added expiry
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({
      msg: "Internal server error"
    });
  }
};



// ======================
// 👥 GET ALL USERS
// ======================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email role");
    res.json(users);

  } catch (err) {
    console.log("GET USERS ERROR:", err);
    res.status(500).json({
      msg: "Internal server error"
    });
  }
};