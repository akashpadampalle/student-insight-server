import express from "express"
import * as batchController from "../controllers/batch"

const router = express.Router()

router.route("/")
    .get(batchController.getAll)
    .post(batchController.create)
    .patch(batchController.update)

router.route("/:id")
    .get(batchController.get)
    .delete(batchController.remove)


export default router

