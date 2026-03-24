import express from "express";
import employeeRouter from "./employees.mjs";
import authRouter from "./auth.mjs";
import profileRouter from "./profile.mjs";

const router = express.Router();

router.use(authRouter);
router.use(employeeRouter);
router.use(profileRouter);

export default router;