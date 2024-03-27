"use client";

import { getPostById } from '@/lib/actions/post.actions';
import Image from 'next/image';
import React, { useState, useEffect } from 'react'
import { getSubjectIcon, subjects } from '@/lib/static';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDateTime } from '@/lib/utils';
import CreateCommentForm from '@/components/shared/CreateCommentForm';
import { DialogOverlay } from '@radix-ui/react-dialog';
import Comment from '@/components/shared/Comment';

const page = ({ params: { id } }: { params: {  id: string} }) => {

    const [post, setPost] = useState<any>([])
    const [comments, setComments] = useState<any>([])

    const router = useRouter()

    // console.log(id);
    const fetchPost = async () => { const fetchedPost = await getPostById(id); setPost(fetchedPost)}

    useEffect(() => {
        fetchPost();

    }, [id])
    
    useEffect(() => {
        
        console.log(post);
        // console.log(post.posts)

        
        
        if (!post?.posts) router.refresh();
        
        
    }, [post])
    
    
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
                        <CreateCommentForm user={post.author} postId={post._id} isReply={false} />
                        <div className='flex flex-col gap-y-2'>
                            {post.comments.map((comment: any, index: number) => (
                                <Comment key={index} comment={comment} />
                            ))}
                        </div>
                </div>
            </div>

        )}
        </>
    )
}

export default page