import { Router } from "express"
import { CategoryController } from "../controllers/category.controller.js"
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth, CategoryController.getAll);
router.get("/:id", auth, CategoryController.getById);
router.post("/", auth, CategoryController.create);
router.patch("/:id", auth, CategoryController.update);
router.delete("/:id", auth, CategoryController.delete);

export default router;