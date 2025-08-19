import {Router} from "express";
import {UserController} from "../controllers/user.controller.js";

const router = Router();

router.post("/register", UserController.register);

router.post("/logout", UserController.logout);

router.post("/login", UserController.login);

router.get("/verify-token", UserController.verifyToken);

export default router;
