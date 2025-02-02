import type { Metadata } from "next";
import "./globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import RootProvider from "./RootProvider";

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>;
<meta name="description" content="منصة تعليمية للثانوية العامة المصرية"></meta>;
<meta name="icon" content="/5fd358ad-a874-45d3-8b9b-9738d8b56095.png"></meta>;
<meta name="author" content="Kayan Team"></meta>;
<meta property="og:title" content="كيان" />



export const metadata: Metadata = {
  title: "كيان",
  description: "كتب كيان للثانوية العامة",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <RootProvider>
        <body>{children}</body>
      </RootProvider>
    </html>
  );
}
