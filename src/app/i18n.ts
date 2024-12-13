import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { i18nConfig } from "../../18nConfig";
import { getAppInfo } from "./api/auth/app-info/helpers";
import { localStorageClient } from "@/clients/localstorage-client";
import { ENV } from "@/constants/ENV";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function initTranslations(
  locale: string,
  namespaces: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18nInstance?: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources?: any,
) {
  i18nInstance = i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  if (!resources) {
    i18nInstance.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resourcesToBackend(async (language: any, namespace: any) => {
        let appLocaleResource = await import(`@/locales/${language}/${namespace}.json`);
        try {
          const appId = localStorageClient().getItem("USER_INFO")?.app_id || ENV.TEST_APP_ID || "";
          const clientLocale = await getAppInfo({ appId });

          if (clientLocale?.localization) {
            appLocaleResource = clientLocale.localization[language]?.[namespace];
          }
        } catch (_err) {}

        return appLocaleResource;
      }),
    );
  }

  await i18nInstance.init({
    lng: locale,
    resources,
    fallbackLng: i18nConfig.defaultLocale,
    supportedLngs: i18nConfig.locales,
    defaultNS: namespaces[0],
    fallbackNS: namespaces[0],
    ns: namespaces,
    preload: resources ? [] : i18nConfig.locales,
  });

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.t,
  };
}
