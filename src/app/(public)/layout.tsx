import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "@/shadcn/ui/sonner";
import "@/ikon/styles/globals.css";
import "@/ikon/styles/public.css";
import { ThemeProvider } from "@/ikon/components/theme-provider";
import { defaultAccountTheme, defaultUserTheme } from "@/ikon/utils/actions/theme/type";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IKON - Keross",
  description: "IKON - Keross",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeData = { ...defaultAccountTheme, ...defaultUserTheme }
  return (
    <html lang="en" className={themeData.mode}>
      <body className={`${poppins.className}  antialiased`}>
        <ThemeProvider themeData={themeData} fontNameWiseClassName={{}}>
          {children}
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
