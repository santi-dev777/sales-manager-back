import { Router } from "express"
import { ProductController } from "../controllers/product.controller.js"
import { auth } from "../middlewares/auth.middleware.js"

const router = Router();

router.get("/", auth, ProductController.getAll);
router.get("/:id", auth, ProductController.getById);
router.post("/", auth, ProductController.create);
router.patch("/:id", auth, ProductController.update);
router.delete("/:id", auth, ProductController.delete);

export default router