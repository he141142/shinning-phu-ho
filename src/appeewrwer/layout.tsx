
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { AuthProvider } from "@/context/app.context";
import Laylout from "@/components/layouts";
import MaterialLayout from "./material_layout";
import { Paginationprovider } from "@/providers/pagination_provider";
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
              <Paginationprovider page={1} perPage={10}>
                <Laylout>
                  {children}
                </Laylout>
              </Paginationprovider>
            </MaterialLayout>
          </div>
        </AuthProvider>
      </AppRouterCacheProvider>
    </div>
  );
}
