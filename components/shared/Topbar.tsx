"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { UserButton } from "@clerk/clerk-react";
import { SignedIn, currentUser, useUser } from '@clerk/nextjs';
// import { themeChange } from 'theme-change'




const Topbar = () => {
    

// useEffect(() => {
// themeChange(false)
// // 👆 false parameter is required for react project
    // }, [])

    const { isSignedIn, user} = useUser()

    // console.log(user, isSignedIn);
    
    

    return (
        <>
            <nav className="fixed h-14 top-0 z-40 left-0 w-full bg-base-200 shadow-sm flex items-center justify-center">
                <div className="px-2 w-full h-full flex items-center justify-between gap-x-2">
                    <div>
                        <h1 className='text-2xl font-bold text-base-content'>Logo</h1>
                    </div>
                    {/* <button
                        className="w-14 h-14 btn"
                        title="User"
                    >
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                user
                            </span>
                            <p>User</p>

                        </div>
                    </button> */}
                    
                    <UserButton />
                    

                </div>
            </nav>
        </>
    );

};

export default Topbar