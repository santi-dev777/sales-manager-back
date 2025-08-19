import { ProductModel } from "../models/product.model.js";
import { validateProduct, validateProductUpdate } from "../schemas/product.schema.js";

export class ProductController{
    static async getAll(req, res){
        try{
            const products = await ProductModel.getAll(req.user.id);
            return res.status(200).json(products);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getById(req, res){
        try{
            const product = await ProductModel.getById(req.params.id);
            if (!product) return res.status(404).json({ error: "Product not found" });
            return res.status(200).json(product);
        } catch (error) {
            console.log(error)
            if (error.message === "Product not found") return res.status(404).json({ error: "Product not found" });
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async create(req, res){
        try{
            const result = validateProduct(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
            const user_id = req.user.id;

            const { name, description, price, stock, category_id} = result.data;

            const product = await ProductModel.create(name, description, price, stock, category_id, user_id);

            return res.status(201).json({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock
            });
        } catch (error) {
            console.log(error)
            if (error.message === "Category not found") return res.status(404).json({ error: "Category not found" });
            if (error.message === "User not found") return res.status(404).json({ error: "User not found" });
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}