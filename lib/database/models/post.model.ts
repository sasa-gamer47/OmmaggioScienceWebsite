import { Schema, Types, model, models } from "mongoose";

const PostSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    subject: { type: String, required: true},
    tags: [{ type: String, required: true}],
    posts: [
        {
            url: { type: String, required: true},
            index: { type: Number, required: true}
        }
    ],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, required: true, default: Date.now },
    adminApproving: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isApproved: { type: Boolean, required: true, default: false },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', required: true, default: [] }],
    commentsLength: { type: Number, required: true, default: 0 },
    likes: { type: Number, required: true, default: 0 },
    usersHaveLiked: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
    views: { type: Number, required: true, default: 0 },
    usersHaveViewed: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
    favorites: { type: Number, required: true, default: 0 },
    usersHaveFavored: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
})

const Post = models.Post || model('Post', PostSchema);

export default Post;