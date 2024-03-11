"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { createPostFormSchema } from "@/lib/validator"
import { useEffect, useState } from "react"

import { FileUploader } from "./FileUploader"

import { useUploadThing } from '@/lib/uploadthing'
import { createPost } from "@/lib/actions/post.actions"
import { useRouter } from "next/navigation"



const CreatePostForm = ({ user }: any) => {
    const [files, setFiles] = useState<File[]>([])
    const [sortedImageUrls, setSortedImageUrls] = useState<{ url: string; index: number }[]>([])
    const [staticImageUrls, setStaticImageUrls] = useState<{ url: string; index: number }[]>([])

    const { startUpload } = useUploadThing('imageUploader')

    const router = useRouter()

    useEffect(() => {
        // console.log('sorted: ', sortedImageUrls);
        
    }, [sortedImageUrls])

    const form = useForm<z.infer<typeof createPostFormSchema>>({
        resolver: zodResolver(createPostFormSchema),
        defaultValues: {
            // tags: [],
        },
    })


    

    async function onSubmit(data: z.infer<typeof createPostFormSchema>) {
        // console.log('data: ', data);
        toast({
            title: "Post successfully created",
            // description: (
            //     <p className="text-lg font-bold bg-base-200 text-base-content">Post successfully created</p>
            // ),
        })

        

        let uploadedImageUrl = data.posts

        let imagesUrls = []

        if (files.length > 0) {
            const uploadedImages = await startUpload(files)

            if (!uploadedImages) return;

            // console.log(uploadedImages);
            
            for (let i = 0; i < uploadedImages.length; i++) {
                const imageUrl = uploadedImages[i].url;
                
                imagesUrls.push(imageUrl);
            }
            uploadedImageUrl = uploadedImages[0].url
            // console.log('uploadedImages: ', uploadedImages);

        }

        let finalImageUrls: { url: string; index: number }[] = [];
        let tempFinalImageUrls: { url: string; index: number }[] = [];

        // console.log(sortedImageUrls);
        // console.log(imagesUrls);
        
        
        let i: number = 0;

        imagesUrls && imagesUrls.forEach((url: string) => {
            tempFinalImageUrls.push({ url, index: i });
            i++
        });

        i = 0;

        const sortedIndexes = sortedImageUrls.map(obj => obj.index);
        // console.log('Sorted Indexes:', sortedIndexes);

        tempFinalImageUrls.sort((a: any, b: any) => sortedIndexes.indexOf(a.index) - sortedIndexes.indexOf(b.index));

        // console.log(tempFinalImageUrls);
        // console.log('final: ', finalImageUrls);
        
        

        

        

        
        // console.log(finalImageUrls);
        

        try {
            const postData = {
                title: data.title,
                description: data.description,
                subject: data.subject,
                posts: tempFinalImageUrls,
                tags: data.tags,
                author: user._id,
                createdAt: new Date(),
                adminApproving: [user._id],
                isApproved: false,
            }

            console.log(postData);
            

            const createdPost = await createPost(postData)

            console.log(createdPost);

            router.push('/')
            
        } catch (error: any) {
            console.error(error.message)
        }
    }

    const [tags, setTags] = useState(['']);

    const handleTagChange = (event: any, index: number) => {
        const newTags = [...tags];
        newTags[index] = event.target.value;
        setTags(newTags);
    };

    const addTag = () => {
        setTags([...tags, '']);
    };



    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="fixed left-20 right-0 bottom-0 top-0 flex flex-col items-center gap-y-4 overflow-y-auto">
                <div className="w-11/12 mt-5">
                    <FormField
                        control={form.control}
                        
                    name="title"
                    render={({ field }: any) => (
                        <FormItem>
                        <FormLabel className="text-2xl text-base-content">Title</FormLabel>
                        <FormControl>
                            <Input className="mt-2 bg-base-100 input input-bordered w-full text-base-content outline-none" placeholder="Post title" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="w-11/12">
                    <FormField
                        control={form.control}
                        
                    name="description"
                    render={({ field }: any) => (
                        <FormItem>
                        <FormLabel className="text-2xl text-base-content">Description</FormLabel>
                        <FormControl>
                            <Textarea className="mt-2 bg-base-100 textarea textarea-bordered w-full text-base-content outline-none" placeholder="Post description" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="w-11/12">
                    <FormField
                        control={form.control}
                        
                    name="subject"
                    render={({ field }: any) => (
                        <FormItem>
                        <FormLabel className="text-2xl text-base-content">Subject</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="bg-base-200 border-2 border-base-00 rounded-md w-full text-base-content outline-none">
                                    <SelectValue className="border-2 border-base-200" placeholder="Select a subject" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-base-100 hover:bg-base-200 border-2 border-base-200 rounded-md w-full text-base-content outline-none">
                                <SelectItem className="hover:bg-base-200" value="chemistry">chemistry</SelectItem>
                                <SelectItem className="hover:bg-base-200" value="coding">coding</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="w-11/12">
                    <FormLabel className="text-2xl text-base-content">Tags</FormLabel>
                    <div className="w-full h-full flex items-start justify-center gap-y-1 gap-x-2">
                        {tags && tags.map((tag: any, index: number) => (
                            <FormField
                            key={index}
                            control={form.control}
                            name={`tags.${index}`}
                            render={({ field }: any) => (
                                    <Input
                                        className="mt-2 bg-base-100 text-base-content outline-none"
                                        placeholder="Post tag"
                                        value={tag}
                                        onChange={(event) => handleTagChange(event, index)}
                                        {...field}
                                    />

                            )}
                            />
                        ))}
                    
                        <a className="btn btn-active" onClick={addTag}>Add Tag</a>
                    </div>
                </div>
                <div className="w-11/12">
                    <FormField
                        control={form.control}
                        
                    name="posts"
                    render={({ field }: any) => (
                        <FormItem>
                        <FormLabel className="text-2xl text-base-content">Posts</FormLabel>
                            <FormControl>
                                <div>
                                    <FileUploader
                                        onFieldChange={field.onChange}
                                        imageUrls={field.value}
                                        setFiles={setFiles}
                                        setSortedImageUrls={setSortedImageUrls}
                                        setStaticImageUrls={setStaticImageUrls}
                                    />

                                </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <Button type="submit">Submit</Button>
            </form>
            </Form>
        )
    }


    export default CreatePostForm