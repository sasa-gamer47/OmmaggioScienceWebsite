"use client";

import useWindowSize from '@/lib/clientUtils'
import { categories, subjects } from '@/lib/static'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'



const HomeContent = () => {

    const { width } = useWindowSize()

    const [subjectsLimit, setSubjectsLimit] = useState(width <= 768 ? 2 : 5)
    const [updatedSubjects, setUpdatedSubjects] = useState<any[]>(subjects)

    const [categoriesLimit, setCategoriesLimit] = useState(width <= 768 ? 2 : 5)
    const [updatedCategories, setUpdatedCategories] = useState<any[]>(categories)


    
    
    useEffect(() => {
        setSubjectsLimit(width <= 768 ? 2 : 5)

        setUpdatedSubjects(subjects.slice(0, subjectsLimit))

        console.log(width, subjectsLimit, subjects.slice(0, subjectsLimit))
    }, [width, subjectsLimit])

    useEffect(() => {
        setCategoriesLimit(width <= 768 ? 2 : 5)

        setUpdatedCategories(categories.slice(0, categoriesLimit))
    }, [width, categoriesLimit])

    return (
        <>
            <h1 className="ml-4 md:ml-0 text-base-content text-4xl font-bold mt-5">Subjects</h1>
            <div className='w-11/12  px-2 lg:px-0 lg:w-10/12 h-1/6 mt-5 flex items-center justify-center gap-2 relative'>
                {updatedSubjects && updatedSubjects.map((subject: any, index: number) => (
                    <button key={index} className='relative w-full hover:scale-95 bg-base-200 rounded-lg transition-all duration-100 h-full flex flex-col justify-around items-center shadow-lg '>
                    <Link href={`/search?query=*${subject.name}`}>
                    <p className="text-base-content text-4xl font-bold">{subject.icon}</p>
                    <p className="text-base-content text-xl font-bold">{subject.name}</p>
                    </Link>
                </button>
                ))}
            </div>
            <h1 className="ml-4 md:ml-0 text-base-content text-4xl font-bold mt-5">Categories</h1>
            <div className='w-11/12  px-2 lg:px-0 lg:w-10/12 h-1/6 mt-5 flex items-center justify-center gap-2 relative'>
                {updatedCategories && updatedCategories.map((category: any, index: number) => (
                    <button key={index} className='relative w-full hover:scale-95 bg-base-200 rounded-lg transition-all duration-100 h-full flex flex-col justify-around items-center shadow-lg '>
                        <p className="text-base-content text-4xl font-bold">{category.icon}</p>
                        <p className="text-base-content text-xl font-bold">{category.name}</p>
                    </button>
                ))}
            </div>
        </>
    )
}

export default HomeContent