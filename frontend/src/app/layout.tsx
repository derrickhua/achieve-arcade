'use client';
import { useEffect } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import LoadingScreen from '../components/pages/LoadingScreen';
import './globals.css';
import PlausibleProvider from 'next-plausible';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="canonical" href="https://www.achievearcade.com/" />
      </Head>
      <head>
        <PlausibleProvider domain="" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Achieve Arcade",
            "url": "https://www.achievearcade.com",
            "logo": "https://www.achievearcade.com/icons/logo.png",
            "sameAs": [
              "https://x.com/DerrickHua_",
            ]
          })
        }} />
      </head>
      <body>
        <SessionProvider>
          <ErrorBoundary>
            <ComponentWithSession>{children}</ComponentWithSession>
          </ErrorBoundary>
        </SessionProvider>
      </body>
    </html>
  );
}

function ComponentWithSession({ children }) {
  const { status } = useSession();

  useEffect(() => {
    if (typeof window !== 'undefined' && screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('portrait').catch((err) => {
        console.error("Screen orientation lock failed:", err);
      });
    } else {
      console.warn("Screen orientation lock is not available on this device.");
    }
  }, []);

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
