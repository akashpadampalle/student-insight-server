import express from "express"
import * as interviewController from "../controllers/interview"

const router = express.Router()

router.route('/')
    .get(interviewController.getAll)
    .post(interviewController.create)
    .patch(interviewController.update)

router.route('/:id')
    .get(interviewController.get)
    .delete(interviewController.remove)


export default router