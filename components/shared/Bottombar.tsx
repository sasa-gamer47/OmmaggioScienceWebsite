"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { UserButton } from "@clerk/clerk-react";
import { SignedIn, currentUser, useUser } from '@clerk/nextjs';
// import { themeChange } from 'theme-change'




const Bottombar = () => {
    const [showSettings, setShowSettings] = useState(false);
    

// useEffect(() => {
// themeChange(false)
// // 👆 false parameter is required for react project
    // }, [])

    const { isSignedIn, user} = useUser()

    // console.log(user, isSignedIn);
    
    
    useEffect(() => {

        
        if (typeof document !== "undefined" && typeof localStorage !== "undefined") {
            // Set the data-theme attribute on the <html> element
            document.documentElement.setAttribute("data-theme", localStorage.getItem('theme') || 'dark');
            }
    }, [])

const handleThemeChange = (themeName: string) => {
    // Check if document is defined (only on client-side)
    if (typeof document !== "undefined" && typeof localStorage !== "undefined") {
        // Set the data-theme attribute on the <html> element
        localStorage.setItem('theme', themeName)
        document.documentElement.setAttribute("data-theme", themeName);
    }
};

    return (
        <>
            <nav className="fixed h-auto bottom-0 z-40 left-0 w-full bg-base-200 shadow-sm flex items-center justify-center">
                <div className=" w-full h-full flex  items-center justify-between gap-x-2">
                    <Link href='/' className="w-14 h-14 btn" title="Home">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                home
                            </span>
                            {/* <p>Home</p> */}

                        </div>
                    </Link>
                    <Link href='/search' className="w-14 h-14 btn" title="Search">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                search
                            </span>
                            {/* <p>Search</p> */}

                        </div>
                    </Link>
                    <button className="w-14 h-14 btn" title="Tutorials">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                play_circle
                            </span>
                            {/* <p>Courses?</p> */}

                        </div>
                    </button>
                    <button className="w-14 h-14 btn" title="Saved">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                bookmark
                            </span>
                            {/* <p>Saved</p> */}

                        </div>
                    </button>
                    <button
                        className="w-14 h-14 btn"
                        title="Settings"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                settings
                            </span>
                            {/* <p>Settings</p> */}

                        </div>
                    </button>
                    
                        
                    

                </div>
            </nav>
        </>
    );

};

export default Bottombar