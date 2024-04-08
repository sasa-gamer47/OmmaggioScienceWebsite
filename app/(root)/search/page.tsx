"use client";

import React, { useState, useEffect } from 'react'

import { getUserByClerkId } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';

const page = () => {

    const { isSignedIn, user} = useUser()

    const [fetchedUser, setFetchedUser] = useState<any>(null)


    
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
    }, [user])

    return (
        <main className="absolute left-20 bg-base-100 right-0 h-screen">
            Search {fetchedUser?.username}
        </main>
    )
}

export default page