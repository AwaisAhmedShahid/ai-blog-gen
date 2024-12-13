"use client";
import { getAppInfoProfilerResType } from "@/app/api/auth/app-info/validators";
import { postLoginReqType, postLoginResType } from "@/app/api/auth/login/validators";
import { postRegisterProfilerResType, postRegisterReqType } from "@/app/api/auth/register/validators";
import { localStorageClient } from "@/clients/localstorage-client";
import { PAGE_ROUTES } from "@/constants/API_ROUTES";
import { apiRouter } from "@/utils/api-router";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<{
  isLoggedIn: boolean;
  userInfo?: postLoginResType["data"]["result"] | postRegisterProfilerResType["data"]["result"];
  appInfo?: getAppInfoProfilerResType["data"]["result"];
  login: (payload: postLoginReqType) => Promise<boolean>;
  register: (payload: postRegisterReqType) => Promise<boolean>;
  logout: VoidFunction;
}>({
  isLoggedIn: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Auth provider component
const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const lsClient = localStorageClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<
    postLoginResType["data"]["result"] | postRegisterProfilerResType["data"]["result"]
  >();
  const [appInfo, setAppInfo] = useState<getAppInfoProfilerResType["data"]["result"]>();

  const login = async (payload: postLoginReqType) => {
    // express login
    const response = await apiRouter(
      "LOGIN",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      {
        skipAuthorization: true,
      },
    );

    if (!response.ok) {
      return false;
    }

    const responsePayload = await response.json();
    if (!responsePayload.success) {
      return false;
    }

    setIsLoggedIn(true);
    setUserInfo(responsePayload.data.result);

    lsClient.setItem("IS_LOGGED_IN", true);
    lsClient.setItem("USER_INFO", responsePayload.data.result);

    return true;
  };

  const register = async (payload: postRegisterReqType) => {
    // express login
    const response = await apiRouter(
      "REGISTER",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      {
        skipAuthorization: true,
      },
    );

    if (!response.ok) {
      return false;
    }

    const responsePayload = await response.json();
    if (!responsePayload.success) {
      return false;
    }

    setIsLoggedIn(true);
    setUserInfo(responsePayload.data.result);

    lsClient.setItem("IS_LOGGED_IN", true);
    lsClient.setItem("USER_INFO", responsePayload.data.result);

    return true;
  };

  const logout = async (skipRedirect = true) => {
    const loggedOut = await apiRouter("LOGOUT", { method: "POST" });

    if (!loggedOut.ok) {
      return;
    }

    if (!(await loggedOut.json()).success) {
      return;
    }

    lsClient.cleanStorage();
    setIsLoggedIn(false);
    setUserInfo(undefined);

    if (skipRedirect) {
      router.replace(PAGE_ROUTES.BLOGS);
    }
  };

  const getAppInfo = async () => {
    const response = await apiRouter("GET_APP_INFO", { method: "GET" });

    if (!response.ok) {
      return;
    }

    const responsePayload = await response.json();
    if (!responsePayload.success) {
      return;
    }

    return responsePayload.data.result;
  };

  // restore state from local storage
  useEffect(() => {
    const userInfo = lsClient.getItem("USER_INFO");
    const isLoggedIn = lsClient.getItem("IS_LOGGED_IN");
    const appInfo = lsClient.getItem("APP_INFO");

    if (!appInfo) {
      (async () => {
        const appInfo = await getAppInfo();

        setAppInfo(appInfo);
        lsClient.setItem("APP_INFO", appInfo);
      })();
    } else {
      setAppInfo(appInfo);
    }

    if (isLoggedIn && !userInfo) {
      logout(false);
      setIsLoggedIn(false);
      setUserInfo(undefined);
      return;
    }

    if (userInfo) {
      setIsLoggedIn(true);
      setUserInfo(userInfo);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, register, logout, userInfo, appInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within a FirebaseProvider");
  }

  return context;
};

export { useAuthContext, AuthProvider };
