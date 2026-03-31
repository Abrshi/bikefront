"use client"
import Signin from '@/components/auth/Signin';
import Signup from '@/components/auth/Signup';
import { useState } from 'react';


function page() {
    const [toggle, setToggle] = useState(false);
  return (
    <div className='w-full h-screen flex flex-col items-center justify-center gap-5'>
    {  toggle ? <Signin/> : <Signup/>}
    don't have an account? <span onClick={()=>setToggle(!toggle)} className='text-blue-500 cursor-pointer'>{toggle ? "Signup" : "Signin"}</span>
    </div>
  )
}

export default page