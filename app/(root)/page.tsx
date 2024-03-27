import Link from "next/link";
import { SignedIn, UserButton, currentUser } from "@clerk/nextjs";
import { getUserByClerkId, getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs'
import HomePosts from "@/components/client/HomePosts";
import { categories, subjects } from "@/lib/static";
import RightSidebar from "@/components/shared/RightSidebar";
import ApprovePosts from "@/components/client/ApprovePosts";





export default async function Home() {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.sub as string;

  let user = await getUserByClerkId(userId);
  user = user[0]
  

  
  

  


  
  



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
      <div className="absolute top-0 bottom-0 left-20 right-0 flex items-center justify-center overflow-x-hidden overflow-y-auto">
        <main className="w-full m-4 mt-10 h-full">
          <h1 className="text-base-content text-4xl font-bold">Featured Posts</h1>
          <HomePosts />
          <h1 className="text-base-content text-4xl font-bold mt-5">Subjects</h1>
          <div className='w-10/12 h-1/6 mt-5 flex items-center justify-center gap-2 relative'>
            {subjects && subjects.map((subject: any, index: number) => (
              <button key={index} className='relative w-full hover:scale-95 bg-base-200 rounded-lg transition-all duration-100 h-full flex flex-col justify-around items-center shadow-lg '>
                <p className="text-base-content text-4xl font-bold">{subject.icon}</p>
                <p className="text-base-content text-xl font-bold">{subject.name}</p>
              </button>
            ))}
          </div>
          <h1 className="text-base-content text-4xl font-bold mt-5">Categories</h1>
          <div className='w-10/12 h-1/6 mt-5 flex items-center justify-center gap-2 relative'>
            {categories && categories.map((category: any, index: number) => (
              <button key={index} className='relative w-full hover:scale-95 bg-base-200 rounded-lg transition-all duration-100 h-full flex flex-col justify-around items-center shadow-lg '>
                <p className="text-base-content text-4xl font-bold">{category.icon}</p>
                <p className="text-base-content text-xl font-bold">{category.name}</p>
              </button>
            ))}
          </div>
        </main>
      </div>
      

      {user && user.role === 'admin' && (
        <>
          <div className="drawer drawer-end sidebar">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label htmlFor="my-drawer-4" className=" fixed drawer-button btn right-5 bottom-5 ">Admin Panel</label>
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
        </>
      )}
      {/* <UserButton /> */}
      <ApprovePosts />
    </main>
  );
}
