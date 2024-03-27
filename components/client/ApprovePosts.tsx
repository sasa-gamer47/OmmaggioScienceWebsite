"use client";

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import { getAllAdminUsers, getUserByClerkId } from '@/lib/actions/user.actions'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getPosts } from '@/lib/actions/post.actions';
import Post from '../shared/Post';

const ApprovePosts = () => {

    const { isSignedIn, user} = useUser()
    const [fetchedUser, setFetchedUser] = useState(null)

    const router = useRouter()
    const pathname = usePathname()

    
    const [approvingPosts, setApprovingPosts] = useState(false)

    const searchParams = useSearchParams()
    
    
    const [fetchedPosts, setFetchedPosts] = useState<any[]>([]);


    const fetchPosts = async () => {
        const posts = await getPosts({
            query: '',
            isApproved: false,
            page: 1,
            limit: 20
        })
        console.log('posts', posts);
        setFetchedPosts(posts?.data);
    };


    useEffect(() => {
        console.log(searchParams.get('approvingPosts'));

        setApprovingPosts(searchParams.get('approvingPosts') === 'true' ? true : false)
        searchParams.get('approvingPosts') === 'true' && fetchPosts();
        

        searchParams.get('approvingPosts') !== 'true' && router.push(pathname);
        
    },[searchParams])

    

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
        <>
            {approvingPosts && (
                <div className='fixed w-screen h-screen bg-base-200 z-40 flex items-center justify-center'>
                    <div className='absolute top-2 left-2 text-base-content cursor-pointer' onClick={() => { setApprovingPosts(false); router.push(pathname) }}>
                        <span
                            className="material-symbols-rounded"
                            style={{ fontVariationSettings: "'FILL' 1, 'wght' 400", fontSize: '3rem' }}
                            >
                                arrow_back
                        </span>
                    </div>
                    <div className='bg-base-100 p-2 rounded-lg w-11/12 h-5/6 posts-container grid gap-2 overflow-y-auto'>
                        {fetchedPosts && fetchedPosts.map((post: any, index: number) => (
                            <Post key={index} user={fetchedUser} post={post} toApprove={true} adminUsers={adminUsers} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default ApprovePosts