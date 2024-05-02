"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { UserButton } from "@clerk/clerk-react";
import { SignedIn, currentUser, useUser } from '@clerk/nextjs';
import { themes } from '@/lib/static';
// import { themeChange } from 'theme-change'




const Sidebar = () => {
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
            <nav className="fixed top-0 bottom-0 left-0 w-20 bg-base-200 shadow-sm flex items-center justify-center">
                <div className=" w-11/12 h-5/6 flex flex-col items-center justify-top gap-y-4">
                    <button className="w-16 h-16 btn btn-active mb-8" title="Logo">
                        Logo
                    </button>
                    <Link href='/' className="w-16 h-16 btn" title="Home">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-2xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                home
                            </span>
                            <p>Home</p>

                        </div>
                    </Link>
                    <Link href='/search' className="w-16 h-16 btn" title="Search">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-2xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                search
                            </span>
                            <p>Search</p>

                        </div>
                    </Link>
                    <button className="w-16 h-16 btn" title="Tutorials">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-2xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                play_circle
                            </span>
                            <p>Courses?</p>

                        </div>
                    </button>
                    <Link href='/view' className="w-16 h-16 btn" title="View">
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-2xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                scrollable_header
                            </span>
                            <p>View</p>

                        </div>
                    </Link>
                    <div>
                        <SignedIn>
                            {/* <UserButton /> */}
                            <button className="w-16 h-16 btn" title="Profile">
                                <div className='w-full h-full flex flex-col items-center justify-center'>
                                    <span
                                        className="material-symbols-rounded text-2xl"
                                        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                                    >
                                        person
                                    </span>
                                    <p>Profile</p>

                                </div>
                            </button>
                        </SignedIn>
                        {!user && (
                            <Link href="/sign-in">
                                <button className="w-16 h-16 btn btn-active">
                                    Login
                                </button>
                            </Link>

                        )}
                        
                    </div>

                    <button
                        className={`w-16 h-16 btn mt-12 ${showSettings? 'bg-base-content text-base-100' : ''}`}
                        title="Settings"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <div className='w-full h-full flex flex-col items-center justify-center'>
                            <span
                                className="material-symbols-rounded text-2xl"
                                style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                            >
                                settings
                            </span>
                            <p>Settings</p>

                        </div>
                    </button>
                </div>
            </nav>

        {showSettings && (
            <div className="fixed z-40 bg-base-300 top-0 bottom-0 right-0 left-20 flex items-center justify-center flex-col">
            <div className="w-11/12 h-5/6 flex flex-col items-center justify-top gap-y-4">
                <h1 className="text-4xl font-extrabold text-base-content">
                Settings
                </h1>
                <div className="flex w-full justify-around items-center">
                <p className="text-base-content text-lg">Choose theme</p>
                <div className="dropdown dropdown-down">
                    <button
                    tabIndex={0}
                    role="button"
                    className="w-full h-full btn btn-active"
                    title="Change theme"
                    >
                    Change theme
                    </button>
                    <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                                >
                                    {themes.map((theme: string, index: number) => (
                                        <li
                                            key={index}
                                                className="btn"
                                                data-theme={theme}
                                                title={theme.charAt(0).toUpperCase() + theme.slice(1)}
                                                onClick={() => handleThemeChange(theme)}
                                            >
                                                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                            </li>
                            
                                    ))}

                    {/* <li className='btn' data-set-theme="dark">Dark</li>
                                        <li className='btn' data-set-theme="light">Light</li>
                                        <li className='btn' data-set-theme="aqua">Aqua</li> */}
                    </ul>
                </div>
                </div>
            </div>
            </div>
        )}
        </>
    );

};

export default Sidebar