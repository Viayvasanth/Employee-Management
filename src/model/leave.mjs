import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  reason: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  adminRemark: {
    type: String,
    default: "",
  },

}, { timestamps: true });

export default mongoose.model("leave", leaveSchema);