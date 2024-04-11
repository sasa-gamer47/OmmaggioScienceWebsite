"use client";

import React from 'react'
import useWindowSize from '@/lib/clientUtils'
import Sidebar from '../shared/Sidebar'
import Bottombar from '../shared/Bottombar'

const RenderSidebar = () => {

    const { width } = useWindowSize()

    return (
        <>
            {width >= 768 && <Sidebar />}
            {width < 768 && <Bottombar />}
        </>
    )
}

export default RenderSidebar