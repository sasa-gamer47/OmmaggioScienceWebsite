"use client";

import { getPosts } from '@/lib/actions/post.actions';
import { getUserByClerkId } from '@/lib/actions/user.actions';
import useWindowSize from '@/lib/clientUtils';
import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState, useRef } from 'react'
import { type CarouselApi } from "@/components/ui/carousel"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Post from '@/components/shared/Post';

const page = () => {

    const [fetchedPosts, setFetchedPosts] = useState<any[]>([]);

    const { isSignedIn, user} = useUser()
    const [fetchedUser, setFetchedUser] = useState(null)
    const { width } = useWindowSize()

    const carouselRef = useRef(null)
    
    const fetchPosts = async () => {

        // const limit = width <= 768 ? 2 : 5

        // console.log(width, limit)

        const posts = await getPosts({
            query: '',
            isApproved: true,
            page: 1,
            limit: 10,
        })
        console.log('posts', posts);
        setFetchedPosts(posts?.data);
    };

    useEffect(() => {
        fetchPosts()
    }, [])

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
        carouselRef?.current?.children[0]?.classList.add('h-full')
        // carouselRef?.current?.children[0]?.children[0]?.classList.remove('-mt-4')
    }, [carouselRef])

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)

    return (
        <>
            <main className='absolute left-0 right-0 top-14 bottom-14'>
                <div className="relative w-full h-full">
                    <Carousel ref={carouselRef} orientation="vertical" className='h-full' setApi={setApi}>
                        <CarouselContent className=' h-full'>
                            {fetchedPosts.map((post: any, index: number) => (
                                <>
                                    {post && post._id && (
                                        <CarouselItem className='h-full' key={index}>
                                            {/* <Card className='bg-green-400'>
                                                <CardContent> */}
                                                    <Post key={index} post={post} toApprove={false} user={fetchedUser} adminUsers={null} isView={true} />
                                                {/* </CardContent>
                                            </Card> */}
                                            
                                        </CarouselItem>
                                    )}
                                </>
                            ))}
                        </CarouselContent>
                        {/* <CarouselPrevious className='absolute left-4 top-1/2 -translate-y-1/2 bg-base-content' />
                        <CarouselNext className='absolute right-4 top-1/2 -translate-y-1/2 bg-base-content' /> */}
                    </Carousel>

                </div>
            </main>
        </>
    )
}

export default page