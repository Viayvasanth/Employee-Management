import express from "express";
import leave from "../model/leave.mjs";
import { verifyToken } from "../utils/authmiddlle.mjs";
import { authorizeRole } from "../utils/role.mjs";

const router = express.Router();

// EMPLOYEE — apply for leave
router.post("/api/leaves", verifyToken, authorizeRole("employee"), async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "startDate, endDate and reason are required" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "startDate cannot be after endDate" });
    }

    const newLeave = await leave.create({
      employeeId: req.user.id,
      startDate,
      endDate,
      reason,
    });

    return res.status(201).json(newLeave);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// EMPLOYEE — view own leave requests
router.get("/api/leaves/my", verifyToken, authorizeRole("employee"), async (req, res) => {
  try {
    const leaves = await leave
      .find({ employeeId: req.user.id })
      .sort({ createdAt: -1 });

    return res.json(leaves);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ADMIN — view all leave requests
router.get("/api/leaves", verifyToken, authorizeRole("admin"), async (req, res) => {
  try {
    const leaves = await leave
      .find()
      .populate("employeeId", "name email employeeId department")
      .sort({ createdAt: -1 });

    return res.json(leaves);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ADMIN — approve or reject leave
router.patch("/api/leaves/:id", verifyToken, authorizeRole("admin"), async (req, res) => {
  try {
    const { status, adminRemark } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be approved or rejected" });
    }

    const updated = await leave.findByIdAndUpdate(
      req.params.id,
      { status, adminRemark: adminRemark || "" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Leave not found" });
    }

    return res.json(updated);

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;