"use client";

import React from 'react'
import useWindowSize from '@/lib/clientUtils'
import Sidebar from '../shared/Sidebar'
import Bottombar from '../shared/Bottombar'
import Topbar from '../shared/Topbar';

const RenderSidebar = () => {

    const { width } = useWindowSize()


    return (
        <>
            {width >= 768 && <Sidebar />}
            {width < 768 && (<><Bottombar /> <Topbar /></>)}
        </>
    )
}

export default RenderSidebar