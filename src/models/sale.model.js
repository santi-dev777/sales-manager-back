import {pool} from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

export const SaleModel = {
    getAll: async (user_id) => {
        const [rows] = await pool.query(
            `SELECT 
                s.id AS sale_id, 
                s.total,
                s.status, 
                sd.id AS sale_detail_id, 
                sd.quantity, 
                sd.unit_price, 
                p.id AS product_id, 
                p.name AS product_name, 
                p.description, 
                c.name AS category_name
            FROM sales s
            LEFT JOIN sales_details sd ON s.id = sd.sale_id
            LEFT JOIN products p ON sd.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE s.user_id = ?
            ORDER BY s.id DESC`,
            [user_id]
        );

        const sales = rows.reduce((acc, row) => {
            let sale = acc.find(s => s.id === row.sale_id);
    
            if (!sale) {
                sale = {
                    id: row.sale_id,
                    total: row.total,
                    status: row.status,
                    details: []
                };
                acc.push(sale);
            }
    
            if (row.sale_detail_id) {
                sale.details.push({
                    id: row.sale_detail_id,
                    quantity: row.quantity,
                    unit_price: row.unit_price,
                    product: {
                        id: row.product_id,
                        name: row.product_name,
                        description: row.description,
                        category: row.category_name
                    }
                });
            }
    
            return acc;
        }, []);
    
        return sales;
    } ,
    getById: async (id) => {
        const [rows] = await pool.query(
            `SELECT 
                s.id AS sale_id,
                s.total,
                s.status,
                sd.id AS sale_detail_id,
                sd.quantity,
                sd.unit_price,
                p.id AS product_id,
                p.name AS product_name,
                p.description AS product_description,
                c.name AS category_name
            FROM sales s
            LEFT JOIN sales_details sd ON s.id = sd.sale_id 
            LEFT JOIN products p ON sd.product_id = p.id
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE s.id = ?`,
            [id]
        );
    
        if (rows.length === 0) return null;
    
        const sale = {
            id: rows[0].sale_id,
            total: rows[0].total,
            status: rows[0].status,
            details: rows.map(r => ({
                sale_detail_id: r.sale_detail_id,
                product_id: r.product_id,
                product_name: r.product_name,
                product_description: r.product_description,
                category_name: r.category_name,
                quantity: r.quantity,
                unit_price: r.unit_price
            }))
        };
    
        return sale;
    },
    create: async (user_id) => {
        const id = uuidv4()
        const [result] = await pool.query(`INSERT INTO sales (id, total,user_id) VALUES (?, ?, ?)`, [id, 0, user_id]);
        return await SaleModel.getById(id);
    },
    update: async (id, total) => {
        const [result] = await pool.query(`UPDATE sales SET total = ? WHERE id = ?`, [total, id]);
        return result.affectedRows === 0 ? null : await SaleModel.getById(id);
    },
    delete: async (id) => {
        const [result] = await pool.query(`DELETE FROM sales WHERE id = ?`, [id]);
        return result.affectedRows === 0 ? null : true;
    },
}