"use client";

import { deleteCommentById, getChildrenByParentId, getCommentById, updateComment } from '@/lib/actions/comment.actions';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react'
import CreateCommentForm from './CreateCommentForm';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Textarea } from "@/components/ui/textarea"

import { toast, useToast } from "@/components/ui/use-toast"
import { updateCommentSchema } from '@/lib/validator';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"



const Comment = ({ user, comment }: { user: any, comment: any }) => {

    const [isReporting, setIsReporting] = useState(false)
    const [hasLiked, setHasLiked] = useState(false)
    const [hasDisliked, setHasDisliked] = useState(false)

    const [isReplying, setIsReplying] = useState(false)
    const [showReplies, setShowReplies] = useState(false)

    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [childrenLimit, setChildrenLimit] = useState(3)

    const [isLoadingChildren, setIsLoadingChildren] = useState(false)

    const [children, setChildren] = useState<any>(comment.children || [])

    const [parentComment, setParentComment] = useState<any>(null)



    const searchParams = useSearchParams()

    const pathname = usePathname()
    const router = useRouter()

    const fetchChildren = async () => {
        const fetchedComment = await getChildrenByParentId(comment._id, childrenLimit);
        setChildren(fetchedComment)

        if (fetchedComment) {
            setTimeout(() => setIsLoadingChildren(false), 1500)
        }
    }
    // const fetchParentComment = async () => { const fetchedComment = await getCommentById(comment.parentComment, childrenLimit); setParentComment(fetchedComment)}

    useEffect(() => {   
        fetchChildren();
    }, [childrenLimit])


    // useEffect(() => {
    //     // console.log(children)
    // }, [children])

    useEffect(() => {


        //*set deleting and reporting to false
    }, [isEditing])

    useEffect(() => {
        if (!user) return;

        
        

        if (comment.usersHaveLiked.find((User: any) => User === user._id)) {
            setHasLiked(true)
        } else {
            setHasLiked(false)
        }

        if (comment.usersHaveDisliked.find((User: any) => User === user._id)) {
            setHasDisliked(true)
        } else {
            setHasDisliked(false)
        }

        
        console.log(comment.createdAt, comment.updatedAt, comment.createdAt === comment.updatedAt, comment.comment);
        
    }, [comment, user])


    const handleLikeSystem = async (type: string) => {
        if (!user) return;

        if (type === 'like') {
            setHasLiked(!hasLiked)
            if (!hasLiked) {
                comment.likes += 1
                comment.usersHaveLiked.push(user._id)
            } else {
                comment.likes -= 1
                comment.usersHaveLiked = comment.usersHaveLiked.filter((User: any) => User !== user._id)
            }
            
            if (hasDisliked) {
                comment.dislikes -= 1
                comment.usersHaveDisliked = comment.usersHaveDisliked.filter((User: any) => User !== user._id)
            }

            setHasDisliked(false)
        } else if (type === 'dislike') {
            setHasDisliked(!hasDisliked)
            if (!hasDisliked) {
                comment.dislikes += 1
                comment.usersHaveDisliked.push(user._id)
            } else {
                comment.dislikes -= 1
                comment.usersHaveDisliked = comment.usersHaveDisliked.filter((User: any) => User !== user._id)
            }

            if (hasLiked) {
                comment.likes -= 1
                comment.usersHaveLiked = comment.usersHaveLiked.filter((User: any) => User !== user._id)
            }
            setHasLiked(false)
        }

        const updatedComment = await updateComment({
                comment: comment,
                // path: pathname,
        })
        
        console.log('updatedComment: ', updatedComment);

        router.refresh()
        
    }

    useEffect(() => { 
        if (searchParams.get('isReply')) {
            setChildrenLimit(childrenLimit + 1)
            setIsReplying(false)
        }
    }, [searchParams])



    const form = useForm<z.infer<typeof updateCommentSchema>>({
    resolver: zodResolver(updateCommentSchema),
        // defaultValues: {
        //     author: user._id,
        //     parentPost: postId,
        //     children: [],
        //     isChild: isReply,
        //     parentComment: commentId,
        // },
        defaultValues: {
            comment: comment.comment
        }
    });

    
    const onSubmit = async (data: z.infer<typeof updateCommentSchema>) => {
        console.log(data);
        setIsUpdating(true)


        
        try {
            comment.comment = data.comment
            comment.updatedAt = new Date()

            console.log(comment);
            
            form.resetField('comment')

            
    
            const updatedComment = await updateComment({
                    comment: comment,
                    // path: pathname,
            })

            console.log(updatedComment);
            

            
            setIsUpdating(false)

            setIsEditing(false)

            toast({
                title: "Comment updated successfully",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })

            router.refresh()
            
        } catch (err: any) {
            throw new Error(
                `Something went wrong while updating comment: ${err.message}`
            );
        }
    }

    const deleteComment = async () => {
        setIsDeleting(true)
        try {
            const deletedComment = await deleteCommentById(comment)

            console.log(deletedComment);
            
            
            setIsDeleting(false)

            router.push(`${pathname}?updateComments=true`)

            toast({
                title: "Comment deleted successfully",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })
        } catch (err: any) {
            throw new Error(
                `Something went wrong while deleting comment: ${err.message}`
            );
        }
    }

    return (
        <div className='w-full bg-base-100 flex min-h-max h-full p-2 mt-2 rounded-md relative'>
            <div className="absolute right-4 top-4">
                {/* <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className={`z-10 absolute right-0 top-0 btn btn-md`}>
                            <span
                                className="material-symbols-rounded"
                                style={{ fontVariationSettings: `'FILL' ${ hasLiked ? '1' : '0'}, 'wght' 400`, fontSize: '1.3rem' }}
                            >
                                more_vert
                            </span>
                        </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={`bg-base-100 border-0 text-base-content mt-7`}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu> */}
                    {!isEditing && (
                        <div className="dropdown dropdown-bottom dropdown-end z-10">
                            <a tabIndex={0} className='btn btn-sm px-1 py-1 btn-neutral'>
                                <span
                                    className="material-symbols-rounded"
                                    style={{ fontVariationSettings: `'FILL' ${ hasLiked ? '1' : '0'}, 'wght' 400`, fontSize: '1.3rem' }}
                                >
                                    more_vert
                                </span>
                            </a>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-36 mt-2">
                                {user && user._id === comment.author._id && (
                                    <>
                                        <li><a onClick={() => setIsEditing(!isEditing)}>✏️ Edit</a></li>
                                        <li>
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    🗑️ Delete
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className='bg-base-300 border-base-100'>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle className='text-base-content'>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription className='text-base-content'>
                                                        This action cannot be undone. This comment will permanently deleted and will be no longer visible to anybody.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteComment()}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </li>

                                    </>
                                )}
                                <li><a className=''>🚩 Report</a></li>
                            </ul>
                        </div>
                    )}

                {isEditing && (
                    <button className='absolute right-0 top-0 z-10 btn btn-sm' onClick={() => setIsEditing(!isEditing)}>Cancel</button>
                )}

            </div>



            <div className="mr-4 p-2 h-full flex items-start w-1/12">
                {isReplying || showReplies && (
                    <div className='w-full divider divider-start divider-horizontal'>
                        <Image src={comment.author?.photo} alt={comment.author?.username} width={45} height={45} objectFit='cover' draggable='false' className='rounded-full' />
                    </div>
                )}
                {!showReplies && (
                    <Image src={comment.author?.photo} alt={comment.author?.username} width={45} height={45} objectFit='cover' draggable='false' className='rounded-full' />
                )}
            </div>
            <div className='flex flex-col justify-center w-full h-full gap-y-2 text-left relative overflow-hidden'>
                <div className="flex justify-between w-full">
                    <div className="flex items-center justify-start gap-x-2 w-full">
                        <p className='text-base-content text-left text-md font-semibold'>{ comment.author?.username }</p>
                        <p className='text-base-content text-left text-sm'>{formatDateTime(comment.createdAt).dateOnly}</p>
                    </div>
                    <div className="flex items-center justify-end gap-x-2 w-full">
                        {comment.createdAt !== comment.updatedAt && (
                            <p className='text-base-content text-left text-sm mr-16'>updated: { formatDateTime(comment.updatedAt).dateTime }</p>
                            
                            )}
                        {/* <div className="dropdown dropdown-bottom dropdown-end">
                            <a tabIndex={0} className='btn btn-md'>
                                <span
                                    className="material-symbols-rounded"
                                    style={{ fontVariationSettings: `'FILL' ${ hasLiked ? '1' : '0'}, 'wght' 400`, fontSize: '1.3rem' }}
                                >
                                    more_vert
                                </span>
                            </a>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-36 mt-2">
                                <li><a className=''>✏️ Edit</a></li>
                                <li><a className=''>🗑️ Delete</a></li>
                                <li><a className=''>🚩 Report</a></li>
                            </ul>
                        </div> */}
                    </div>
                </div>
                <div className='text-base-content text-left text-sm mt-2'>
                    {!isEditing && (
                        <p>{comment.comment}</p>
                    )}
                    {isEditing && (
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="w-full flex items-center justify-between gap-x-2"
                            >
                                <div className="w-11/12">
                                <FormField
                                    control={form.control}
                                    name="comment"
                                    render={({ field }: any) => (
                                    <FormItem>
                                        {/* <FormLabel className="text-2xl text-base-content">Title</FormLabel> */}
                                        <FormControl>
                                        <Textarea
                                            className="mt-2 bg-base-100 input input-bordered w-full text-base-content outline-none comment-textarea"
                                            placeholder="Express your comments"
                                            {...field}
                                                    // value={comment.comment}
                                                    
                                        />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                    </div>
                                    {!isUpdating && (
                                        <Button type="submit" className="w-1/12">
                                            Update
                                        </Button>

                                    )}
                                    {isUpdating && (
                                        <Button className="w-1/12" disabled>
                                            Updating...
                                        </Button>
                                    )}
                            </form>
                        </Form>
                    )}
                </div>
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
                        <button className='btn btn-outline btn-sm text-sm font-semibold' onClick={() => { setShowReplies(!showReplies) }}>
                            {comment.children.find((child: any) => child.author._id === comment.author._id) && (
                                <Image src={comment.author?.photo} alt={comment.author?.username} width={25} height={25} objectFit='cover' draggable='false' className='rounded-full' />
                            )}
                            Show replies {comment.childrenLength}
                        </button>
                    )}
                </div>
                {isReplying && (
                    <div className="w-full ml-4">
                        <CreateCommentForm user={user} commentId={comment._id} isReply={true} />
                    </div>
                )}
                {showReplies && (
                    <div className="w-full ml-4 flex flex-col h-full">
                        {/* {comment.children.map((child: any, index: number) => {
                            console.log('child: ', child);
                        })} */}
                            
                        {children && children.map((child: any, index: number) => (

                                <Comment key={index} user={user} comment={child} />
                        ))}

                        {/* {parentComment ? children.length < parentComment.childrenLength : children.length < comment.childrenLength && ( */}
                        {children.length < comment.childrenLength && (
                            <>
                                {!isLoadingChildren && (
                                    <a className='btn btn-neutral btn-sm mt-3' onClick={() => { setChildrenLimit(childrenLimit + 10); setIsLoadingChildren(true) }}>Load more</a>
                                )}
                                {isLoadingChildren && (
                                    <button className="btn btn-sm">
                                        <span className="loading loading-spinner"></span>
                                        loading
                                    </button>
                                )}
                            </>
                        )}
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
