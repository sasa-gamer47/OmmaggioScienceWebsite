"use client";

import React, { useEffect, useState } from 'react'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Textarea } from "@/components/ui/textarea"

import { useToast } from "@/components/ui/use-toast"


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
import { createCommentSchema } from '@/lib/validator';

import { getPostById, updatePost } from '@/lib/actions/post.actions';
import { usePathname, useRouter } from 'next/navigation';
import { createComment, getCommentById, updateComment } from '@/lib/actions/comment.actions';


const CreateCommentForm = ({
    user,
    postId,
    isReply,
    commentId,
    isView,
    }: {
    user: any;
    postId?: string;
    isReply: boolean;
    commentId?: string;
    isView?: boolean;
    }) => {
    
    const pathname = usePathname();
    const router = useRouter();

    const { toast } = useToast()

        console.log('isReply: ', isReply);
        

    const [isPublishing, setIsPublishing] = useState(false)

    const form = useForm<z.infer<typeof createCommentSchema>>({
    resolver: zodResolver(createCommentSchema),
        defaultValues: {
            author: user._id,
            parentPost: postId,
            children: [],
            isChild: isReply,
            parentComment: commentId,
        },
    });

    

    // const { reset } = useForm()

    const onSubmit = async (data: z.infer<typeof createCommentSchema>) => {
        console.log(data);

        setIsPublishing(true)

        form.resetField('comment')
        // document?.querySelector('.comment-textarea').select()
        // document?.querySelector('.comment-textarea').clear()
        

        try {
        if (!isReply) {
            if (!postId) {
            throw new Error("Post not found");
            }

            data.parentPost = postId;

            // console.log(data);

            const post = await getPostById(postId, Number.MAX_SAFE_INTEGER, 0);
            

            post.commentsLength += 1;

            const updatedPost = await updatePost({
                userId: user?.id || '',
                post: post,
                path: pathname,
            })

            if (!post) {
            throw new Error("Post not found");
            }

            const createdComment = await createComment(data);

            console.log("comment: ", createdComment);
            // console.log(post);
            // router.push(`${pathname}?updateComments=true`);
        } else if (isReply) {
            if (!commentId) {
            throw new Error("Comment not found");
            }

            // data.parentComment = commentId;
            // data.isChild = true;

            // console.log(data);

            const createdReply = await createComment(data);

            // console.log('createdReply: ', createdReply);

            // console.log(commentId)

            const comment = await getCommentById(commentId, Number.MAX_SAFE_INTEGER);

            // console.log(comment)

            comment.childrenLength += 1;

            console.log('createdReply: ', createdReply);

            comment.children.push(createdReply._id);
            

            const updatedComment = await updateComment({
                comment: comment,
                // path: pathname,
            })

            console.log('updatedComment for reply: ', updatedComment);
            }
            
            // data.comment = ''

            // form.reset();
            setIsPublishing(false)

            toast({
                title: "Comment published successfully",
                // description: "Friday, February 10, 2023 at 5:57 PM",
            })

            router.push(`${pathname}?updateComments=true&isReply=${isReply}`);
        } catch (err: any) {
            throw new Error(
                `Something went wrong while creating comment: ${err.message}`
            );

        

            toast({
                title: "Error publishing comment",
                description: err.message,
                variant: "destructive",
            })
        }
    };

    return (
        <Form {...form}>
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={`${isView ? 'mb-2' : ''} h-fit w-full flex items-center justify-between gap-x-2`}
        >
            <div className={`${isView ? 'w-9/12' : 'w-11/12'} `}>
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
                        value={isPublishing ? '' : field.value}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
                </div>
                {!isPublishing && (
                    <Button type="submit" className={`${isView ? 'w-3/12' : 'w-1/12'} `}>
                        Comment
                    </Button>

                )}
                {isPublishing && (
                    <Button className={`${isView ? 'w-3/12' : 'w-1/12'} `} disabled>
                        Publishing...
                    </Button>
                )}
        </form>
        </Form>
    );
};

export default CreateCommentForm