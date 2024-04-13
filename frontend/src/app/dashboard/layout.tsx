import React from 'react';
import { Dashboard } from '@/components/layout/DashboardLayout';

interface LayoutProps {
    children: React.ReactNode;
  }
  
  const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
      <Dashboard>
        {children}
      </Dashboard>
    );
  };
  
  export default Layout;