import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import employee from "./src/model/employee.mjs";

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB connected");

    const existing = await employee.findOne({ email: "admin@company.com" });

    if (existing) {
      console.log("Admin already exists. Exiting.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await employee.create({
      name: "Admin",
      email: "admin@company.com",
      password: hashedPassword,
      role: "admin",
      employeeId: "EMPADMIN001",
      phone: "0000000000",
      status: true,
      department: "Management",
      address: {
        state: "TN",
        city: "Chennai",
      },
    });

    console.log("Admin created successfully");
    console.log("Email: admin@company.com");
    console.log("Password: Admin@123");
    process.exit(0);

  } catch (error) {
    console.log("Seed error:", error.message);
    process.exit(1);
  }
};

seed();