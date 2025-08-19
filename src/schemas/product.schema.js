import { z } from "zod";

const ProductSchema = z.object({
    name: 
        z.string()
            .min(3, "Name must be at least 3 characters long")
            .max(50, "Name must be at most 50 characters long"),
    description: 
        z.string()
            .min(3, "Description must be at least 3 characters long")
            .max(255, "Description must be at most 255 characters long"),
    price: 
        z.number()
            .min(0, "Price must be at least 0")
            .max(1000000, "Price must be at most 1000000"),
    stock: 
        z.number()
            .min(0, "Stock must be at least 0")
            .max(1000000, "Stock must be at most 1000000"),
    category_id:
        z.string()
            .min(1, "Category ID must be at least 1")
});

export const validateProduct = (data) => {
    return ProductSchema.safeParse(data);
}

export const validateProductUpdate = (data) => {
    return ProductSchema.partial().safeParse(data);
}
