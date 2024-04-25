"use client"
import Link from "next/link"
import React, { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import {
  Home,
  Menu,
  Hourglass,
  CircleUser,
  Calendar,
  CheckSquare,
  MapPin,
  Clock,
} from "lucide-react"
import Image from 'next/image'
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { signOut } from 'next-auth/react';

interface DashboardProps {
    children: ReactNode;
}

export function Dashboard({ children}: DashboardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    function handleSignOut(){
        signOut()
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                        <Image src='/tempuslogo.png' width={30} height={30} alt="Tempus Logo" />
                        <span className="">Tempus</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/dashboard') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Home className="h-5 w-5" />
                        Dashboard
                        </Link>
                        <Link
                            href="/dashboard/goals"
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/dashboard/goals') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <CheckSquare className="h-5 w-5" />
                            Goals
                        </Link>
                        <Link
                            href="/dashboard/habit"
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/dashboard/habit') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Calendar className="h-5 w-5" />
                            Habit
                        </Link>
                        <Link
                            href="/dashboard/schedule"
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/dashboard/schedule') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Clock className="h-5 w-5" />
                            Schedule
                        </Link>
                        <Link
                            href="/dashboard/purpose"
                            className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/dashboard/purpose') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <MapPin className="h-5 w-5" />
                            Purpose
                        </Link>
                        </nav>
                    </div>
                <div className="mt-auto p-4">
                </div>
                </div>
        </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <Sheet>
                    <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="/"
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Home className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/goals"
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/goals') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <CheckSquare className="h-5 w-5" />
                        Goals
                    </Link>
                    <Link
                        href="/habit"
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/habit') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Calendar className="h-5 w-5" />
                        Habit
                    </Link>
                    <Link
                        href="/schedule"
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/schedule') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Clock className="h-5 w-5" />
                        Schedule
                    </Link>
                    <Link
                        href="/purpose"
                        className={`flex items-center gap-3 rounded-lg px-3 py-3 transition-all ${isActive('/purpose') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <MapPin className="h-5 w-5" />
                        Purpose
                    </Link>
                    </nav>
                    <div className="mt-auto">
                    </div>
                    </SheetContent>
                </Sheet>
                <div className="w-full flex-1">
                    <form>
                    <div className="relative">
                    </div>
                    </form>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
