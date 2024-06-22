'use client';
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"


export default function Authentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    
    const result = await signIn('login', {
      redirect: false,
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
    <form onSubmit={handleLogin} className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-full">
      <div className="flex items-center justify-center py-12 h-full bg-[#FEFDF2]">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Welcome back to Achieve Arcade!            
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
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-black lg:flex lg:items-center lg:justify-center lg:flex-col lg:h-full">
  <Image 
    src="/icons/logo.png" 
    alt="Logo" 
    width={200} 
    height={200} 
    style={{ maxWidth: '400px' }}
  />
  <p className="text-[60px] text-white text-center leading-none" style={{ width: '80vw', maxWidth: '400px' }}>
    ACHIEVE ARCADE
  </p>
</div>

    </form>
  );
}

