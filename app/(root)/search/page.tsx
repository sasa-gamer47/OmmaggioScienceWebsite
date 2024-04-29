"use client";

import React, { useState, useEffect } from 'react'

import { getUserByClerkId } from '@/lib/actions/user.actions';
import { useUser } from '@clerk/nextjs';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { advancedQuerySettingsSchema, searchPostSchema } from '@/lib/validator';
import { getPosts } from '@/lib/actions/post.actions';
import Post from '@/components/shared/Post';

import { type CarouselApi } from "@/components/ui/carousel"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { Checkbox } from "@/components/ui/checkbox"
import { categories, subjects } from '@/lib/static';
import { useSearchParams } from 'next/navigation';




const page = () => {

    const { isSignedIn, user} = useUser()

    const [fetchedUser, setFetchedUser] = useState<any>(null)

    const [searchedPosts, setSearchedPosts] = useState<any[]>([])

    const [isAdvancedResearch, setIsAdvancedResearch] = useState(false)

    const [currentPage, setCurrentPage] = useState(1)

    const [query, setQuery] = useState('')

    const searchParams = useSearchParams()

    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    
    useEffect(() => {
        if (!api) {
            return
        }
    
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
    
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })

        
    }, [api])

    useEffect(() => {
        let posts: any;

        const fetchPosts = async () => {
                // console.log('searchParams: ', searchParams.get('query'))

                console.log('query: ', query, searchParams.get('query'))

        

                if (query.split('#').length > 1) {
                    posts = await getPosts({
                        query: '',
                        isApproved: true,
                        page: 1,
                        limit: 10,
                        tags: query.split('#').filter((tag: string) => tag.trim() && tag.trim() !== ''),
                    })
                
                    console.log(query.split('#').filter((tag: string) => tag.trim() !== ''))
                } else if (query.split('*').length > 1) {

                    const subject = (query.split('*')[1].toLowerCase().charAt(0).toUpperCase().trim() + query.split('*')[1].toLowerCase().slice(1).trim()).trim()

                    console.log(subject)

                    posts = await getPosts({
                        query: '',
                        isApproved: true,
                        page: 1,
                        limit: 10,
                        subject: subject,
                    })
                } else {
                    posts = await getPosts({
                        query: query,
                        isApproved: true,
                        page: 1,
                        limit: 10
                    })
                
                }
            

            setSearchedPosts(posts?.data)

            // setQuery('')
        }


        if (searchParams.get('query') && typeof searchParams.get('query') === 'string') {

            console.log(searchParams.get('query'))
            setQuery(searchParams.get('query')!)
            
            if (query.trim() === '') return;

            // fetchPosts()
        }
        
        

        // fetchPosts()
    }, [searchParams])

    useEffect(() => {
        let posts: any;

        const fetchPosts = async () => {
                // console.log('searchParams: ', searchParams.get('query'))

            console.log('query: ', query, searchParams.get('query'))
            
            if (query.trim() === '') return;

        

                if (searchParams.get('tag')?.trim() !== '' && typeof searchParams.get('tag') ==='string') {
                    posts = await getPosts({
                        query: '',
                        isApproved: true,
                        page: 1,
                        limit: 10,
                        tags: [searchParams.get('tag')!.trim()],
                    })
                
                    console.log(query.split('#').filter((tag: string) => tag.trim() !== ''))
                } else if (query.split('*').length > 1) {

                    const subject = (query.split('*')[1].toLowerCase().charAt(0).toUpperCase().trim() + query.split('*')[1].toLowerCase().slice(1).trim()).trim()

                    console.log(subject)

                    posts = await getPosts({
                        query: '',
                        isApproved: true,
                        page: 1,
                        limit: 10,
                        subject: subject,
                    })
                } else {
                    posts = await getPosts({
                        query: query,
                        isApproved: true,
                        page: 1,
                        limit: 10
                    })
                
                }
            

            setSearchedPosts(posts?.data)

            // setQuery('')
        }


        if (searchParams.get('query')) {
            fetchPosts()
        }
    }, [query])
    
    useEffect(() => {
        
        if (current + 2 === searchedPosts.length && searchedPosts.length > 0) {
            console.log('loading new...')
            setCurrentPage(Math.floor(currentPage + 1))

            const fetchPosts = async () => {
                const posts = await getPosts({
                    query,
                    isApproved: true,
                    page: currentPage + 1,
                    limit: 10
                })

                console.log('more posts fetched: ', posts )

                // setSearchedPosts(searchedPosts.concat(posts.data))
                if (!posts?.data) { console.log('no more posts'); return }

                setSearchedPosts([...searchedPosts,...posts?.data])
            }

        
            fetchPosts()

            // console.log(searchedPosts)

        }
    }, [current])


    useEffect(() => {
        console.log('searchedPosts: ', searchedPosts)
    }, [searchedPosts])
    
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


    const form = useForm<z.infer<typeof searchPostSchema>>({
    resolver: zodResolver(searchPostSchema),
    defaultValues: {
            query: ''
        },
    })
    
    const onSubmit = async (values: z.infer<typeof searchPostSchema>) => {
        console.log(values)
        
        setQuery(values.query);

        let posts: any;
        

        if (values.query.split('#').length > 1) {
            posts = await getPosts({
                query: '',
                isApproved: true,
                page: 1,
                limit: 10,
                tags: values.query.split('#').filter((tag: string) => tag.trim() && tag.trim() !== ''),
            })
            
            console.log(values.query.split('#').filter((tag: string) => tag.trim() !== ''))
        } else if (values.query.split('*').length > 1) {

            const subject = (values.query.split('*')[1].toLowerCase().charAt(0).toUpperCase().trim() + values.query.split('*')[1].toLowerCase().slice(1).trim()).trim()

            console.log(subject)

            posts = await getPosts({
                query: '',
                isApproved: true,
                page: 1,
                limit: 10,
                subject: subject,
            })
        } else {
            posts = await getPosts({
                query: values.query,
                isApproved: true,
                page: 1,
                limit: 10
            })
            
        }
        console.log('posts', posts);
    
        setSearchedPosts(posts?.data);



    }
        
    const advancedQuerySettingsForm = useForm<z.infer<typeof advancedQuerySettingsSchema>>({
    resolver: zodResolver(advancedQuerySettingsSchema),
        defaultValues: {
            categories: [],
            subjects: [],
            // query: ''
        },
    })

    const onAdvancedQuerySettingsSubmit = async (values: z.infer<typeof advancedQuerySettingsSchema>) => {
        console.log(values)

        let posts: any;
        

        if (query.split('#').length > 1) {
            posts = await getPosts({
                query: '',
                isApproved: true,
                page: 1,
                limit: 10,
                tags: query.split('#').filter((tag: string) => tag.trim() && tag.trim() !== ''),
                subjects: values.subjects,
            })
            
            console.log(query.split('#').filter((tag: string) => tag.trim() !== ''))
        }
        // else if (query.split('*').length > 1) {

        //     const subject = (query.split('*')[1].toLowerCase().charAt(0).toUpperCase().trim() + query.split('*')[1].toLowerCase().slice(1).trim()).trim()

        //     console.log(subject)

        //     posts = await getPosts({
        //         query: query,
        //         isApproved: true,
        //         page: 1,
        //         limit: 10,
        //         subject: subject,
        //         subjects: values.subjects,
        //     })
        // } else
        {
            posts = await getPosts({
                query: query,
                isApproved: true,
                page: 1,
                limit: 10,
                subjects: values.subjects,
            })
            
        }
        console.log('posts', posts);
        
        setSearchedPosts(posts?.data);
    }

    return (
        <main className="absolute top-14 bottom-14 left-0 lg:top-0 lg:bottom-0 lg:left-20 right-0 flex items-center justify-center overflow-x-hidden overflow-y-auto">
            <div className="w-full h-full">
                <div className="w-full h-full lg:m-4">
                    <h1 className="ml-2 lg:ml-0 text-base-content text-4xl font-bold">Search Posts</h1>
                    <div className='w-full m-2 lg:w-11/12 h-auto flex justify-between items-center gap-x-2 lg:gap-x-4'>

                        <div className='w-full lg:w-1/3 mt-2'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex gap-x-2 items-center justify-between">
                                    <FormField
                                    control={form.control}
                                    name="query"
                                    render={({ field }) => {
                                        
                                        setQuery(field.value)
                                        // console.log(field.value)
                                        
                                    return (
                                        <FormItem className='w-full h-full'>
                                        {/* <FormLabel>Username</FormLabel> */}
                                            <FormControl>
                                                <Input className='bg-base-300 text-base-content border-0' placeholder="Search your post..." {...field} />
                                            </FormControl>
                                        {/* <FormDescription>
                                            This is your public display name.
                                        </FormDescription> */}
                                        <FormMessage />
                                        </FormItem>
                                    )}}
                                    />
                                    {!isAdvancedResearch && (
                                        <button className='btn btn-active' type="submit">Search</button>
                                    )}
                                </form>
                            </Form>
                        </div> 
                        
                        <div className="w-16 h-full flex justify-center items-center">
                            <button onClick={() => setIsAdvancedResearch(!isAdvancedResearch)} className="btn btn-active btn-sm btn-square">
                                {/* Advanced research */}
                                    <span
                                    className="material-symbols-rounded text-2xl"
                                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 300" }}
                                >
                                    settings
                                </span>
                            </button>
                        </div>
                        {/* <div className="w-full h-full">

                        </div> */}
                        
                    </div>



                    
                            {isAdvancedResearch && (
                                <div className=''>
                                    <Form {...advancedQuerySettingsForm}>
                                <form onSubmit={advancedQuerySettingsForm.handleSubmit(onAdvancedQuerySettingsSubmit)} className="">
                                    <div className='my-2 w-full grid grid-cols-3 gap-2 ml-4 lg:ml-0'>
                                        <FormField
                                        control={advancedQuerySettingsForm.control}
                                        name="categories"
                                        render={() => (
                                            <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base-content text-lg">Categories</FormLabel>
                                                {/* <FormDescription>
                                                Select the categories you want to display in the sidebar.
                                                </FormDescription> */}
                                            </div>
                                            {categories.map((category: any) => (
                                                <FormField
                                                key={category.name}
                                                control={advancedQuerySettingsForm.control}
                                                name="categories"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem
                                                        key={category.name}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                                <Checkbox
                                                                    className='outline outline-base-content'
                                                            checked={field.value?.includes(category.name)}
                                                            onCheckedChange={(checked: boolean) => {
                                                                
                                                                // console.log(checked, field.value)        

                                                                return checked
                                                                    ? field.onChange([...field.value, category.name])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value: any) => {
                                                                                return value !== category.name
                                                                            }
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal text-base-content cursor-pointer">
                                                            {category.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                                />
                                            ))}
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        <FormField
                                        control={advancedQuerySettingsForm.control}
                                        name="subjects"
                                        render={() => (
                                            <FormItem>
                                            <div className="mb-4">
                                                <FormLabel className="text-base-content text-lg">Subjects</FormLabel>
                                                {/* <FormDescription>
                                                Select the categories you want to display in the sidebar.
                                                </FormDescription> */}
                                            </div>
                                            {subjects.map((subject: any) => (
                                                <FormField
                                                key={subject.name}
                                                control={advancedQuerySettingsForm.control}
                                                name="subjects"
                                                render={({ field }) => {
                                                    return (
                                                    <FormItem
                                                        key={subject.name}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                                <Checkbox
                                                                    className='outline outline-base-content'
                                                            checked={field.value?.includes(subject.name)}
                                                            onCheckedChange={(checked: boolean) => {
                                                                
                                                                // console.log(checked, field.value)        

                                                                return checked
                                                                    ? field.onChange([...field.value, subject.name])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value: any) => {
                                                                                return value !== subject.name
                                                                            }
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal text-base-content cursor-pointer">
                                                            {subject.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                                />
                                            ))}
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                        />
                                        </div>
                                        <button className='btn' type="submit">Submit</button>
                                    {/* onClick={() => console.log(advancedQuerySettingsForm.formState.errors)} */}
                                    </form>
                                </Form>
                            </div>

                            )}
                    {searchedPosts && searchedPosts.length > 0 && (
                        <p className='text-md text-muted-foreground'>{searchedPosts.length} found. {current + 2} / {searchedPosts.length} posts</p>
                    )}
                    <div className='mt-2 w-11/12 h-2/5 relative ml-2 lg:ml-0'>
                        {searchedPosts && searchedPosts.length <= 0 && (<p className='text-base-content'>no post found</p>)}
                        {/* {searchedPosts && searchedPosts.length > 0 && searchedPosts.map((post: any, index: number) => (
                        ))} */}

                        {searchedPosts && searchedPosts.length > 0 && (
                            <Carousel className='w-full h-full lg:min-h-auto min-h-80' setApi={setApi}>
                                <CarouselContent className='sm:min-h-28 min-h-full h-80 lg:h-auto'>
                                    {searchedPosts.map((post: any, index: number) => (
                                        <>
                                            {post && post._id && (
                                                <CarouselItem className='basis-1/2 lg:basis-1/4' key={index}>
                                                    <div className="w-full h-full flex justify-center items-center  lg:aspect-square">
                                                        <Post key={index} post={post} toApprove={false} user={fetchedUser} adminUsers={null} />
                                                    </div>
                                                </CarouselItem>
                                            )}
                                        </>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className='absolute left-4 top-1/2 -translate-y-1/2 bg-base-content' />
                                <CarouselNext className='absolute right-4 top-1/2 -translate-y-1/2 bg-base-content' />
                            </Carousel>

                        )}
                    </div>
                </div>
            </div>

        </main>
    )
}

export default page