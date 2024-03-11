import Image from "next/image";
import CreatePostForm from '@/components/shared/CreatePostForm';


import { SignedIn, UserButton, currentUser } from "@clerk/nextjs";
import { getUserByClerkId, getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs'
import { redirect } from "next/navigation";



export default async function Page() {
    const { sessionClaims } = auth();

    const userId = sessionClaims?.sub as string;

    let user = await getUserByClerkId(userId);
    user = user[0]

    user.role !== 'admin' && redirect('/')
    
    return (
        <main className="bg-base-100 w-screen h-screen">
        {user && user.role === 'admin' && (
            <CreatePostForm user={user} />

        )}
        </main>
    );
}
