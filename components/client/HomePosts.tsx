"use client";

import { getPosts } from '@/lib/actions/post.actions'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react'
import Post from '../shared/Post';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { getAllAdminUsers, getUserByClerkId } from '@/lib/actions/user.actions';
import useWindowSize from '@/lib/clientUtils';

const HomePosts = () => {
    const [fetchedPosts, setFetchedPosts] = useState<any[]>([]);

    const { isSignedIn, user} = useUser()
    const [fetchedUser, setFetchedUser] = useState(null)
    const { width } = useWindowSize()

    const [postsLimit, setPostsLimit] = useState(width <= 768 ? 2 : 5)
    const [updatedPosts, setUpdatedPosts] = useState<any>(fetchedPosts)


    const fetchPosts = async () => {

        const limit = width <= 768 ? 2 : 5

        console.log(width, limit)

        const posts = await getPosts({
            query: '',
            isApproved: true,
            page: 1,
            limit,
        })
        console.log('posts', posts);
        setFetchedPosts(posts?.data);
        setUpdatedPosts(posts?.data)
    };

    const searchParams = useSearchParams()

    useEffect(() => {
            fetchPosts()
    }, [searchParams.get("approvingPosts")]);

    console.log("posts: ", fetchedPosts);

    const fetchUser = async () => {
        if (!user?.id) return;
        
        try {

            const fetchedUser = await getUserByClerkId(user?.id)

            // console.log(fetchedUser[0])
            setFetchedUser(fetchedUser[0])
        } catch (err: any) {
            throw new Error(`Something went wrong while fetching user: ${err.message}`);
        }
        
    }

    useEffect(() => {
        setPostsLimit(width <= 768 ? 2 : 5)

        if (!fetchedPosts) return;

        setUpdatedPosts(fetchedPosts.slice(0, postsLimit))

        console.log(width, postsLimit, fetchedPosts.slice(0, postsLimit))
    }, [width, postsLimit])

    useEffect(() => {

        
        fetchUser()
        

        // console.log(fetchedUser)
    }, [user])

    useEffect(() => {
        // console.log(fetchedUser)
    }, [fetchedUser])



    const [adminUsers, setAdminUsers] = useState([])

    const fetchAdminUsers = async () => {
        const adminUsers = await getAllAdminUsers();

        console.log('adminUsers', adminUsers);

        setAdminUsers(adminUsers)
    }

    useEffect(() => {
        fetchAdminUsers()
        
    }, [])

    return (
        <div className='w-full p-2 md:p-0 md:w-10/12 h-3/6 mt-5 flex items-center justify-start gap-2'>
            {updatedPosts && updatedPosts.map((post: any, index: number) => (
                <Post key={index} user={fetchedUser} post={post} toApprove={false} adminUsers={adminUsers} />
            ))}
        </div>
    )
};

export default HomePosts