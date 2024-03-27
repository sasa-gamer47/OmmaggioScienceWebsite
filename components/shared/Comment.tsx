"use client";

import { updateComment } from '@/lib/actions/comment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import CreateCommentForm from './CreateCommentForm';

const Comment = ({ comment }: { comment: any }) => {

    const [isReporting, setIsReporting] = useState(false)
    const [hasLiked, setHasLiked] = useState(false)
    const [hasDisliked, setHasDisliked] = useState(false)

    const [isReplying, setIsReplying] = useState(false)
    const [showReplies, setShowReplies] = useState(false)

    const pathname = usePathname()

    useEffect(() => {


        if (comment.usersHaveLiked.find((user: any) => user === comment.author._id)) {
            setHasLiked(true)
        }

        if (comment.usersHaveDisliked.find((user: any) => user === comment.author._id)) {
            setHasDisliked(true)
        }
    })

    // useEffect(() => { 
    //     hasLiked && setHasDisliked(false)
    //     hasDisliked && setHasLiked(false)

    // }, [hasLiked, hasDisliked])

    const handleLikeSystem = async (type: string) => {
        if (type === 'like') {
            setHasLiked(!hasLiked)
            if (!hasLiked) {
                comment.likes += 1
                comment.usersHaveLiked.push(comment.author._id)
            } else {
                comment.likes -= 1
                comment.usersHaveLiked = comment.usersHaveLiked.filter((user: any) => user !== comment.author._id)
            }
            
            if (hasDisliked) {
                comment.dislikes -= 1
                comment.usersHaveDisliked = comment.usersHaveDisliked.filter((user: any) => user !== comment.author._id)
            }

            setHasDisliked(false)
        } else if (type === 'dislike') {
            setHasDisliked(!hasDisliked)
            if (!hasDisliked) {
                comment.dislikes += 1
                comment.usersHaveDisliked.push(comment.author._id)
            } else {
                comment.dislikes -= 1
                comment.usersHaveDisliked = comment.usersHaveDisliked.filter((user: any) => user !== comment.author._id)
            }

            if (hasLiked) {
                comment.likes -= 1
                comment.usersHaveLiked = comment.usersHaveLiked.filter((user: any) => user !== comment.author._id)
            }
            setHasLiked(false)
        }

        const updatedComment = await updateComment({
                comment: comment,
                path: pathname,
        })
        
        console.log('updatedComment: ', updatedComment);
        
    }

    return (
        <div className='w-full bg-base-100 flex items-center justify-center p-2 mt-2 h-full relative'>
            <div className="mr-4 p-2 h-full flex items-center relative ">
                <div className='w-full divider divider-primary divider-horizontal'>

                <Image src={comment.author.photo} alt={comment.author.username} width={45} height={45} objectFit='cover' className='rounded-full' />
                </div>
            </div>
            <div className='flex flex-col w-full justify-around gap-y-2 text-left'>
                <div className="flex items-center justify-start gap-x-2">
                    <p className='text-base-content text-left text-md font-semibold'>{ comment.author.username }</p>
                    <p className='text-base-content text-left text-sm'>{ formatDateTime(comment.createdAt).dateOnly }</p>
                </div>
                <p className='text-base-content text-left text-sm mt-2'>{ comment.comment }</p>
                <div className="mt-2 flex items-center justify-start gap-x-2">
                    <button className='btn btn-outline btn-sm' onClick={() => handleLikeSystem('like')}>
                        <span
                            className="material-symbols-rounded"
                            style={{ fontVariationSettings: `'FILL' ${ hasLiked ? '1' : '0'}, 'wght' 400`, fontSize: '1.3rem' }}
                        >
                            thumb_up
                        </span>
                        { comment.likes }
                    </button>
                    <button className='btn btn-outline btn-sm' onClick={() => handleLikeSystem('dislike')}>
                        <span
                            className="material-symbols-rounded"
                            style={{ fontVariationSettings: `'FILL' ${ hasDisliked ? '1' : '0'}, 'wght' 300`, fontSize: '1.3rem' }}
                        >
                            thumb_down
                        </span>
                        { comment.dislikes }
                    </button>
                    <button className='btn btn-outline btn-sm text-sm font-semibold' onClick={() => setIsReplying(!isReplying)}>
                        Reply
                    </button>
                    {comment.children.length > 0 && (
                        <button className='btn btn-outline btn-sm text-sm font-semibold' onClick={() => setShowReplies(!showReplies)}>
                            Show replies {comment.children.length}
                        </button>
                    )}
                </div>
                {isReplying && (
                    <div className="w-full ml-4">
                        <CreateCommentForm user={comment.author} commentId={comment._id} isReply={true} />
                    </div>
                )}
                {showReplies && (
                    <div className="w-full ml-4 flex flex-col">
                        {comment.children.map((child: any, index: number) => {
                            console.log('child: ', child);
                        })}
                        {comment.children.map((child: any, index: number) => (
                            <Comment key={index} comment={child} />
                        ))}

                    </div>
                )}
            </div>
                    

                        {isReporting && (

                            <div>
                                <button className='btn btn-sm btn-active btn-outline'>
                                    Edit
                                </button>
                                <button className='btn btn-sm btn-active btn-outline'>
                                    Delete
                                </button>
                                <button className='btn btn-sm btn-active btn-outline'>
                                    Report
                                </button>
                                <button className='btn btn-sm btn-active btn-outline'>
                                    Report
                                    as Spam
                                </button>
                                <button className='btn btn-sm btn-active btn-outline'>
                                    Report
                                    as Inappropriate
                                </button>
                                <button className='btn btn-sm btn-active btn-outline'>
                                    Report
                                    as Offensive
                                </button>
                                <button className='btn btn-sm btn-active btn-outline'>
                                    Report
                                    as Other
                                </button>
                            </div>
                        )}
        </div>
    )
}

export default Comment
