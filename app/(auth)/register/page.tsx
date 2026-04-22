'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';

import { auth } from '../../lib/firebase/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 📧 Email/Password Register
  const handleRegister = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);

      const token = await user.user.getIdToken();
      document.cookie = `token=${token}; path=/`;

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  // 🔐 Google Login
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();
      document.cookie = `token=${token}; path=/`;

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Google login failed');
    }
  };

  return (
    <>
      <div className='flex items-center justify-center h-screen'>
        <Card className='w-[350px] p-4'>
          <CardContent className='space-y-4'>
            <div className='flex justify-center mb-4'>
              <Image
                src="/thinkstack_logo_1024.png"
                alt="Logo"
                width={64}
                height={64}
              />
            </div>
            <h2 className='text-xl font-semibold text-center'>
              Create your ThinkStack account
            </h2>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input type='email' onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Password */}
            <div>
              <Label>Password</Label>
              <Input
                type='password'
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Register Button */}
            <Button
              className='w-full cursor-pointer hover:bg-gray-100 hover:text-gray-700 duration-300'
              onClick={handleRegister}
            >
              Register
            </Button>

            {/* Divider */}
            <div className='text-center text-sm text-gray-500'>OR</div>

            {/* Google Button */}
            <Button
              variant='outline'
              className='w-full cursor-pointer hover:bg-gray-100 hover:text-gray-700 duration-300'
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </Button>
          </CardContent>
          <div>
            <p className='mt-4 text-center text-sm text-gray-600'></p>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-medium text-blue-600 hover:underline'
            >
              Login here
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
}
