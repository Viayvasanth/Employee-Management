import express from "express";
import employee from "../model/employee.mjs";
import bcrypt from "bcrypt";
import { validate } from "../utils/middleware.mjs";
import { loginSchema } from "../utils/validationschema.mjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// LOGIN — both admin and employee use this
const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.json({ message: "Login successful", role: user.role });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

router.post("/api/auth/login", validate(loginSchema, "body"), loginEmployee);

// LOGOUT
router.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  return res.json({ message: "Logged out successfully" });
});

export default router;