import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  ClerkLoaded,
  ClerkLoading,

} from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { dark } from "@clerk/themes";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Clerk Auth V5",
  description: "This is app using mongodb and clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
      <html lang="en">
        <body className={`antialiased`}>
          <ClerkLoading>
            <header className="flex justify-center items-center h-screen text-2xl">
              Loading......
            </header>
          </ClerkLoading>
          <ClerkLoaded>
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col h-screen">
                <Navbar/>{children}</div>
            </div>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
