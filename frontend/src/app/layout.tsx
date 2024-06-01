'use client'
import { useEffect, useState } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>Tempus</title>
      </Head>
      <body>
        <SessionProvider>
          <ComponentWithSession>
            {children}
          </ComponentWithSession>
        </SessionProvider>
      </body>
    </html>
  );
}

function ComponentWithSession({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return; // Skip router logic if component is not mounted
    }
    if (status === "unauthenticated") {
      // If there's no session, redirect to the sign-in page
      router.replace("/auth/signin");
    } else if (status === "authenticated") {
      // If there's a session, redirect to the dashboard
      router.replace("/dashboard");
    }
  }, [status, router, mounted]);

  if (status === "loading") {
    return <p>Loading...</p>; // Display a loading state
  }

  return (
    <>
      {children}
    </>
  );
}
