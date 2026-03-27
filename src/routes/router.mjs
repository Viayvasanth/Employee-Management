import express from "express";
import employeeRouter from "./employees.mjs";
import authRouter from "./auth.mjs";
import profileRouter from "./profile.mjs";
import leaveRouter from "./leaves.mjs";
import attendanceRouter from "./attendances.mjs"


const router = express.Router();

router.use(authRouter);
router.use(employeeRouter);
router.use(profileRouter);
router.use(leaveRouter);
router.use(attendanceRouter);

export default router;