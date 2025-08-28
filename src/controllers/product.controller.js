import { ProductModel } from "../models/product.model.js";
import {CategoryModel} from "../models/category.model.js";
import {UserModel} from "../models/user.model.js";
import { validateProduct, validateProductUpdate } from "../schemas/product.schema.js";

export class ProductController{
    static async getAll(req, res){
        try{
            const products = await ProductModel.getAll(req.user.id);
            if (!products) return res.status(404).json({ error: "Products not found" });
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
            return res.status(200).json({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: product.category_name,
                is_active: product.is_active ? "Active" : "Inactive"
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async create(req, res){
        try{
            const result = validateProduct(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
            const user_id = req.user.id;

            const { name, description, price, stock, category_id} = result.data;

            const category = await CategoryModel.getById(category_id);
            if (!category) return res.status(404).json({ error: "Category not found" });

            const user = await UserModel.getById(user_id);
            if (!user) return res.status(404).json({ error: "User not found" });

            const product = await ProductModel.create(name, description, price, stock, category_id, user_id);

            return res.status(201).json({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                category: category.name,
                is_active: product.is_active ? "Active" : "Inactive"
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async update(req, res){
        try{
            const result = validateProductUpdate(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });
            const user_id = req.user.id;

            const { name, description, price, stock, category_id} = result.data;

            if(category_id){
                const category = await CategoryModel.getById(category_id);
                if (!category) return res.status(404).json({ error: "Category not found" });
            }

            const user = await UserModel.getById(user_id);
            if (!user) return res.status(404).json({ error: "User not found" });

            const product = await ProductModel.update(req.params.id, name, description, price, stock, category_id, user_id);

            if (!product) return res.status(404).json({ error: "Product not found" });

            return res.status(200).json(product);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async delete (req, res){
        try{
            const result = await ProductModel.delete(req.params.id);
            if (!result) return res.status(404).json({ error: "Product not found" });
            return res.status(204).json({ message: "Product set to inactive successfully" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}