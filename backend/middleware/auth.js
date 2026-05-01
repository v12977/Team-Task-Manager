const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // ❌ Wrong format (must be "Bearer TOKEN")
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = decoded;

    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);

    // Better error messages
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired" });
    }

    return res.status(401).json({ msg: "Invalid token" });
  }
};