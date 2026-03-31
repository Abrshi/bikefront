"use client"
import Signin from '@/components/auth/Signin';
import Signup from '@/components/auth/Signup';
import { useState } from 'react';

function Page() {
  const [toggle, setToggle] = useState(false);

  return (
    <div className='bike-bg w-full h-screen flex flex-col items-center justify-center gap-5 text-white'>
      <div className='rounded-2xl border p-8 shadow-md bg-mist-700/80'>

        {toggle 
          ? <Signup setToggle={setToggle} /> 
          : <Signin setToggle={setToggle} />
        }

        <p>
          don't have an account?{" "}
          <span 
            onClick={() => setToggle(!toggle)} 
            className='text-green-500 cursor-pointer'
          >
            {toggle ? "Signup" : "Signin"}
          </span>
        </p>

      </div>
    </div>
  );
}

export default Page;