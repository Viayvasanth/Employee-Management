import express from "express";
import employee from "../model/employee.mjs";
import { verifyToken } from "../utils/authmiddlle.mjs";

const router = express.Router();

// GET OWN PROFILE — any logged in user (admin or employee)
router.get("/api/profile", verifyToken, async (req, res) => {
  try {
    const user = await employee
      .findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;