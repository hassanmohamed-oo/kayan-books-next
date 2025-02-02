import type { Metadata } from "next";
import "./globals.css";
import RootProvider from "./RootProvider";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const metadata: Metadata = {
  title: "كيان - التعليم الذكي للثانوية العامة",
  description:
    "احصل على أفضل الكتب التعليمية، الملخصات، والموارد الدراسية المخصصة لطلبة الثانوية العامة في مصر. منهج كامل مع شرح تفصيلي وأسئلة تدريبية.",
  keywords: [
    "ثانوية عامة",
    "منصة تعليمية",
    "مصر",
    "كتب دراسية",
    "شرح منهج",
    "نماذج امتحانات",
  ],
  authors: [{ name: "Kayan Team", url: "https://kayanbooks.vercel.app" }],
  metadataBase: new URL("https://kayanbooks.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "كيان - التعليم الذكي للثانوية العامة",
    description: "المنصة التعليمية الشاملة لطلبة الثانوية العامة في مصر",
    url: "https://kayanbooks.vercel.app/",
    siteName: "كيان",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ar_EG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "كيان - المنصة التعليمية الرائدة",
    description: "تفوق دراسي بكل سهولة مع منصة كيان التعليمية",
    images: ["/twitter-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1.0,
    maximumScale: 1.0,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="icon" href="/5fd358ad-a874-45d3-8b9b-9738d8b56095.ico" sizes="any" />
        
      </head>
      <RootProvider>
        <body className="">{children}</body>
      </RootProvider>
    </html>
  );
}
