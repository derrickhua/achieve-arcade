import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Achieve Arcade",
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;
