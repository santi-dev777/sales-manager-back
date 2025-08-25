import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const CategoryModel = {
    getAll: async () => {
        const [rows] = await pool.query("SELECT id, name, description FROM categories");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query("SELECT id, name, description FROM categories WHERE id = ?", [id]);
        if (rows.length === 0) throw new Error("Category not found");
        return rows[0];
    },

    create: async (name, description) => {
        const id = uuidv4()
        const [result] = await pool.query("INSERT INTO categories (id, name, description) VALUES (?, ?, ?)", [id, name, description]);
        return await CategoryModel.getById(id);
    },

    update: async (id, name, description) => {
        const [result] = await pool.query(
            "UPDATE categories SET name = IFNULL(?, name), description = IFNULL(?, description) WHERE id = ?",
            [name, description, id]
        );
        if (result.affectedRows === 0) throw new Error("Category not found");
        return await CategoryModel.getById(id);
    },

    delete: async (id) => {
        const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
        if (result.affectedRows === 0) throw new Error("Category not found");
    },
}