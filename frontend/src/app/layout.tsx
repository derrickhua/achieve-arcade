'use client';
import { useSession, SessionProvider } from "next-auth/react";
import Head from "next/head";
import "./globals.css";
import LoadingScreen from "@/components/pages/LoadingScreen";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <title>Achieve Arcade</title>
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
  const { status } = useSession();

  if (status === "loading") {
    return <LoadingScreen />; // Display a loading state
  }

  return (
    <>
      {children}
    </>
  );
}
