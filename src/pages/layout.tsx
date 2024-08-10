
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { AuthProvider } from "@/context/app.context";
import Laylout from "@/components/layouts";
import MaterialLayout from "./material_layout";
// or `v1X-appRouter` if you are using Next.js v1X
const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AppRouterCacheProvider>
        <AuthProvider >
          <div className={inter.className}>
            <MaterialLayout>
              <Laylout>
                {children}
              </Laylout>
            </MaterialLayout>
          </div>
        </AuthProvider>

      </AppRouterCacheProvider>

    </div>
  );
}
