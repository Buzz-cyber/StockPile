import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { LayoutDashboard, Package, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Stockpile Pro',
  description: 'Modern inventory management made simple.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <SidebarProvider>
          <Sidebar className="glass-card border-r-0 floating-elements">
            <SidebarContent className="bg-transparent">
              <SidebarHeader>
                <div className="flex items-center gap-4 p-6">
                  <div className="relative p-3 bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-2xl shadow-xl shadow-emerald-500/30">
                    <Sparkles className="h-7 w-7 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black gradient-text tracking-tight">FreshStock</h2>
                    <p className="text-sm text-emerald-600 font-bold tracking-wide">GROCERY PRO</p>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarMenu className="px-6 space-y-3">
                <SidebarMenuItem>
                  <Link href="/" passHref>
                    <SidebarMenuButton tooltip="Dashboard" className="rounded-2xl py-4 px-4 hover:bg-gradient-to-r hover:from-emerald-100 hover:via-green-100 hover:to-teal-100 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-500 group">
                      <LayoutDashboard className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-bold text-gray-700 group-hover:text-emerald-700">Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/products" passHref>
                    <SidebarMenuButton tooltip="Products" className="rounded-2xl py-4 px-4 hover:bg-gradient-to-r hover:from-emerald-100 hover:via-green-100 hover:to-teal-100 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-500 group">
                      <Package className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-bold text-gray-700 group-hover:text-emerald-700">Grocery Items</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="p-6 border-b border-emerald-200/30 md:hidden backdrop-blur-sm">
              <SidebarTrigger className="hover:bg-emerald-100/50 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300" />
            </header>
            <main className="p-8 floating-elements">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
