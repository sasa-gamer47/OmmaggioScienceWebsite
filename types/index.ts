export type CreateUserParams = {
    clerkId: string
    username: string
    email: string
    photo: string
}

export type UpdateUserParams = {
    username: string
    photo: string
    favorites: any
    collections: any
}

export type CreatePostParams = {
    title: string
    description: string
    subject: string
    posts: any
    author: any
    createdAt: Date
    adminApproving: any
    isApproved: boolean
}

export type GetAllPostsParams = {
    query: string
    limit: number
    page: number
    isApproved: boolean
}

export type UpdatePostParams = {
    userId: string
    post: any
    path: string
}

export type CreateCommentParams = {
    comment: string
    author?: any
    parentPost?: any
    parentComment?: any
    children: any
}

export type GetAllCommentsParams = {
    query: string
    limit: number
    page: number
    postId: string
}

export type UpdateCommentParams = {
    // userId: string
    comment: any
    path: string
}