'use client'
import { useSession, SessionProvider } from "next-auth/react";
import "./globals.css";
import LoadingScreen from "@/components/pages/LoadingScreen";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
