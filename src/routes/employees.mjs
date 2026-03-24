import express from "express";
import { createEmployeeSchema, updateEmployeeSchema, idSchema } from "../utils/validationschema.mjs";
import { validate } from "../utils/middleware.mjs";
import employee from "../model/employee.mjs";
import { verifyToken } from "../utils/authmiddlle.mjs";
import { authorizeRole } from "../utils/role.mjs";
import bcrypt from "bcrypt";

const router = express.Router();

// GET ALL EMPLOYEES — admin only

router.get("/api/employees", verifyToken, authorizeRole("admin"), async (req, res) => {
  try {
    const emp = await employee.find().select("-password");
    return res.json(emp);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// GET EMPLOYEE BY NAME — admin only
router.get("/api/employees/name", verifyToken, authorizeRole("admin"), async (req, res) => {
  const { name } = req.query;
  try {
    const found = await employee.findOne({ name }).select("-password");
    if (!found) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.json(found);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// CREATE EMPLOYEE — admin only
router.post("/api/employees",verifyToken,authorizeRole("admin"),validate(createEmployeeSchema, "body"),
async (req, res) => {

    try {

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newEmp = new employee({
        ...req.body,
        password: hashedPassword,
        employeeId: "EMP" + Date.now(),
        role: "employee",           // always employee — never from body
      });

      const saved = await newEmp.save();

      const result = saved.toObject();
      delete result.password;

      return res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
);

//UPDATE EMPLOYEE - admin only

// PUT — full update, admin only
router.put("/api/employees/:employeeId",verifyToken,authorizeRole("admin"),
  validate(idSchema, "params"),
  validate(updateEmployeeSchema, "body"),
  async (req, res) => {
    const { employeeId } = req.params;
    try {
      const updated = await employee.findOneAndUpdate(
        { employeeId },
        {
          name: req.body.name,
          phone: req.body.phone,
          status: req.body.status,
          department: req.body.department,
          address: {
            city: req.body.address.city,
            state: req.body.address.state,
          },
        },
        { new: true }
      ).select("-password");

      if (!updated) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);


// UPDATE EMPLOYEE — admin only
router.patch("/api/employees/:employeeId",verifyToken,authorizeRole("admin"),validate(idSchema, "params"),
  validate(updateEmployeeSchema, "body"),async (req, res) => {

    const { employeeId } = req.params;

    try {
      const updated = await employee.findOneAndUpdate(
        { employeeId },
        { $set: req.body },
        { new: true }
      ).select("-password");

      if (!updated) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

// DELETE EMPLOYEE — admin only
router.delete("/api/employees/:employeeId",verifyToken,authorizeRole("admin"),validate(idSchema, "params"),
  async (req, res) => {

    const { employeeId } = req.params;

    try {
      const deleted = await employee.findOneAndDelete({ employeeId }).select("-password");

      if (!deleted) {
        return res.status(404).json({ message: "Employee not found" });
      }

      return res.json({ message: "Employee deleted", employee: deleted });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

export default router;