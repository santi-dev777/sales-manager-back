import { pool } from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const CategoryModel = {
    getAll: async () => {
        const [rows] = await pool.query("SELECT id, name, description FROM categories");
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query(
            "SELECT id, name, description FROM categories WHERE id = ?",
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    },

    create: async (name, description) => {
        const id = uuidv4();
        const [result] = await pool.query(
            `INSERT INTO categories (id, name, description) VALUES (?, ?, ?)`,
            [id, name, description]
        );
        return result.affectedRows === 0 ? null : await CategoryModel.getById(id);
    },

    update: async (id, name, description) => {
        const [result] = await pool.query(
            `UPDATE categories 
            SET name = IFNULL(?, name), 
                description = IFNULL(?, description) 
            WHERE id = ?`,
            [name, description, id]
        );

        return result.affectedRows === 0 ? null : await CategoryModel.getById(id);
    },

    delete: async (id) => {
        const [result] = await pool.query(
            `DELETE FROM categories WHERE id = ?`, 
            [id]
        );
        return result.affectedRows === 0 ? null : true;
    },
};
