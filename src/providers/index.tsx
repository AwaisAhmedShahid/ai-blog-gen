import React from "react";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import TranslationsProvider from "./TranslationsProvider";
import initTranslations from "@/app/i18n";
import TanStackProvider from "./tanstack-provider";
// import { getAppInfo } from "@/server-actions";

const Providers: React.FC<{
  children: React.ReactNode;
  locale: string;
  defaultTheme: string;
}> = async ({ children, locale, defaultTheme = "light" }) => {
  // todo: pass AppId instead of default for dynamic db loading of localization json
  const { resources } = await initTranslations(locale, ["default"]);
  // const appInfo = await getAppInfo();

  return (
    <TanStackProvider>
      <TranslationsProvider namespaces={["default"]} locale={locale} resources={resources}>
        <ThemeProvider attribute="class" defaultTheme={defaultTheme} enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </TranslationsProvider>
    </TanStackProvider>
  );
};

export default Providers;
