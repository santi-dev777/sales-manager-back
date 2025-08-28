import Router from "express";
import { SaleController } from "../controllers/sale.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", auth, SaleController.createSale);
router.post("/:id/detail", auth, SaleController.createSaleDetail);
router.get("/:id", auth, SaleController.getSaleById);
router.get("/", auth, SaleController.getAll);
router.patch("/:id/detail", auth, SaleController.updateSaleDetail);
router.delete("/:id/detail",auth, SaleController.deleteSaleDetail)
router.delete("/:id",auth, SaleController.deleteSale)

export default router
