import { Router } from "express"
import * as studentController from "../controllers/student"

const router = Router()

router.route("/")
    .get(studentController.getAll)
    .post(studentController.create)
    .patch(studentController.update)
    
router.route("/:id")
    .get(studentController.get)
    .delete(studentController.remove)

export default router

