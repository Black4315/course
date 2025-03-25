import type { Metadata } from "next";
import "./globals.css";


const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  title: "Course Details",
  description: "Master programing with our crash course. From foundational skills to advanced techniques — build, deploy, and elevate your apps like a pro!",
    openGraph:{
    title: "Course Details",
    description: "Master programing with our crash course. From foundational skills to advanced techniques — build, deploy, and elevate your apps like a pro!",
    url: siteUrl,
    siteName:'Course Platform',
    locale:'en-US',
    images:[
      {
        url: siteUrl+'/assets/images/favicon.ico',
        width: 1200,
        height: 630
      }
    ],
    type:'website',
    videos: [
      {
        url: `${siteUrl}/assets/videos/shahinVideo/360p.webm`,
        width: 1280,
        height: 720
      }
    ]

  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``} //antialiased
      >
        {children}
      </body>
    </html>
  );
}
