"use client";

import { I18nextProvider } from "react-i18next";
import initTranslations from "@/app/i18n";
import { createInstance } from "i18next";

import React from "react";

type PropTypes = {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any;
};

const TranslationsProvider: React.FC<PropTypes> = ({ children, locale, namespaces, resources }) => {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
