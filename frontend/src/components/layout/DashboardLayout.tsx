"use client"
import Link from "next/link"
import React, { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation'
import {
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  Hourglass,
  Users,
  Bell,
  CircleUser,
  Calendar,
  CheckSquare,
  MapPin,
  Clock,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
 
interface DashboardProps {
    children: ReactNode;
}

export function Dashboard({ children}: DashboardProps) {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Hourglass className="h-6 w-6" />
                        <span className="">Tempus</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        <Link
                        href="/"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                        </Link>
                        <Link
                            href="/goals"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/goals') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <CheckSquare className="h-4 w-4" />
                            Goals
                        </Link>
                        <Link
                            href="/habit"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/habit') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Calendar className="h-4 w-4" />
                            Habit
                        </Link>
                        <Link
                            href="/purpose"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/purpose') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <MapPin className="h-4 w-4" />
                            Purpose
                        </Link>
                        <Link
                            href="/schedule"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/schedule') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                        >
                            <Clock className="h-4 w-4" />
                            Schedule
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
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Home className="h-4 w-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/goals"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/goals') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <CheckSquare className="h-4 w-4" />
                        Goals
                    </Link>
                    <Link
                        href="/habit"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/habit') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Calendar className="h-4 w-4" />
                        Habit
                    </Link>
                    <Link
                        href="/purpose"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/purpose') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <MapPin className="h-4 w-4" />
                        Purpose
                    </Link>
                    <Link
                        href="/schedule"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive('/schedule') ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
                    >
                        <Clock className="h-4 w-4" />
                        Schedule
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
                    <DropdownMenuItem>Logout</DropdownMenuItem>
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
