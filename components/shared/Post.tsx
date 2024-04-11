"use client";

import { updatePost } from '@/lib/actions/post.actions';
import { getAllAdminUsers, getUserByClerkId, getUserById, updateUser } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from '../ui/toast';
import { createCollection } from '@/lib/actions/collection.actions';
import Collection from './Collection';



interface Params {
    user: any
    post: any
    toApprove: boolean
    adminUsers: any
}

const Post = ({ user, post, toApprove, adminUsers }: Params) => {

    let userId: any = useUser()

    userId = userId?.user?.id




    const [fetchedUser, setFetchedUser] = useState<any>(null)

    const [isFavorite, setIsFavorite] = useState(false)
    const [addedToCollection, setAddedToCollection] = useState(false)


    const [duration, setDuration] = useState(5000)

    const { toast } = useToast()

    const pathname = usePathname()
    const router = useRouter()

    const approvePost = async () => {

        if (!userId) return;

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

        // console.log(post.adminApproving);
        

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


    const fetchUser = async () => {
        // if (!user?.id) return;
        
        try {

            if (!userId) return;

            const fetchedUser = await getUserByClerkId(userId)

            // const fetchedUser = await getUserById(await getUserByClerkId(userId)._id)

            console.log(fetchedUser[0])
            setFetchedUser(fetchedUser[0])
        } catch (err: any) {
            throw new Error(`Something went wrong while fetching user: ${err.message}`);
        }
        
    }

    useEffect(() => {
        console.log(userId, 'userId')
        console.log(fetchedUser, 'fetchedUser')

        if (!user) {
            fetchUser();
            
            console.log('no user')
        } else {
            console.log('this user: ', user);
            
        }
        
        // console.log('fetching user...', fetchedUser)

        // console.log(fetchedUser)
    }, [user, router])


    useEffect(() => {

        // console.log('user: ', user);

        if (user || fetchedUser) {
            const index = user ? user?.favorites.indexOf(post._id) : fetchedUser?.favorites.indexOf(post._id);
    
            if (index !== -1) {
                setIsFavorite(true);
            } else {
                setIsFavorite(false);
            }

            // console.log('loading posts');
            
        }
    }, [user, router, fetchedUser])

    const handleFavorites = async () => {
    // console.log("adding o favorites");

    const index = user ? user?.favorites.indexOf(post._id) : fetchedUser?.favorites.indexOf(post._id);

    if (index !== -1) {
        user ? user.favorites.splice(index, 1) : fetchedUser.favorites.splice(index, 1);
        // console.log("removing from favorites");
        setIsFavorite(false);

        toast({
            title: "Post removed from favorites.",
            // duration: 300,
            // description: "There was a problem with your request.",
        })
        
    } else {
        user ? user.favorites.push(post._id) : fetchedUser.favorites.push(post._id);
        // console.log("adding to favorites");
        setIsFavorite(true);

        // console.log(user.collections[0].posts.find((postId: string) => postId === post._id))
        
        toast({
            title: "Post added to favorites.",
            // description: "There was a problem with your request.",
            // action: <ToastAction altText="Save in collection">Save in Collection</ToastAction>,
            duration: duration,
            action: (
                <Dialog onOpenChange={(e) => { if (e === false) setDuration(3000) }}>
                    <DialogTrigger>
                        <button onClick={() => setDuration(Number.MAX_SAFE_INTEGER / 500)} className="btn btn-active">Save to a collection</button>
                        </DialogTrigger>
                    <DialogContent className=' bg-base-200 border-none text-base-content'>
                            <DialogHeader>
                                
                            
                                    <DialogTitle>Collections</DialogTitle>
                                
                                
        
                            </DialogHeader>

                        

                            <div className='flex flex-col items-center justify-between gap-y-2'>
                                {(user ? (user?.collections && user.collections.length) : (fetchedUser.collections && fetchedUser.collections.length)) === 0 && (
                                    <p className='text-base-content text-sm font-semibold'>
                                        No collections
                                    </p>
                                )}
                                {(user ? (user?.collections && user.collections.length) : (fetchedUser.collections && fetchedUser.collections.length)) > 0 && (
                                    <div className='flex flex-col items-center w-full'>
                                        {user ? (user?.collections && user.collections.map((collection: any, index: number) => (
                                            <Collection key={index} collection={collection} user={user} postId={post._id} />
                                        ))) : (fetchedUser.collections && fetchedUser.collections.map((collection: any, index: number) => (
                                            <Collection key={index} collection={collection} user={fetchedUser} postId={post._id} />
                                        )))}
                                        {/* {user && user.collections.map((collection: any, index: number) => (
                                            <Collection key={index} collection={collection} user={user} postId={post._id} />
                                        ))} */}
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
                        
                        </DialogContent>
                </Dialog>
            )
        })
    }
    

        console.log(user);
        
        if (user?.clerkId || fetchedUser?.clerkId) {
            const updatedUser = await updateUser({
                clerkId: user?.clerkId || fetchedUser.clerkId,
                user: user || fetchedUser,
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

        // user.collections.push(values)

        if (user?.clerkId || userId) {
            const updatedUser = await updateUser({
                clerkId: user?.clerkId || userId,
                user: user || fetchedUser,
            });
        
            console.log(updatedUser);

        }

        try {
            const collection = await createCollection({
                title: values.title,
                description: values.description,
                posts: values.posts,
                author: user?._id || fetchedUser._id,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            console.log('createdCollection: ', collection);

        } catch (error: any) {
            throw new Error(error.message);
        }
        
    }

    // useEffect(() => {
    //     console.log(fetchedUser)
    // }, [user, fetchedUser])

    return (
        <>
            {
                toApprove && (post.author._id !== user!._id || post.author._id !== fetchedUser?._id) && (
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
                                <p className='btn btn-outline btn-sm'>
                                    <Link href={`/search?query=*${post.subject}`}>
                                        {getSubjectIcon(post.subject)} {post.subject}
                                    </Link>
                                </p>
                                
                                    <Link href={`/post/${post._id}`} >
                                        <button className='btn btn-active btn-sm'>
                                            Study
                                        </button>
                                    </Link>

                                </div>
                                <div className='relative w-full flex items-center justify-around gap-x-3 mt-2'>

                                    <div className='relative w-full grid grid-cols-3 gap-2'>
                                        {post.tags.map((tag: any, index: number) => (
                                            <button onClick={() => router.push(`/search?query=''&tag=${tag}`)} key={index} className='btn btn-active btn-neutral btn-sm'>
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
                        <div className='relative w-full h-full bg-base-200 rounded-lg flex flex-col items-center p-2 shadow-lg min-w-40 max-w-80'>
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
                            <button className='btn btn-active absolute top-2 right-2 bg-base-300 rounded-lg p-1 py-0 flex items-center justify-center z-10' onClick={() => handleFavorites()} >
                                <span
                                    className="material-symbols-rounded text-lg"
                                    style={{ fontVariationSettings: `'FILL' ${isFavorite ? '1' : '0'}, 'wght' 300` }}
                                >
                                    bookmark
                                </span>
                            </button>
                            
                            
                        {/* )} */}




                        
                                
                        










                                {post && post?.posts && post.posts.length > 0 && (
                                    <Image draggable='false' src={post?.posts[0]?.url} alt={post.title} objectFit='cover' fill />
                                )}
                                <Link href={`/user/${post.author?._id}`} className='absolute w-10/12 left-2 -bottom-4 py-1 px-0 gap-x-3 bg-base-300 rounded-lg flex items-center justify-center'>
                                    <div className='relative rounded-full overflow-hidden'>
                                        <Image draggable='false' src={post.author?.photo} alt='user' objectFit='cover' width={35} height={35} />
                                    </div>
                                    <p className='text-base-content text-sm font-semibold'>
                                        {post.author?.username}
                                    </p>
                                </Link>
                                
                            </div>
                            <div className='w-full flex items-center justify-between mt-6 ml-4'>
                                <h1 className='text-base-content text-left font-semibold'>{post.title}</h1>
                            </div>
                    <div className='relative w-full flex items-center justify-between gap-x-3 mt-2'>
                        <Link href={`/search?query=*${post.subject}`}>
                            <p className='btn btn-outline btn-sm'>{getSubjectIcon(post.subject)}  {post.subject}</p>
                        </Link>
                        <Link href={`/post/${post._id}`} >
                            <button className='btn btn-active btn-sm'>
                                Study
                            </button>
                        </Link>

                            </div>
                            <div className='relative w-full flex items-center justify-around gap-x-3 mt-2'>

                                <div className='relative w-full grid grid-cols-3 gap-2'>
                                {post.tags && post.tags.length > 0 && post.tags.map((tag: any, index: number) => (
                                        <Link href={`/search?query=''&tag=${tag}`}>
                                            <button key={index} className='btn btn-active btn-neutral btn-sm'>
                                                #{tag}
                                            </button>
                                        </Link>        
                                    ))}
                                </div>
                            </div>

                    
                </div>
            )}
        </>
            
        
    )
}

export default Post