import Link from "next/link";
import Sidebar from '@/components/shared/Sidebar';


import { SignedIn, UserButton, currentUser } from "@clerk/nextjs";
import { getUserByClerkId, getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs'

export default async function Home() {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.sub as string;

  let user = await getUserByClerkId(userId);
  user = user[0]


  return (
    <main className="bg-base-100 w-screen h-screen">
      {user && user.role === 'admin' && (
        <Link href='/create'>
          <button className="w-24 h-24 btn fixed right-6 bottom-6 outline-none btn-active" title="New">
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

      )}
    </main>
  );
}
