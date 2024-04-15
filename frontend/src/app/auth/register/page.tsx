'use client';
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { signIn } from "next-auth/react";


interface UserData {
  username: string;
  email: string;
  password: string;
  timezone?: string;
}

interface ErrorData {
  username?: string;
  email?: string;
  password?: string;
}

export default function Authentication() {
    const [userData, setUserData] = useState<UserData>({
        username: '',
        email: '',
        password: ''
    });
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [errors, setErrors] = useState<ErrorData>({});

    const router = useRouter();
    
    const validateEmail = (email: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
    
    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[A-Za-z])/.test(password)) {
            return 'Password must contain at least one letter';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Password must contain at least one digit';
        }
        if (!/(?=.*[@$!%*#?&])/.test(password)) {
            return 'Password must contain at least one special character (@, $, !, %, *, #, ?, &, etc.)';
        }
        return '';
    }
    
    const validateInputs = () => {
        let newErrors = {};
        if (!userData.username.trim()) newErrors.username = 'Username is required';
        if (!userData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(userData.email)) {
          newErrors.email = 'Email is not valid';
        }
        if (!userData.password) {
          newErrors.password = 'Password is required';
        } else {
          const passwordError = validatePassword(userData.password);
          if (passwordError) {
            newErrors.password = passwordError;
          }
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) {
          // Set the alert message and show the alert
          setAlertMessage(Object.values(newErrors).join(', '));
          setShowAlert(true);
          return false;
        }
        return true;
    };
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({
          ...userData,
          [e.target.name]: e.target.value
        });
        // Reset individual error
        setErrors({
          ...errors,
          [e.target.name]: ''
        });
      };

    const register = async ({ username, email, password }: UserData): Promise<any> => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const result = await signIn('register', {
          username,
          email,
          password,
          timezone,
          redirect: false,
      });
  
      if (result.error) {
          console.error('Registration failed:', result.error);
          throw new Error(result.error);
      } else {
          console.log('Registration successful');
          return result;
      }
    };
    

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setShowAlert(false);  // Hide previous alerts if any
        if (!validateInputs()) {
            return; 
        }
        try {
            const result = await register(userData);
            console.log('Registration Successful', result);
            router.push('/dashboard');  // Redirect to dashboard on successful registration
        } catch (error: any) {
            console.error('Registration Failed', error.message);
            setAlertMessage(error.message);  // Set the alert message based on the error
            setShowAlert(true);  // Show the alert on the UI
        }
    };


  return (
    
    <form onSubmit={handleSubmit} autoComplete="off" className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-full ">
      <div className="flex items-center justify-center py-12 h-full">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-balance text-muted-foreground">
              Welcome to Tempus
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Your username"
                    required
                    value={userData.username}
                    onChange={handleInputChange}
                    autoComplete="off"
                    />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={userData.email}
                    onChange={handleInputChange}
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
                    name="password"
                    type="password"
                    placeholder="Your password"
                    required
                    value={userData.password}
                    onChange={handleInputChange}
                    />
            </div>
            <Button type="submit" className="w-full">
              Register
            </Button>
            {showAlert && (
                <Alert variant='destructive'>
                <AlertTitle>Error!</AlertTitle>
                <AlertDescription>
                    {alertMessage}
                </AlertDescription>
                </Alert>
            )}
            {/* <Button variant="outline" className="w-full" onClick={() => signIn('google')}>
              Login with Google
            </Button> */}
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline">
              Sign In
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
