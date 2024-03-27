"use client";

import React, { useEffect, useState } from 'react'


import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Textarea } from "@/components/ui/textarea"

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
import { log } from 'console';

const CreateCommentForm = ({
    user,
    postId,
    isReply,
    commentId,
    }: {
    user: any;
    postId?: string;
    isReply: boolean;
    commentId?: string;
    }) => {
    const pathname = usePathname();
    const router = useRouter();

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

    const onSubmit = async (data: z.infer<typeof createCommentSchema>) => {
        console.log(data);

        try {
        if (!isReply) {
            if (!postId) {
            throw new Error("Post not found");
            }

            data.parentPost = postId;

            // console.log(data);

            const post = await getPostById(postId);

            if (!post) {
            throw new Error("Post not found");
            }

            const createdComment = await createComment(data);

            console.log("comment: ", createdComment);
            console.log(post);
        } else if (isReply) {
            if (!commentId) {
            throw new Error("Comment not found");
            }

            // data.parentComment = commentId;
            // data.isChild = true;

            // console.log(data);

            const createdReply = await createComment(data);

            const comment = await getCommentById(commentId);

            console.log('createdReply: ', createdReply);

            comment.children.push(createdReply._id);
            

            const updatedComment = await updateComment({
                comment: comment,
                path: pathname,
            })

            console.log('updatedComment for reply: ', updatedComment);
        }

        router.refresh();
        } catch (err: any) {
        throw new Error(
            `Something went wrong while updating post: ${err.message}`
        );
        }
    };

    return (
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
                        className="mt-2 bg-base-100 input input-bordered w-full text-base-content outline-none"
                        placeholder="Express your comments"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            </div>
            <Button type="submit" className="w-1/12">
            Comment
            </Button>
        </form>
        </Form>
    );
};

export default CreateCommentForm