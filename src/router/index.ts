import express from "express"
import { notFoundError } from "../controllers/error"
import protectedRoutes from "./protectRoutes"
import * as authController from "../controllers/auth"

const router = express.Router()

router.post('/login', authController.login)
router.get('/refresh', authController.refresh)
router.get('/logout', authController.logout)

router.use(protectedRoutes)

router.all("*", notFoundError)

export default router