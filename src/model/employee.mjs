import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({

  name: {
    type: String,
    trim: true,
    required: true,
  },

  employeeId: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
    match: [/.+\@.+\..+/, "Invalid email"]
  },

  phone: {
    type: String,
  },

  status: {
    type: Boolean,
    default: true,
  },

  department: {
    type: String,
  },

  address: {
    state: { type: String },
    city: { type: String },
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "employee"],
    required: true,
  },

}, { timestamps: true });

export default mongoose.model("employee", employeeSchema);