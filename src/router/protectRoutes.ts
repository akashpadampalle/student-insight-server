import express from "express"
import interviewRoutes from "./interview"
import batchRoutes from "./batch"
import studentRoutes from "./student"
import resultRouter from "./result"
import userRouter from "./user"
import { getState } from "../controllers/state"
import verifyJWT from "../middlewares/veryJWT";
import adminCheck from "../middlewares/adminCheck"

const router = express.Router();


router.use(verifyJWT);
router.use('/interview', interviewRoutes)
router.use("/batch", batchRoutes)
router.use("/student", studentRoutes)
router.use("/result", resultRouter)
router.use("/user", adminCheck ,userRouter)
router.get("/state", getState)

export default router;
