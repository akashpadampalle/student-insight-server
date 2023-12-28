import express from "express";
import * as userController from "../controllers/user";

const router = express.Router();

router.route('/')
    .get(userController.getAll)
    .post(userController.create)
    .patch(userController.update);

router.route('/:id')
    .get(userController.get)
    .delete(userController.remove);

export default router;