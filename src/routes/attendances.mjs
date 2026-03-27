import express from "express";
import attendance from "../model/attendance.mjs";
import { verifyToken } from "../utils/authmiddlle.mjs";
import { authorizeRole } from "../utils/role.mjs";

const router = express.Router();

// EMPLOYEE — mark attendance
router.post("/api/attendance", verifyToken, authorizeRole("employee"), async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // "2026-03-27"

    const existing = await attendance.findOne({
      employeeId: req.user.id,
      date: today,
    });

    if (existing) {
      return res.status(400).json({ message: "Attendance already marked for today" });
    }

    const newAttendance = await attendance.create({
      employeeId: req.user.id,
      date: today,
      status: req.body.status || "present",
    });

    return res.status(201).json(newAttendance);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// EMPLOYEE — view own attendance
router.get("/api/attendance/my", verifyToken, authorizeRole("employee"), async (req, res) => {
  try {
    const records = await attendance
      .find({ employeeId: req.user.id })
      .sort({ date: -1 });

    return res.json(records);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ADMIN — view all attendance
router.get("/api/attendance", verifyToken, authorizeRole("admin"), async (req, res) => {
  try {
    const records = await attendance
      .find()
      .populate("employeeId", "name employeeId department")
      .sort({ date: -1 });

    return res.json(records);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;