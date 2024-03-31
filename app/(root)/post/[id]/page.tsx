"use client";

import { getPostById } from '@/lib/actions/post.actions';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import { getSubjectIcon, subjects } from '@/lib/static';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import CreateCommentForm from '@/components/shared/CreateCommentForm';
import { DialogOverlay } from '@radix-ui/react-dialog';
import Comment from '@/components/shared/Comment';
import { getUserByClerkId } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';


const page = ({ params: { id } }: { params: {  id: string} }) => {

    const [post, setPost] = useState<any>([])
    const [comments, setComments] = useState<any>([])

    const [commentsLimit, setCommentsLimit] = useState(3)

    const [isLoadingComment, setIsLoadingComment] = useState(false)

    const [fetchedUser, setFetchedUser] = useState(null)

    const searchParams = useSearchParams()
    const pathname = usePathname()

    // const [commentsLength, setCommentsLength] = useState(0)

    const router = useRouter()

    const { isSignedIn, user} = useUser()

    // console.log(id);
    const fetchPost = async () => {
        const fetchedPost = await getPostById(id, commentsLimit, 3);
        setPost(fetchedPost)

        if (fetchedPost) {
            setTimeout(() => setIsLoadingComment(false), 1500)
        }
    }

    useEffect(() => {
        fetchPost();

        // setTimeout(() => setIsLoadingComment(false), 500)

    }, [id, commentsLimit])
    
    useEffect(() => {
        
        console.log(post);
        // console.log(post.posts)

        console.log('length: ', post.commentsLength)
        
        
        if (!post?.posts) router.refresh();
        
        
    }, [post])

    const fetchUser = async () => {
        if (!user?.id) return;
        
        try {

            const fetchedUser = await getUserByClerkId(user?.id)

            console.log(fetchedUser[0])
            setFetchedUser(fetchedUser[0])
        } catch (err: any) {
            throw new Error(`Something went wrong while fetching user: ${err.message}`);
        }
        
    }

    useEffect(() => {

        
        fetchUser()
        

        // console.log(fetchedUser)
    }, [user])

    useEffect(() => {
        // console.log(fetchedUser)
    }, [fetchedUser])


    useEffect(() => {
        if (searchParams.get('updateComments') === 'true') {
            fetchPost();
            router.replace(pathname)
        }
    }, [searchParams])
    
    
    return (
        <>
        {post && post?.posts && (
            <div className='absolute left-20 flex flex-col items-center right-0 top-0 bottom-0 bg-base-100 pb-2'>
                <div className='w-10/12 mt-5 p-2 rounded-lg h-3/5 bg-base-200 grid grid-cols-2'>
                    <div className='relative w-full overflow-hidden h-full flex items-center justify-center bg-base-100 rounded-lg'>
                        <Image src={post.posts[0]?.url} alt={post.title} fill objectFit='cover' draggable="false" />
                    </div>
                    <div className="flex flex-col p-2 pl-4 items-start w-full h-full">
                        <h1 className="text-base-content text-xl font-bold">{post.title}</h1>
                        <div className="text-base-content text-sm mt-5">{post.description}</div>
                        <a className="btn btn-outline btn-sm mt-10">{getSubjectIcon(post.subject)} {post.subject }</a>
                        <div className="grid grid-cols-3 gap-2 mt-5">
                            {post.tags.map((tag: any, index: number) => (
                                    <button key={index} className='btn btn-active btn-neutral btn-sm'>
                                        #{tag}
                                    </button>
                                ))}
                        </div>
                        <Link href={`/user/${post.author._id}`} className="relative flex justify-around shadow-lg bg-base-300 items-center w-4/12 rounded-lg mt-5 p-2">
                            <div className='relative rounded-full overflow-hidden'>
                                <Image draggable='false' src={post.author.photo} alt='user' objectFit='cover' width={35} height={35} />
                            </div>
                            <p className='text-base-content text-md font-semibold'>
                                {post.author.username}
                            </p>
                            </Link>
                            <div className="flex items-center justify-between w-11/12 text-base-content mt-5">
                                <p>[something]</p>
                                <p className='text-md'>{formatDateTime(post.createdAt).dateOnly}</p>
                            </div>
                            <div className="flex items-center justify-between w-11/12 text-base-content mt-5">
                                [favorites, views, likes...]
                            </div>
                    </div>
                </div>

                    <div className='w-10/12 mt-5 p-2 rounded-lg bg-base-200 text-base-content gap-y-4'>
                        {fetchedUser && (
                            <CreateCommentForm user={fetchedUser} postId={post._id} isReply={false} />
                        )}
                        <div className='flex flex-col gap-y-2 h-full'>
                            {post.comments.map((comment: any, index: number) => (
                                <Comment key={index} user={fetchedUser} comment={comment} />
                            ))}
                        </div>
                        {post.comments.length < post.commentsLength && (
                            <>
                                {!isLoadingComment && (
                                    <a className='btn btn-neutral btn-sm mt-3 w-full' onClick={() => { setCommentsLimit(commentsLimit + 10); setIsLoadingComment(true) }}>Load more</a>
                                )}
                                {isLoadingComment && (
                                    <button className="btn btn-sm w-full mb-5">
                                        <span className="loading loading-spinner"></span>
                                        loading
                                    </button>
                                )}
                            </>
                        )}
                </div>
            </div>

        )}
        </>
    )
}

export default page