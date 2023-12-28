import { Router } from "express";
import * as resultRouter from "../controllers/result"

const router = Router()

router.route("/")
    .get(resultRouter.getAll)
    .post(resultRouter.create)
    .patch(resultRouter.update)

router.route("/csv")
    .get(resultRouter.getCSV)


router.route("/:id")
    .get(resultRouter.get)
    .delete(resultRouter.remove)


export default router