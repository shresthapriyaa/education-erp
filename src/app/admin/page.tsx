
"use client";
import { signOut, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
const page = () => {
  const router = useRouter();
  const {data:session} = useSession(
   {
    required:true,
    onUnauthenticated(){
      router.push('/auth/login')
    }
   }
  );
  return (
    <div>

      <h1>Admin page</h1>
      <button onClick={()=>{signOut()}}> Logout</button>
    </div>
  )
}

export default page
