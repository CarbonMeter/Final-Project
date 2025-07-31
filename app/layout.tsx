import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import FloatingActionButton from "@/components/ui/floating-action-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CarbonMeter - Track Your Carbon Footprint",
  description:
    "Calculate, track, and reduce your carbon footprint with AI-powered insights and personalized recommendations.",
  keywords: ["carbon footprint", "sustainability", "climate change", "environmental impact", "green living"],
  authors: [{ name: "CarbonMeter Team" }],
  openGraph: {
    title: "CarbonMeter - Track Your Carbon Footprint",
    description:
      "Calculate, track, and reduce your carbon footprint with AI-powered insights and personalized recommendations.",
    type: "website",
    url: "https://carbonmeter.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonMeter - Track Your Carbon Footprint",
    description:
      "Calculate, track, and reduce your carbon footprint with AI-powered insights and personalized recommendations.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingActionButton />
          </div>
        </Providers>
      </body>
    </html>
  )
}
