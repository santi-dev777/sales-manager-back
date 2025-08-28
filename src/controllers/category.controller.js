import { CategoryModel } from "../models/category.model.js";
import { validateCategory, validateCategoryUpdate } from "../schemas/category.schema.js";

export class CategoryController {
    static async getAll (req, res) {
        try{
            const categories = await CategoryModel.getAll();
            if (!categories) return res.status(404).json({ error: "Categories not found" });
            return res.status(200).json(categories);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async getById (req, res) {
        try{
            const category = await CategoryModel.getById(req.params.id);
            if (!category) return res.status(404).json({ error: "Category not found" });
            return res.status(200).json(category);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    static async create (req, res) {
        try{
            const result = validateCategory(req.body);
            if (!result.success) return res.status(400).json({ error: JSON.parse(result.error.message) });

        const { name, description } = result.data;

        const categoryExists = await CategoryModel.getByname(name);
        if (categoryExists) return res.status(400).json({ error: "Category already exists with this name" });

        const newCategory = await CategoryModel.create(name, description);
        if (!newCategory) return res.status(400).json({ error: "Category not created" });
        return res.status(201).json(newCategory);
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
    }

    static async update (req, res){
        try{
            const result = validateCategoryUpdate(req.body);
            if (!result.success) {
                return res.status(400).json({ error: JSON.parse(result.error.message) });
            }

        const { name, description } = result.data;

        const updatedCategory = await CategoryModel.update(req.params.id, name, description);

        return res.status(200).json(updatedCategory);
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
    }

    static async delete (req, res){
        try{
            const result = await CategoryModel.delete(req.params.id);
            if (!result) return res.status(404).json({ error: "Category not found" });
            return res.status(204).json({ message: "Category deleted successfully" });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}