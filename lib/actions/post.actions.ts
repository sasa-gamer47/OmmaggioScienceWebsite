'use server';

import { connectToDatabase } from '@/lib/database';
import Post from '@/lib/database/models/post.model';
import Comment from '@/lib/database/models/comment.model';
import { handleError } from '@/lib/utils';

import { CreatePostParams, GetAllPostsParams, UpdatePostParams } from '@/types';
import User from '../database/models/user.model';
import { revalidatePath } from 'next/cache';

export async function createPost(post: CreatePostParams) {
    try {
        await connectToDatabase();
        const newPost = await Post.create(post);

        await Post.findByIdAndUpdate(post.author, { $push: { posts: newPost._id } });

        return newPost.toObject(); // Convert Mongoose document to plain object
    } catch (error) {
        handleError(error);
        throw error; // Rethrow the error after handling
    }
}


// const populatePost = (query: any) => {
//     return query
//     .populate({ path: 'author', model: User, select: '_id username photo role' })
//         .populate({
//             path: 'comments',
//             model: 'Comment',
//             select: '_id author comment children isChild parentPost parentComment createdAt updatedAt likes dislikes usersHaveLiked usersHaveDisliked',
//             options: { sort: { 'createdAt': -1 } },
//             populate: [
//                 {
//                 path: 'author',
//                 model: 'User',
//                 select: '_id username photo role'
//                 },
//                 {
//                 path: 'children',
//                 model: 'Comment',
//                 select: '_id author comment children isChild parentPost parentComment createdAt updatedAt likes dislikes usersHaveLiked usersHaveDisliked',
//                 populate: {
//                     path: 'author',
//                     model: 'User',
//                     select: '_id username photo role'
//                 }
//                 }
//             ]
//         })

//     // .populate({ path: 'category', model: Category, select: '_id name' })
// }

const populateCommentChildren = async (comments: any) => {
    for (let comment of comments) {
        // Populate the author of the comment
        comment.author = await User.findById(comment.author).select('_id username photo role');

        // If the comment has children, recursively populate them
        if (comment.children && comment.children.length > 0) {
        comment.children = await Comment.find({ '_id': { $in: comment.children } });
        await populateCommentChildren(comment.children); // Recursive call
        }
    }
};

const populatePost = async (query: any) => {
    let post = await query
        .populate({ path: 'author', model: 'User', select: '_id username photo role' })
        .populate({
        path: 'comments',
        model: 'Comment',
        select: '_id author comment children isChild parentPost parentComment createdAt updatedAt likes dislikes usersHaveLiked usersHaveDisliked',
        options: { sort: { 'createdAt': -1 } }
        }).exec();

    // Now manually populate the children of each comment
    if (post.comments && post.comments.length > 0) {
        await populateCommentChildren(post.comments);
    }

    return post;
};



export async function getPosts({ query, limit = 6, page, isApproved}: GetAllPostsParams) {
    try {
    await connectToDatabase()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        // const categoryCondition = category ? await getCategoryByName(category) : null
        const isApprovedCondition = isApproved !== undefined ? { isApproved } : {}
    const conditions = {
        $and: [titleCondition, isApprovedCondition]  //, categoryCondition ? { category: categoryCondition._id } : {}],
    }

    const skipAmount = (Number(page) - 1) * limit
    const postsQuery = Post.find(conditions)
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)

    const posts = await populatePost(postsQuery)
        const postsCount = await Post.countDocuments(conditions)
        
        // console.log('data: ', posts);
        

    return {
        data: JSON.parse(JSON.stringify(posts)),
        totalPages: Math.ceil(postsCount / limit),
    }
} catch (error) {
    handleError(error)
}
}


export async function getPostById(postId: string) {
    try {
        await connectToDatabase()

        // const post = await Post.findById(postId)

        const postQuery = Post.findById(postId)


        
        
        const post = await populatePost(postQuery)

        // console.log(post?.comments);
        

        if (!post) throw new Error('Post not found')
        return JSON.parse(JSON.stringify(post))
    } catch (error) {
        handleError(error)
    }
}

export async function updatePost({ userId, post, path }: UpdatePostParams) {
    try {
        await connectToDatabase()

        // const postToUpdate = await Post.findById(post._id)
        // if (!postToUpdate || postToUpdate.organizer.toHexString() !== userId) {
        // throw new Error('Unauthorized or post not found')
        // }

        const updatedPost = await Post.findByIdAndUpdate(
        post._id,
        { ...post },
        { new: true }
        )
        revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedPost))
    } catch (error) {
        handleError(error)
    }
}