import Router from "express";
import { SaleController } from "../controllers/sale.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", auth, SaleController.createSale);
router.post("/:id/detail", auth, SaleController.createSaleDetail);
router.get("/:id", auth, SaleController.getSaleById);
router.get("/", auth, SaleController.getAll);

export default router
