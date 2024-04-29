import Link from "next/link";
import { SignedIn, UserButton, currentUser } from "@clerk/nextjs";
import { getUserByClerkId, getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs'
import HomePosts from "@/components/client/HomePosts";
import { categories, subjects } from "@/lib/static";
import RightSidebar from "@/components/shared/RightSidebar";
import ApprovePosts from "@/components/client/ApprovePosts";
import HomeContent from "@/components/client/HomeContent";
import AdminButton from "@/components/client/AdminButton";





export default async function Home() {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.sub as string;
  let user: any;


  if (userId) {
    console.log('userId: ', userId)
  
    user = await getUserByClerkId(userId);
    user = user[0]

  }

  

  
  

  
  console.log('user: ', user)

  
  



  return (
    <main className="bg-base-100 w-screen h-screen pb-2">
      {/* {user && user.role === 'admin' && (
        <Link href='/create'>
          <button className="w-24 h-24 btn fixed right-6 bottom-6 outline-none btn-active z-30" title="New">
            <div className='w-full h-full flex flex-col items-center justify-center'>
              <span
                  className="material-symbols-rounded"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400", fontSize: '3rem' }}
              >
                  add_circle
            </span>
            <p>New</p>
            </div>
          </button>
        </Link>

      )} */}
      <div className="absolute top-14 md:top-0 bottom-14 md:bottom-0 left-0 md:left-20 right-0 flex items-center justify-center overflow-x-hidden overflow-y-auto">
        <main className="w-full m-4 mt-10 h-full">
          <h1 className="text-base-content text-4xl font-bold">Featured Posts</h1>
          <HomePosts />
          <HomeContent />
        </main>
      </div>
      

      {user && user.role === 'admin' && (
        <>
          <AdminButton />
        </>
      )}
      {/* <UserButton />
      <ApprovePosts /> */}
    </main>
  );
}
