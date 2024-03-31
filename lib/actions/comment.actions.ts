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

    console.log('COMMENT: ', comment)


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

export async function updateComment({ comment }: UpdateCommentParams) {
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
        // revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedComment))
    } catch (error) {
        handleError(error)
    }
}


const populateCommentChildren = async (commentQuery: any, limit = 3, skip = 0) => {
    try {
        const comment = await commentQuery.exec(); // Make sure to execute the query
        // console.log('comment1: ', comment);
        
        // Populate the author of the comment
        comment.author = await User.findById(comment.author).select('_id username photo role');
        // console.log('commentAuthor: ', comment.author);

        // If the comment has children, recursively populate them with a limit
        if (comment.children && comment.children.length > 0) {
            comment.children = await Comment.find({ '_id': { $in: comment.children } })
                                            .sort({ 'createdAt': -1 })
                                            .skip(skip)
                                            .limit(limit)
                                            .populate({
                                                path: 'author',
                                                model: 'User',
                                                select: '_id username photo role'
                                            });
        }
        return comment;
    } catch (error) {
        console.error('Error populating comment children:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
};



export async function getCommentById(commentId: string, childrenLimit: number) {
    try {
        await connectToDatabase()

        // const comment = await Comment.findById(commentId)

        const commentQuery = Comment.findById(commentId)


        // console.log('commentQuery: ', commentQuery);
        
        const comment = await populateCommentChildren(commentQuery, childrenLimit)

        // console.log('commentt: ', comment);

        // console.log(comment?.comments);
        

        // if (!comment) throw new Error('Comment not found')
        return JSON.parse(JSON.stringify(comment))
    } catch (error) {
        handleError(error)
    }
}

export async function getChildrenByParentId(parentId: string, childrenLimit: number) {
    try {
        await connectToDatabase()

        const comments = await Comment.find({ parentComment: parentId })
            .sort({ 'createdAt': -1 })
            .limit(childrenLimit)
            .populate({
                path: 'author',
                model: 'User',
                select: '_id username photo role'
            })
            .populate({
                path: 'children',
                model: 'Comment',
                select: '_id author comment children isChild parentPost parentComment createdAt updatedAt likes dislikes usersHaveLiked usersHaveDisliked',
                options: { sort: { 'createdAt': -1 } },
                populate: {
                    path: 'author',
                    model: 'User',
                    select: '_id username photo role'
                }
            })
        
            // console.log('comments', comments);
            
            
        return JSON.parse(JSON.stringify(comments))
    } catch (error: any) {
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

export async function deleteCommentById(comment: any) {
try {
    await connectToDatabase()

    // Find comment to delete
    // const commentToDelete = await Comment.findOne({ clerkId })

    // if (!commentToDelete) {
    // throw new Error('Comment not found')
    // }


    // Delete comment
    // console.log('parentPostId', comment?.parentPost, comment);
    
    if (comment.parentPost) {
        

        const parentPost = await Post.findById(comment.parentPost)

        console.log('parentPost', parentPost);
        

        // const childrenComments = await Comment.find({ parentPost: comment.parentPost })

        // childrenComments.forEach(async (childComment: any) => {
        //     await deleteCommentById(childComment._id)
        // })

        const childrenComments = await Comment.find({ parentComment: comment._id })

        childrenComments.forEach(async (childComment: any) => {
            console.log(childComment, 'child');
            

            await Comment.findByIdAndDelete(childComment._id)
        })

        parentPost.commentsLength -= 1

        parentPost.comments = parentPost.comments.filter((commentId: any) => commentId!== comment._id)

        await parentPost.save()
    } else {
        const parentComment = await Comment.findById(comment.parentComment)

        // parentComment.children.forEach(async (childCommentId: any) => {
            //     const childComment = await Comment.)


        //     await deleteCommentById(childComment._id)
        // })

        const childrenComments = await Comment.find({ parentComment: comment._id })

        childrenComments.forEach(async (childComment: any) => {
            console.log(childComment, 'child');
            

            await Comment.findByIdAndDelete(childComment._id)
        })

        parentComment.childrenLength -= 1

        parentComment.children = parentComment.children.filter((commentId: any) => commentId !== comment._id)


        
        await parentComment.save()
    }
    
    const deletedComment = await Comment.findByIdAndDelete(comment._id)
    
    // revalidatePath('/')

    return deletedComment ? JSON.parse(JSON.stringify(deletedComment)) : null
} catch (error) {
    handleError(error)
}
}