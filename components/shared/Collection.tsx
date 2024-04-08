"use client";

import React, { useState, useEffect } from 'react'
import { updateCollection } from '@/lib/actions/collection.actions';

const Collection = ({ user, collection, postId }: any) => {

    const [isSaved, setIsSaved] = useState(false)

    console.log('collection: ', collection)


    useEffect(() => {
        if (collection.posts.indexOf(postId) !== -1) {
            setIsSaved(true)
        } else {
            setIsSaved(false)
        }

        console.log(collection)
    }, [collection])

    const handleUpdateCollection = async () => {


        if (collection.posts.indexOf(postId) === -1) {
            collection.posts.push(postId)

            // console.log(collection.posts)
            
            setIsSaved(true)
        } else {
            
            setIsSaved(false)
            // collection.posts.splice(collection.posts.indexOf(postId), 1)
            collection.posts.splice(collection.posts.indexOf(postId), 1)
        }
        
        console.log(collection.posts)
        collection.updatedAt = new Date()

        try {

            // console.log(postId)
            // console.log(collection.posts.find((post: string) => console.log(post)))

            // console.log('collection: ', collection)
            const updatedCollection = await updateCollection({
                collection: collection,
            })

            console.log('updatedCollection: ', updatedCollection)

        } catch (err: any) {
            throw new Error(`Something went wrong while updating post: ${err.message}`);
        }

        
    }

    return (
        <div className='w-full flex items-center justify-between border border-base-content p-2 tet-base-content'>
            <div className='w-1/3 h-full flex items-center justify-around'>
                <p className='text-lg font-semibold'>
                    {collection.title}
                </p>
                <p className='text-sm'>
                    {collection.posts.length} posts
                </p>

            </div>
            
                <button className='btn btn-active btn-sm' onClick={() => handleUpdateCollection()}>
                    { isSaved ? 'Remove from collection' : 'Add to collection' }
                </button>
        </div>
    )
}

export default Collection