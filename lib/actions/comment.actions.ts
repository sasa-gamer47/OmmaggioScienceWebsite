'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Comment from '@/lib/database/models/comment.model'
import { handleError } from '@/lib/utils'

import { CreateCommentParams, UpdateCommentParams } from '@/types'
import Post from '../database/models/post.model'
import User from '../database/models/user.model'

export async function createComment(comment: CreateCommentParams) {
try {
    await connectToDatabase()

    const newComment = await Comment.create(comment)

    const toLog = await Post.findByIdAndUpdate(newComment.parentPost, { $push: { comments: newComment._id } });

    // console.log(toLog);


    return JSON.parse(JSON.stringify(newComment))
} catch (error) {
    handleError(error)
}
}


const populateComment = (query: any) => {
    return query
    // .populate({ path: 'author', model: User, select: '_id username photo role' })
    // .populate({ path: 'children', model: Comment, select: '_id author comment children isChild parentPost parentComment createdAt updatedAt likes dislikes usersHaveLiked usersHaveDisliked', options: { sort: { 'createdAt': -1 } }, populate: { path: 'author', model: User, select: '_id username photo role' } })
    // .populate({ path: 'category', model: Category, select: '_id name' })
}

export async function updateComment({ comment, path }: UpdateCommentParams) {
    try {
        await connectToDatabase()

        // const commentToUpdate = await Comment.findById(comment._id)
        // if (!commentToUpdate || commentToUpdate.organizer.toHexString() !== userId) {
        // throw new Error('Unauthorized or comment not found')
        // }

        const updatedComment = await Comment.findByIdAndUpdate(
        comment._id,
        { ...comment },
        { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedComment))
    } catch (error) {
        handleError(error)
    }
}

export async function getCommentById(commentId: string) {
    try {
        await connectToDatabase()

        // const comment = await Comment.findById(commentId)

        const commentQuery = Comment.findById(commentId)


        
        
        const comment = await populateComment(commentQuery)

        // console.log(comment?.comments);
        

        if (!comment) throw new Error('Comment not found')
        return JSON.parse(JSON.stringify(comment))
    } catch (error) {
        handleError(error)
    }
}


// export async function updateComment({ clerkId, comment }: any) { // : UpdateCommentParams
// try {
//     await connectToDatabase()

//     const updatedComment = await Comment.findOneAndUpdate({ clerkId }, comment, { new: true })

//     if (!updatedComment) throw new Error('Comment update failed')
//     return JSON.parse(JSON.stringify(updatedComment))
// } catch (error) {
//     handleError(error)
// }
// }

export async function deleteComment(clerkId: string) {
try {
    await connectToDatabase()

    // Find comment to delete
    const commentToDelete = await Comment.findOne({ clerkId })

    if (!commentToDelete) {
    throw new Error('Comment not found')
    }


    // Delete comment
    const deletedComment = await Comment.findByIdAndDelete(commentToDelete._id)
    revalidatePath('/')

    return deletedComment ? JSON.parse(JSON.stringify(deletedComment)) : null
} catch (error) {
    handleError(error)
}
}