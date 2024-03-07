import Image from "next/image";
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
      <Sidebar user={user} />
    </main>
  );
}
