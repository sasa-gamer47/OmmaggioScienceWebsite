"use client";

import { updatePost } from '@/lib/actions/post.actions';
import { getAllAdminUsers, getUserByClerkId, updateUser } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createCollectionSchema } from '@/lib/validator';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import { getSubjectIcon } from '@/lib/static';

interface Params {
    user: any
    post: any
    toApprove: boolean
    adminUsers: any
}

const Post = ({ user, post, toApprove, adminUsers }: Params) => {


    const [isFavorite, setIsFavorite] = useState(false)
    const [addedToCollection, setAddedToCollection] = useState(false)

    


    const pathname = usePathname()

    const approvePost = async () => {

        console.log(user);
        
        // post.isApproved = true
        // if (!user || user!._id) return;
        // console.log(user);

        const index = post.adminApproving.indexOf(user!._id)

        // console.log(index);
        

        if (index === -1) {
            post.adminApproving.push(user!._id)
        } else {
            // post.adminApproving.splice(index, 1)
        }

        console.log(post.adminApproving);
        

        if (post.adminApproving.length >= (adminUsers.length / 2)) {
            post.isApproved = true
        } else {
            post.isApproved = false
        }

        try {

            const updatedPost = await updatePost({
                userId: user?.id || '',
                post: post,
                path: pathname,
            })

            console.log(post);
            console.log('update: ', updatedPost);
        } catch (err: any) {
            throw new Error(`Something went wrong while updating post: ${err.message}`);
        }
        
    }

    useEffect(() => {

        if (user) {
            const index = user?.favorites.indexOf(post._id);
    
            if (index !== -1) {
                setIsFavorite(true);
            } else {
                setIsFavorite(false);
            }

        }
    }, [user])

    const handleFavorites = async () => {
    // console.log("adding o favorites");

    const index = user?.favorites.indexOf(post._id);

    if (index !== -1) {
        user.favorites.splice(index, 1);
        // console.log("removing from favorites");
        setIsFavorite(false);
    } else {
        user.favorites.push(post._id);
        // console.log("adding to favorites");
        setIsFavorite(true);
    }

        console.log(user);
        
        if (user?.clerkId) {
            const updatedUser = await updateUser({
                clerkId: user.clerkId,
                user: user,
            });
        
            console.log(updatedUser);

        }

};


    const form = useForm<z.infer<typeof createCollectionSchema>>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
            posts: [post._id],
        },
    })


    const handleCollectionSubmit = async (values: z.infer<typeof createCollectionSchema>) => {
        console.log('collection data: ', values);

        user.collections.push(values)

        if (user?.clerkId) {
            const updatedUser = await updateUser({
                clerkId: user.clerkId,
                user: user,
            });
        
            console.log(updatedUser);

        }
        
    }

    const updateCollection = async (collection: any) => {
        // console.log(collection);

        const index = collection?.posts.indexOf(post._id);

        // console.log(index, user.collections);
        

        // if (index !== -1) {
        //     user.collections.splice(index, 1);
        // } else {
        //     user.collections.push(collection)
        // }

        if (index !== -1) {
            collection?.posts.splice(index, 1);
            setAddedToCollection(false)
        } else {
            collection?.posts.push(post._id)
            setAddedToCollection(true)
        }

        console.log(user);

        if (user?.clerkId) {
            const updatedUser = await updateUser({
                clerkId: user.clerkId,
                user: user,
            });

            console.log(updatedUser);
        }
    }

    return (
        <>
            {
                toApprove && post.author._id !== user!._id && (
                            <div className='relative w-full h-full bg-base-200 rounded-lg flex flex-col items-center p-2 shadow-lg'>
                                <div className=' rounded-lg w-full h-2/3 flex flex-col items-center justify-center relative'>
                                    <button className='btn btn-active absolute top-2 right-2 bg-base-300 rounded-lg p-1 py-0 flex items-center justify-center z-10'>
                                        <span
                                            className="material-symbols-rounded text-lg"
                                            style={{ fontVariationSettings: `'FILL' ${isFavorite ? '1' : '0'}, 'wght' 300` }}
                                        >
                                            bookmark
                                        </span>
                                    </button>
                                    <Image draggable='false' src={post.posts[0]?.url} alt={post.title} objectFit='cover' fill />
                                    <Link href={`/user/${post.author._id}`} className='absolute w-10/12 left-2 -bottom-4 py-1 px-0 gap-x-3 bg-base-300 rounded-lg flex items-center justify-center'>
                                        <div className='relative rounded-full overflow-hidden'>
                                            <Image draggable='false' src={post.author.photo} alt='user' objectFit='cover' width={35} height={35} />
                                        </div>
                                        <p className='text-base-content text-sm font-semibold'>
                                            {post.author.username}
                                        </p>
                                    </Link>
                                    
                                </div>
                                <div className='w-full flex items-center justify-between mt-6 ml-4'>
                                    <h1 className='text-base-content text-left font-semibold'>{post.title}</h1>
                                </div>
                                <div className='relative w-full flex items-center justify-around gap-x-3 mt-2'>
                                    <p className='btn btn-outline btn-sm'>{getSubjectIcon(post.subject)} {post.subject}</p>
                                    <Link href={`/post/${post._id}`} >
                                        <button className='btn btn-active btn-sm'>
                                            Study
                                        </button>
                                    </Link>

                                </div>
                                <div className='relative w-full flex items-center justify-around gap-x-3 mt-2'>

                                    <div className='relative w-full grid grid-cols-3 gap-2'>
                                        {post.tags.map((tag: any, index: number) => (
                                            <button key={index} className='btn btn-active btn-neutral btn-sm'>
                                                #{tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                        
                        {toApprove && (
                            <>
                                <div className='absolute w-full h-full opacity-15 bg-base-100 z-10'>

                                </div>
                                <button className='z-10 btn btn-success absolute top-2 left-2' onClick={() => approvePost()}>
                                    Approve
                                </button>
                            </>
                        )}
                    </div>
                )} 
            {!toApprove && (
                        <div className='relative w-full h-full bg-base-200 rounded-lg flex flex-col items-center p-2 shadow-lg'>
                            <div className=' rounded-lg w-full h-2/3 flex flex-col items-center justify-center relative'>




                        {/* {isFavorite ? (
                                <button className='btn btn-active absolute top-2 right-2 bg-base-300 rounded-lg p-1 py-0 flex items-center justify-center z-10' onClick={() => handleFavorites()} >
                                    <span
                                        className="material-symbols-rounded text-lg"
                                        style={{ fontVariationSettings: `'FILL' ${isFavorite ? '1' : '0'}, 'wght' 300` }}
                                    >
                                        bookmark
                                    </span>
                                </button>

                        ): ( */}
                            
                            <Dialog>
                                <DialogTrigger>
                                <button className='btn btn-active absolute top-2 right-2 bg-base-300 rounded-lg p-1 py-0 flex items-center justify-center z-10' onClick={() => handleFavorites()} >
                                    <span
                                        className="material-symbols-rounded text-lg"
                                        style={{ fontVariationSettings: `'FILL' ${isFavorite ? '1' : '0'}, 'wght' 300` }}
                                    >
                                        bookmark
                                    </span>
                                </button>
                                </DialogTrigger>
                            <DialogContent className=' bg-base-200 border-none text-base-content'>
                                    <DialogHeader>
                                        
                                        {isFavorite && (
                                            <DialogTitle>Collections</DialogTitle>
                                        
                                            )}
                                    {!isFavorite && (
                                        <>
                                            <DialogTitle>Post removed from favorites</DialogTitle>
                                            <DialogDescription>
                                                You can now close this dialog.
                                            </DialogDescription>
                                        </>
                                        )}
                                    </DialogHeader>

                                {isFavorite && (

                                    <div className='flex flex-col items-center justify-between gap-y-2'>
                                        {user && user?.collections && user.collections.length === 0 && (
                                            <p className='text-base-content text-sm font-semibold'>
                                                No collections
                                            </p>
                                        )}
                                        {user && user?.collections && user.collections.length > 0 && (
                                            <div className='flex flex-col items-center w-full'>
                                                {user.collections.map((collection: any, index: number) => (
                                                    <div key={index} className='w-full flex items-center justify-between border border-base-content p-2 tet-base-content'>
                                                        <div className='w-1/3 h-full flex items-center justify-around'>
                                                            <p className='text-lg font-semibold'>
                                                                {collection.title}
                                                            </p>
                                                            <p className='text-sm'>
                                                                {collection.posts.length} posts
                                                            </p>

                                                        </div>
                                                        
                                                            <button className='btn btn-active btn-sm' onClick={() => updateCollection(collection)}>
                                                                {collection.posts.indexOf(post._id) === -1 ? 'Add' : 'Remove'}
                                                            </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <Dialog>
                                            <DialogTrigger>
                                                <button className='btn btn-active mt-2'>Create new collection</button>
                                                
                                            </DialogTrigger>
                                            <DialogContent className='w-full bg-base-200 border-none text-base-content'>
                                                <DialogHeader>
                                                <DialogTitle className='text-2xl font-bold'>Create collection</DialogTitle>
                                                {/* <DialogDescription>
                                                    This action cannot be undone. This will permanently delete your account
                                                    and remove your data from our servers.
                                                </DialogDescription> */}
                                                </DialogHeader>
                                                <div className='w-full flex flex-col items-center justify-between gap-y-2'>
                                                    <Form {...form}>
                                                        <form className='w-full flex items-center justify-between flex-col gap-y-2' onSubmit={form.handleSubmit(handleCollectionSubmit)}>
                                                            <div className="w-11/12">

                                                                <FormField
                                                                control={form.control}
                                                                name="title"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                    <FormLabel className='text-xl font-bold'>Title</FormLabel>
                                                                    <FormControl>
                                                                        <Input className='bg-base-200 text-base-content outline-none' placeholder="Insert title" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                                />
                                                            </div>
                                                            <div className="w-11/12">
                                                                <FormField
                                                                control={form.control}
                                                                name="description"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                    <FormLabel className='text-xl font-bold'>Description</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea className='bg-base-200 text-base-content outline-none' placeholder="Insert description" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                                />

                                                            </div>
                                                            <button type='submit' className='btn btn-active mt-5'>Create</button>
                                                        </form>
                                                    </Form>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        
                                    </div>
                                )}
                                </DialogContent>
                                </Dialog>
                        {/* )} */}




                        
                                
                        










                        
                                <Image draggable='false' src={post.posts[0]?.url} alt={post.title} objectFit='cover' fill />
                                <Link href={`/user/${post.author._id}`} className='absolute w-10/12 left-2 -bottom-4 py-1 px-0 gap-x-3 bg-base-300 rounded-lg flex items-center justify-center'>
                                    <div className='relative rounded-full overflow-hidden'>
                                        <Image draggable='false' src={post.author.photo} alt='user' objectFit='cover' width={35} height={35} />
                                    </div>
                                    <p className='text-base-content text-sm font-semibold'>
                                        {post.author.username}
                                    </p>
                                </Link>
                                
                            </div>
                            <div className='w-full flex items-center justify-between mt-6 ml-4'>
                                <h1 className='text-base-content text-left font-semibold'>{post.title}</h1>
                            </div>
                            <div className='relative w-full flex items-center justify-around gap-x-3 mt-2'>
                                <p className='btn btn-outline btn-sm'>{getSubjectIcon(post.subject)}  {post.subject}</p>
                                <Link href={`/post/${post._id}`} >
                                    <button className='btn btn-active btn-sm'>
                                        Study
                                    </button>
                                </Link>

                            </div>
                            <div className='relative w-full flex items-center justify-around gap-x-3 mt-2'>

                                <div className='relative w-full grid grid-cols-3 gap-2'>
                                    {post.tags.map((tag: any, index: number) => (
                                        <button key={index} className='btn btn-active btn-neutral btn-sm'>
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                </div>
            )}
        </>
            
        
    )
}

export default Post