import { Schema, Types, model, models } from "mongoose";

console.log('mongodb: ', Schema, models)

const CollectionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post', required: true, default: [] }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, default: [] },
})

const Collection = models.Collection || model('Collection', CollectionSchema);

console.log('Collection', Collection);

export default Collection;