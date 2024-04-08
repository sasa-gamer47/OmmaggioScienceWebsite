import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    photo: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post', required: true, default: [] }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Post', required: true, default: [] }],
    collections: [{ type: Schema.Types.ObjectId, ref: 'Collection', required: true, default: [] }]
})

const User = models.User || model('User', UserSchema);

export default User;