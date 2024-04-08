'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import Collection from '@/lib/database/models/collection.model'
import { handleError } from '@/lib/utils'

import { CreateCollectionParams, UpdateCollectionParams } from '@/types'
import User from '../database/models/user.model'

export async function createCollection(collection: CreateCollectionParams) {
try {
    await connectToDatabase()

    const newCollection = await Collection.create(collection)

    const user = await User.findByIdAndUpdate(newCollection.author, { $push: { collections: newCollection._id } });

    // console.log(user)
    // console.log(user.collections)

    return JSON.parse(JSON.stringify(newCollection))
} catch (error) {
    handleError(error)
}
}

export async function getCollectionById(collectionId: string) {
try {
    await connectToDatabase()

    const collection = await Collection.findById(collectionId)

    if (!collection) throw new Error('Collection not found')
    return JSON.parse(JSON.stringify(collection))
} catch (error) {
    handleError(error)
}
}


export async function updateCollection({ collection }: UpdateCollectionParams) {
    try {
        await connectToDatabase()

        // const collectionToUpdate = await Collection.findById(collection._id)
        // if (!collectionToUpdate || collectionToUpdate.organizer.toHexString() !== userId) {
        // throw new Error('Unauthorized or collection not found')
        // }

        const updatedCollection = await Collection.findByIdAndUpdate(
            collection._id,
            { ...collection },
            { new: true }
        )
        // revalidatePath(path)

        return JSON.parse(JSON.stringify(updatedCollection))
    } catch (error) {
        handleError(error)
    }
}

export async function deleteCollection(collectionId: string) {
try {
    await connectToDatabase()



    // Delete collection
    const deletedCollection = await Collection.findByIdAndDelete(collectionId)
    revalidatePath('/')

    return deletedCollection ? JSON.parse(JSON.stringify(deletedCollection)) : null
} catch (error) {
    handleError(error)
}
}