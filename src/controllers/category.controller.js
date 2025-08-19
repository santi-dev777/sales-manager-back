import { CategoryModel } from "../models/category.model.js";
import { validateCategory, validateCategoryUpdate } from "../schemas/category.schema.js";

export class CategoryController {
    static async getAll (req, res) {
        try{
            const categories = await CategoryModel.getAll();
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
            if (!result.success) {
            return res.status(400).json({ error: result.error.message });
        }

        const { name, description } = result.data;

        const newCategory = await CategoryModel.create(name, description);

        return res.status(201).json(newCategory);
    } catch ( error ) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
}