'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Post from '@/lib/database/models/post.model'
import { handleError } from '@/lib/utils'

import { CreatePostParams } from '@/types'

export async function createPost(post: CreatePostParams) {
try {
    await connectToDatabase()

    console.log('post: ', post);
    

    const newPost = await Post.create(post)
    console.log(newPost);
    
    return JSON.parse(JSON.stringify(newPost))
} catch (error) {
    handleError(error)
}
}

// export async function getPostById(postId: string) {
// try {
//     await connectToDatabase()

//     const post = await Post.findById(postId)

//     if (!post) throw new Error('Post not found')
//     return JSON.parse(JSON.stringify(post))
// } catch (error) {
//     handleError(error)
// }
// }
