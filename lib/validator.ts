import * as z from "zod"

export const createPostFormSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters').max(1500, 'Description must be less than 400 characters'),
    subject: z.string(),
    tags: z.array(z.string()),
    posts: z.any(),
    // author: z.string(),
    // createdAt: z.date(),
})

export const createCollectionSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
    posts: z.any(),
})

export const createCommentSchema = z.object({
    comment: z.string().min(3, 'Description must be at least 3 characters').max(1000, 'Description must be less than 400 characters'),
    author: z.any(),
    parentPost: z.string().optional(),
    children: z.array(z.string()),
    isChild: z.boolean(),
    parentComment: z.string().optional(),
})

export const updateCommentSchema = z.object({
    comment: z.string().min(3, 'Description must be at least 3 characters').max(1000, 'Description must be less than 400 characters'), 
})
