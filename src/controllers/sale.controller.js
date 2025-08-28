import { validateSaleDetail, validateSaleDetailUpdate } from "../schemas/sale.schema.js";
import { SaleModel } from "../models/sale.model.js";
import { SaleDetailModel } from "../models/saleDetail.model.js";
import { ProductModel } from "../models/product.model.js";

export class SaleController{
    static async getAll(req, res){
        try{
            const sales = await SaleModel.getAll(req.user.id);
            return res.status(200).json(sales);
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async createSale(req, res){
        try{
            const sale = await SaleModel.create(req.user.id);
            return res.status(201).json({
                id: sale.id,
                total: sale.total,
                user_id: sale.user_id
            });
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getSaleById(req, res){
        try{
            const sale = await SaleModel.getById(req.params.id);
            if (!sale) return res.status(404).json({ error: "Sale not found" });
            return res.status(200).json(sale);
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async deleteSale(req, res){
        try{
            const result = await SaleModel.delete(req.params.id);
            if (!result) return res.status(404).json({ error: "Sale not found" });
            return res.status(204).json({ message: "Sale deleted successfully" });
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async createSaleDetail(req, res){
        try{
            const result = validateSaleDetail(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
            const { product_id, quantity } = result.data;
            const sale_id = req.params.id;

            const sale = await SaleModel.getById(sale_id);
            if (!sale) return res.status(404).json({ error: "Sale not found" });

            const product = await ProductModel.getById(product_id);
            if (!product) return res.status(404).json({ error: "Product not found" });
            const price = product.price;

            const saleDetail = await SaleDetailModel.create(sale_id, product_id, quantity, price);
            if (!saleDetail) return res.status(404).json({ error: "Sale detail not created" });
            return res.status(201).json({
                id: saleDetail.id,
                sale_id: saleDetail.sale_id,
                product_id: saleDetail.product_id,
                quantity: saleDetail.quantity
            });
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async updateSaleDetail(req, res){
        try{
            const result = validateSaleDetailUpdate(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
            const {quantity, product_id } = result.data;

            const product = await ProductModel.getById(product_id);
            if (!product) return res.status(404).json({ error: "Product not found" });
            const price = product.price;

            const saleDetail = await SaleDetailModel.update(req.params.id, quantity,product_id,price);

            if (!saleDetail) return res.status(404).json({ error: "Sale detail not updated" });

            return res.status(200).json({
                id: saleDetail.id,
                sale_id: saleDetail.sale_id,
                product_id: saleDetail.product_id,
                quantity: saleDetail.quantity
            });
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async deleteSaleDetail(req, res){
        try{
            const result = await SaleDetailModel.delete(req.params.id);
            if (!result) return res.status(404).json({ error: "Sale detail not deleted" });
            return res.status(204).json({ message: "Sale detail deleted successfully" });
        }catch(error){
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    
}
