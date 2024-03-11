import * as z from "zod"

export const createPostFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
    subject: z.string(),
    tags: z.array(z.string()),
    posts: z.any(),
    // author: z.string(),
    // createdAt: z.date(),
})