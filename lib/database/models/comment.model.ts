import { Schema, Types, model, models } from "mongoose";

const CommentSchema = new Schema({
    comment: { type: String, required: true},
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    parentPost: { type: Schema.Types.ObjectId, ref: 'Post', default: null },
    children: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    isChild: { type: Boolean, required: true, default: false },
    parentComment: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default: 0 },
    usersHaveLiked: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
    usersHaveDisliked: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] }],
    childrenLength: { type: Number, required: true, default: 0 },
})

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;