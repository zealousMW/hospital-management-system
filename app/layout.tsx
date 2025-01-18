
import { Plus_Jakarta_Sans } from 'next/font/google'
import "./globals.css";
import { cn } from "@/utils/utils"
import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/toaster"


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Patient Management System",
  description: "A patient management system built with Supabase.",
};

const fontsans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight:['200','300','400','500','600'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen font-sans antialiased',fontsans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          
          >
          {children}
          <Toaster />

          </ThemeProvider>
          <Toaster />
         
      </body>
    </html>
  );
}
