"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { ChangeEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { Input } from "../ui";
import { debounce } from "lodash";
import { localStorageClient } from "@/clients/localstorage-client";

async function setCookie(value: string) {
  const response = await fetch("/api/save-cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: "APP_ID", value }),
  });

  if (response.ok) {
    console.log(await response.json());
    localStorageClient().setItem("APP_ID", value);
    window.location.reload();
    console.log("Cookie set successfully!");
  } else {
    console.error("Failed to set cookie.");
  }
}
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { appInfo } = useAuthContext();
  const lsClient = localStorageClient();

  const [appName, setAppName] = useState("");

  const handleChange = useMemo(
    () =>
      debounce((newValue: string) => {
        setCookie(newValue);
      }, 300),
    [],
  );
  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    lsClient.cleanStorage();
    setAppName(newValue);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-[35px] lg:px-[100px] flex h-14 items-center">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 flex-1">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={appInfo?.logo || "/Frame.svg"} alt="logo" width={70} height={70} />
            <span className="text-2xl font-bold text-primary-color font-secondary">{appInfo?.name || "FUNNEL"}</span>
          </Link>
        </div>

        {/* Links Section */}
        <nav className="hidden lg:flex items-center justify-center flex-1 space-x-6 text-sm font-medium">
          <Link href="/about" className="transition-colors font-secondary hover:text-foreground/80 text-foreground/60">
            About us
          </Link>
          <Link
            href="/services"
            className="transition-colors font-secondary hover:text-foreground/80 text-foreground/60"
          >
            Services
          </Link>
        </nav>

        {/* Buttons Section */}
        <div className="flex items-center justify-end gap-3 flex-1">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-0 text-base hover:bg-transparent focus:ring-0 lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <MobileNav />
            </SheetContent>
          </Sheet>
          <Input
            type="text"
            placeholder="Enter App Name"
            defaultValue={appName}
            className="w-36 m-2"
            onChange={onChange}
          />
          <Button
            className="bg-primary-color hidden lg:block hover:bg-primary-color text-background mb-0"
            onClick={() => {
              handleChange(appName);
            }}
          >
            Save App Name
          </Button>
          <Button className="bg-primary-color hidden lg:block hover:bg-primary-color text-background mb-0" asChild>
            <Link href="/contact">Talk To Us</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <div className="flex flex-col space-y-3">
      <Link href="/" className="text-2xl font-bold tracking-tight">
        FUNNEL
      </Link>
      <nav className="flex flex-col space-y-3">
        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
          About us
        </Link>
        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
          Services
        </Link>
        <Link href="/about" className="transition-colors hover:text-foreground/80 text-foreground/60">
          Talk to Us
        </Link>
      </nav>
    </div>
  );
}
