import "@/styles/globals.css";
import "@/ikon/styles/globals.css";
import "@progress/kendo-theme-default/dist/all.css";
import "@/ikon/styles/ikon-custom.css";
import type { Metadata } from "next";
import { Oswald, Outfit, Poppins } from "next/font/google";
import { getThemeData } from "@/ikon/utils/actions/theme";
import { generateTheme } from "@/ikon/utils/actions/theme/generator";
import { Toaster } from "@/shadcn/ui/sonner";
import MainLayout from "@/ikon/components/main-layout";
import { RenderAppBreadcrumb } from "@/ikon/components/app-breadcrumb";
import { ThemeProvider } from "@/ikon/components/theme-provider";
import { DialogProvider } from "@/ikon/components/alert-dialog/dialog-context";

export const dynamic = "force-dynamic";

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const outfit = Outfit({
  weight: "400",
  subsets: ["latin"],
});

const oswald = Oswald({
  weight: "400",
  subsets: ["latin"],
});

const fontNameWiseClassName: { [key: string]: string } = {
  Poppins: poppins.className,
  Outfit: outfit.className,
  Oswald: oswald.className,
};

export const metadata: Metadata = {
  title: "IKON - Keross",
  description: "IKON - Keross",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeData = await getThemeData();
  const themeMode = themeData.mode;

  const fontClass = fontNameWiseClassName[themeData.font];
  const themeCssVariables = generateTheme(themeData);

  return (
    <>
      <html lang="en" className={themeMode}>
        <body className={`${fontClass} antialiased`} suppressHydrationWarning>
          <style id="ikonThemeCSS">{themeCssVariables}</style>
          
          <ThemeProvider
            themeData={themeData}
            fontNameWiseClassName={fontNameWiseClassName}
          >
            <DialogProvider>
              <MainLayout>
                <RenderAppBreadcrumb
                  breadcrumb={{
                    level: 0,
                    title: "Home",
                    href: "/",
                  }}
                />
                {children}
              </MainLayout>
            </DialogProvider>
            <Toaster
              richColors
              closeButton
              visibleToasts={5}
              duration={50000}
            />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
