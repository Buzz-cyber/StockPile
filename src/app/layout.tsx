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
          <Sidebar className="glass-card border-r-0">
            <SidebarContent className="bg-transparent">
              <SidebarHeader>
                <div className="flex items-center gap-3 p-4">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold gradient-text">Stockpile</h2>
                    <p className="text-xs text-gray-500 font-medium">Pro</p>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarMenu className="px-4 space-y-2">
                <SidebarMenuItem>
                  <Link href="/" passHref>
                    <SidebarMenuButton tooltip="Dashboard" className="rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all duration-300">
                      <LayoutDashboard className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/products" passHref>
                    <SidebarMenuButton tooltip="Products" className="rounded-xl hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 transition-all duration-300">
                      <Package className="h-5 w-5" />
                      <span className="font-medium">Products</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="p-6 border-b border-white/20 md:hidden backdrop-blur-sm">
              <SidebarTrigger className="hover:bg-white/10 rounded-xl" />
            </header>
            <main className="p-8">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
