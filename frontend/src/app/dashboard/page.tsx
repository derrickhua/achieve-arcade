import Image from "next/image";
import { DashboardLayout } from "../../../components/layout/Dashboard";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Achieve Arcade',
  description:
    'game your productivity',
  icons: {
      icon: '/icons/logo.png',
  },
};

export default function Home() {
  return (
      <DashboardLayout />
  );
}
