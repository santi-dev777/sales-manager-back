import { pool } from "../config/db.js";

export const CategoryModel = {
    getAll: async () => {
        const [rows] = await pool.query("SELECT id, name, description FROM categories");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query("SELECT id, name, description FROM categories WHERE id = ?", [id]);
        return rows[0];
    },

    create: async (name, description) => {
        const [result] = await pool.query("INSERT INTO categories (name, description) VALUES (?, ?)", [name, description]);
        return { id: result.insertId, name, description };
    },

    update: async (id, name, description) => {
        await pool.query("UPDATE categories SET name = ?, description = ? WHERE id = ?", [name, description, id]);
    },

    delete: async (id) => {
        await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    },
}