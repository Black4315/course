import type { Metadata } from "next";
import "./globals.css";
import Head from "next/head";
import { UserProvider } from "@/context/userContext";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";


const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  title: "Course Details",
  description: "Master SEO from the ground up with our ultimate crash course! Learn essential skills, uncover advanced strategies, and elevate your website to dominate search rankings like a pro.",
  openGraph: {
    title: "Course Details",
    description: "Master SEO from the ground up with our ultimate crash course! Learn essential skills, uncover advanced strategies, and elevate your website to dominate search rankings like a pro.",
    url: siteUrl,
    siteName: 'Course Platform',
    locale: 'en-US',
    images: [
      {
        url: siteUrl + '/assets/images/favicon.ico',
        width: 1200,
        height: 630
      }
    ],
    type: 'website',
    videos: [
      {
        url: `${siteUrl}/assets/videos/shahinVideo/360p.webm`,
        width: 1280,
        height: 720
      }
    ]
  },
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={siteUrl} />
        <meta name="apple-mobile-web-app-title" content="Course Platform" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body
        className={``} //antialiased
      >
        <ReactQueryProvider>
          <UserProvider>
            {children}
          </UserProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
