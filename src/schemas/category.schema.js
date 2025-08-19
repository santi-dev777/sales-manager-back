import { z } from "zod"

const categorySchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
    description: z.string()
        .min(3, "Description must be at least 3 characters long")
        .max(255, "Description must be at most 255 characters long"),
})

export const validateCategory = (data) => {
    return categorySchema.safeParse(data);
}

export const validateCategoryUpdate = (data) => {
    return categorySchema.pick({ name: true, description: true }).safeParse(data);
}