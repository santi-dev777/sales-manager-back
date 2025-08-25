import {pool} from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const ProductModel = {
    getAll: async (user_id) => {
        const [rows] = await pool.query(
            `SELECT p.id, p.name, p.description, p.price, p.stock, c.name AS category_name FROM products p 
                JOIN categories c ON p.category_id = c.id
            WHERE p.user_id = ?`,
            [user_id]
        );
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query(
            'SELECT id, name, description, price, stock, category_id, user_id FROM products WHERE id = ?',
            [id]
        );
        if (rows.length === 0) throw new Error("Product not found");
        return rows[0];
    },
    create: async (name, description, price, stock, category_id, user_id) => {
        const id = uuidv4()

        // validar que la categoría exista
        const [catRows] = await pool.query(
            "SELECT id FROM categories WHERE id = ?",
            [category_id]
        );
        if (catRows.length === 0) {
            throw new Error("Category not found");
        }

        // validar que el usuario exista
        const [userRows] = await pool.query(
            "SELECT id FROM users WHERE id = ?",
            [user_id]
        );
        if (userRows.length === 0) {
            throw new Error("User not found");
        }

        const [result] = await pool.query(
            'INSERT INTO products (id, name, description, price, stock, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, name, description, price, stock, category_id, user_id]
        );
        return await ProductModel.getById(id);
    },
    update: async (id, name, description, price, stock, category_id) => {
        const [result] = await pool.query(
            `UPDATE products SET 
                name = IFNULL(?, name), 
                description = IFNULL(?, description), 
                price = IFNULL(?, price), 
                stock = IFNULL(?, stock), 
                category_id = IFNULL(?, category_id) 
            WHERE id = ?`,
            [name, description, price, stock, category_id, id]
        );
        if (result.affectedRows === 0) throw new Error("Product not found");
        return await ProductModel.getById(id);
    },
    delete: async (id) => {
        const [result] = await pool.query(
            `DELETE FROM products WHERE id = ?`,
            [id]
        );
        if(result.affectedRows === 0) throw new Error("Product not found");
    },
};
