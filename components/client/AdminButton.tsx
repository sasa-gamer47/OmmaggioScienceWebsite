"use client";

import React from 'react'
import RightSidebar from '../shared/RightSidebar'
import ApprovePosts from './ApprovePosts'
import useWindowSize from '@/lib/clientUtils'

const AdminButton = () => {


    const { width } = useWindowSize()

    return (
        <>
            <div className="drawer drawer-end sidebar">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/* Page content here */}
                <label htmlFor="my-drawer-4" className=" fixed drawer-button btn right-5 bottom-20 lg:bottom-5 ">Admin Panel</label>
            </div> 
                <div className="drawer-side">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                {/* <div className="menu fixed z-40 top-10 bottom-10 right-0 w-2/12 bg-base-200 shadow-sm flex items-center justify-center text-base-content"> */}
                    {/* Sidebar content here */}
                    {/* <li><a>Sidebar Item 1</a></li> */}
                    {/* <li><a>Sidebar Item 2</a></li> */}
                    <RightSidebar />
                {/* </div> */}
                </div>
            </div>
            <ApprovePosts />
        </>
    )
}

export default AdminButton