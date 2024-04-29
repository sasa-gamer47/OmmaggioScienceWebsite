"use client";

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs';
import { getUserByClerkId } from '@/lib/actions/user.actions'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getPosts } from '@/lib/actions/post.actions';

const RightSidebar = () => {

    const { isSignedIn, user} = useUser()
    const [fetchedUser, setFetchedUser] = useState(null)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const navRef = useRef<HTMLElement>(null)
    
    const [approvingPosts, setApprovingPosts] = useState(false)
    // const userId = user.id

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
        if (searchParams.get('approvingPosts') === 'true') {
            // setApprovingPosts(true)

            // console.log(navRef.current?.parentElement?.parentElement?.parentElement?.children[1].children[0]);

            navRef.current?.parentElement?.parentElement?.parentElement?.children[1].children[0].setAttribute('checked', 'false')
            
        }
    }, [searchParams])


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
        fetchUser()
    }, [user])

    useEffect(() => {
        // console.log(fetchedUser)
    }, [fetchedUser])



    return (
        <nav ref={navRef} className="fixed z-40 top-10 bottom-10 right-4 w-8/12 lg:w-2/12 bg-base-200 shadow-sm flex flex-col items-center justify-around">
            <label htmlFor="my-drawer-4" className="fixed drawer-button btn left-2 top-2 ">
                <span
                    className="material-symbols-rounded"
                    style={{ fontVariationSettings: "'FILL' 1, 'wght' 400", fontSize: '2rem' }}
                    >
                        arrow_back
                </span>
            </label>
            <div className='w-full flex items-center justify-center'>
                <button className='w-11/12 btn btn-active ' onClick={() => { setApprovingPosts(true); router.push(`${pathname}?approvingPosts=true`) }}>
                    Approve posts
                    <div className='badge'>
                        {fetchedPosts?.length}
                    </div>   
                </button>   

            </div>


            <button className="w-11/12 h-auto btn outline-none btn-active" title="New">
                <Link href='/create' className='w-full h-full'>
                    <div className='w-full h-full flex flex-col items-center justify-center'>
                    <span
                        className="material-symbols-rounded"
                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400", fontSize: '3rem' }}
                    >
                        add_circle
                    </span>
                    <p>New</p>
                    </div>
                </Link>
            </button>
            


            
        </nav>
    )
}

export default RightSidebar