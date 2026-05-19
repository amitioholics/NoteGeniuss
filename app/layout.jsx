import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
export const metadata = {
    title: "NoteGenius",
    description: "AI-powered note-taking app for students",
    generator: 'v0.app'
};
export const viewport = {
    themeColor: "#0c0c1f",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <body className="font-sans antialiased bg-[#0c0c1f] text-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster richColors closeButton theme="dark" position="bottom-right"/>
        </ThemeProvider>
      </body>
    </html>);
}
