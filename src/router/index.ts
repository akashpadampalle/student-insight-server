import express from "express"
import { notFoundError } from "../controllers/error"
import protectedRoutes from "./protectRoutes"
import * as authController from "../controllers/auth"
import handleInternalError from "../middlewares/handleError"

const router = express.Router()

router.get('/', (_, res) => {
    try {
        res.send('student insight api')
    } catch (error) {
        handleInternalError(res, error)
    }
})

router.post('/login', authController.login)
router.get('/refresh', authController.refresh)
router.get('/logout', authController.logout)

router.use(protectedRoutes)

router.all("*", notFoundError)

export default router