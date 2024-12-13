"use client";

import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui";
import { usePathname, useRouter } from "next/navigation";
import { i18nConfig } from "../../../../18nConfig";
import { useTranslation } from "@/hooks";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const router = useRouter();
  const currentPathname = usePathname();

  const handleLangChange = (newLocale: string) => {
    // redirect to the new locale path
    if (currentLocale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      router.replace("/" + newLocale + currentPathname);
    } else {
      router.replace(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));
    }

    router.refresh();
  };

  return (
    <Select name="lang" defaultValue={currentLocale} onValueChange={handleLangChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"en"}>English</SelectItem>
        <SelectItem value={"fr"}>French</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;
