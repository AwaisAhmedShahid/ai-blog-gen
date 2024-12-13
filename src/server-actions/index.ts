import { cookieClient } from "@/clients/cookie-client";
import { headers } from "next/headers";
import { getAppInfo as _getAppInfo } from "../app/api/auth/app-info/helpers";
import { ENV } from "@/constants/ENV";

export const getAppId = () => {
  if (ENV.TEST_APP_ID) {
    return ENV.TEST_APP_ID;
  }

  const headersList = headers();
  const host = headersList.get("x-forwarded-host")?.split(".")?.[0];

  if (!host || host.includes("localhost")) {
    return cookieClient().getItem("APP_ID");
  }

  return host;
};

export const getAppInfo = async () => {
  try {
    const appId = getAppId();
    const appInfo = await _getAppInfo({ appId });

    return appInfo;
  } catch (error) {
    console.log("Error fetching app info", error);
  }
};
