export type CreateUserParams = {
    clerkId: string
    username: string
    email: string
    photo: string
}

export type UpdateUserParams = {
    username: string
    photo: string
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
