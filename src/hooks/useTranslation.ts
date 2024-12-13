"use client";

import { LOCAL_KEYS } from "@/types";
import { useTranslation as I18NextUseTranslation } from "react-i18next";

const useTranslation = () => {
  const { t, ...rest } = I18NextUseTranslation();

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: (key: LOCAL_KEYS, options?: Parameters<typeof t>[1]) => t(key, options as any),
    ...rest,
  };
};

export default useTranslation;
