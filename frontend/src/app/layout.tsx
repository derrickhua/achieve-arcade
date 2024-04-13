'use client';
import { useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Corrected from 'next/navigation'
import Head from 'next/head';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <SessionProvider>
      <ComponentWithSession router={router} children={children} />
    </SessionProvider>
  );
}

function ComponentWithSession({ router, children }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') {
      return; // Loading state, do nothing
    }
    if (status === 'unauthenticated') {
      // If there's no session, redirect to the sign in page
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      // If there's a session, redirect to the dashboard
      router.push('/auth/signin');
    }
  }, [status]);

  return (
    <html lang='en'>
        <Head>
          <title>Tempus</title>
        </Head>
        <body className={`${inter.className}`}>
          {children}
        </body>
    </html>
  );
}
