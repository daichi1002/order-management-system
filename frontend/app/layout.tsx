import { ApolloClient, InMemoryCache } from "@apollo/client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/layout/Header";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "@/components/ui/toaster";

const client = new ApolloClient({
  uri: "YOUR_GRAPHQL_ENDPOINT",
  cache: new InMemoryCache(),
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "注文管理システム",
  description: "飲食店専用の注文管理システムです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
