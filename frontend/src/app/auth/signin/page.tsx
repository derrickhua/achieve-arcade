'use client';
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission
    const result = await signIn('login', {
      redirect: false, // Do not redirect on success, handle it below
      email,
      password,
    });
  
    if (result.error) {
      console.error(result.error);
      setAlertMessage(result.error);
      setShowAlert(true);
    } else {
      router.push('/dashboard');
    }
  };
  

  return (
    
    <form onSubmit={handleLogin} className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-full ">
      <div className="flex items-center justify-center py-12 h-full">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            {showAlert && (
                <Alert variant='destructive'>
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>
                    {alertMessage}
                </AlertDescription>
                </Alert>
            )}
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="/travel.png"
          alt="Image"
          width="1792"
          height="1024"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </form>
  )
}
