import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/providers";
import { dir } from "i18next";
import { i18nConfig } from "../../../18nConfig";
import { calculateTheme } from "@/utils/tailwind-utils";
import { getAppInfo } from "@/server-actions";

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const appInfo = await getAppInfo();

  if (!appInfo) {
    return {
      title: "AI Blogs App",
      description: "AI Blogs App",
    };
  }

  return {
    title: appInfo.name,
    description: appInfo.description,
  };
}

export const tempTheme = {
  light: {
    primaryColor: "#080707",
    backgroundColor: "#fcfcfc",
  },
  dark: {
    primaryColor: "#fcfcfc",
    backgroundColor: "#080707",
  },
  appearance: "light",
  primaryFont: "Montserrat",
  secondaryFont: "Outfit",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const appInfo = await getAppInfo();
  const newTheme = calculateTheme({
    clientTheme: {
      dark: appInfo?.theme?.dark
        ? {
            accentColor: appInfo.theme.dark.primaryColor,
            backgroundColor: appInfo.theme.dark.backgroundColor,
          }
        : {
            accentColor: tempTheme.dark.primaryColor,
            backgroundColor: tempTheme.dark.backgroundColor,
          },
      light: appInfo?.theme?.light
        ? {
            accentColor: appInfo.theme.light.primaryColor,
            backgroundColor: appInfo.theme.light.backgroundColor,
          }
        : {
            accentColor: tempTheme.light.primaryColor,
            backgroundColor: tempTheme.light.backgroundColor,
          },
    },
  });

  // light
  let lightStr = "";
  for (const [key, value] of Object.entries(newTheme.light)) {
    lightStr += `${key}:${value} !important;`;
  }

  // dark
  let darkStr = "";
  for (const [key, value] of Object.entries(newTheme.dark)) {
    darkStr += `${key}:${value} !important;`;
  }

  // fonts
  const fontsRes = await fetch(
    `https://fonts.googleapis.com/css2?family=${appInfo?.theme?.headerFont || tempTheme.primaryFont}&family=${appInfo?.theme?.bodyFont || tempTheme.secondaryFont}&display=swap&_=${Date.now()}`,
  );

  const fonts = await fontsRes.text();

  // Set default color mode based on user preference
  const defaultAppearance = appInfo?.theme?.appearance || tempTheme.appearance;
  // useEffect(() => {
  //   document.documentElement.style.setProperty("--primary-color", newTheme[defaultAppearance]["--primary-color"]);
  //   document.documentElement.style.setProperty("--background-color", newTheme[defaultAppearance]["--background"]);
  //   if (defaultAppearance === "dark") {
  //     document.documentElement.classList.add("dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //   }
  // }, [newTheme, defaultAppearance]);
  return (
    <html lang={params.locale} dir={dir(params.locale)}>
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                color-scheme: light;
                ${lightStr}
              }
              .dark {
                color-scheme: dark;
                ${darkStr}
              }
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `     
              @layer base {
                ${fonts}
                
                :root {
                  color-scheme: light;

                  --font-primary: ${appInfo?.theme?.headerFont || tempTheme.primaryFont};
                  --font-secondary: ${appInfo?.theme?.bodyFont || tempTheme.secondaryFont};
                
                  ${lightStr}
                }

                .dark {
                  color-scheme: dark;

                  --font-primary: ${appInfo?.theme?.headerFont || tempTheme.primaryFont};
                  --font-secondary: ${appInfo?.theme?.bodyFont || tempTheme.secondaryFont};

                  ${darkStr}
                }
              }
              /* Smooth transition for background and color changes */
              body {
                transition: background-color 0.3s ease, color 0.3s ease;
              }
            `,
          }}
        />
      </head>
      <body>
        <Providers defaultTheme={defaultAppearance} locale={params.locale}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
export const revalidate = 1; // Revalidate every 60 seconds
