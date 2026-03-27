import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employee",
    required: true,
  },

  date: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },

}, { timestamps: true });

// prevent duplicate attendance for same employee on same day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export default mongoose.model("attendance", attendanceSchema);