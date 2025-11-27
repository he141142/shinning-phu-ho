
"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/app.context";
import Laylout from "@/components/layouts";
import MaterialLayout from "./material_layout";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthProvider>
        <div className={inter.className}>
          <MaterialLayout>
            <Laylout>
              {children}
            </Laylout>
          </MaterialLayout>
        </div>
      </AuthProvider>
    </div>
  );
}
