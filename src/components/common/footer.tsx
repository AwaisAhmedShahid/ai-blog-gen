"use client";
import siteData from "@/config/blog.config";
import { useAuthContext } from "@/context/AuthContext";
import Image from "next/image";

const Footer = () => {
  const {
    footer: { isShow },
  } = siteData;
  const { appInfo } = useAuthContext();
  return (
    isShow && (
      <footer
        className={" px-[35px] lg:px-[100px]  py-[30px] lg:py-[60px] min-h-64 bg-primary-color gap-5 flex flex-col"}
      >
        <div className="  flex flex-col lg:flex-row justify-between ">
          <div className="flex items-center space-x-2 mb-8 lg:mb-0">
            <Image src={appInfo?.logo || "/Frame.svg"} alt="logo" width={32} height={32} />
            <span className="font-bold text-lg text-white font-secondary">{appInfo?.name || "FUNNEL"}</span>
          </div>

          <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row  lg:space-x-8">
            <a href="#" className="text-white font-secondary">
              About us
            </a>
            <a href="#" className="text-white font-secondary">
              Services
            </a>
            <a href="#" className="text-white font-secondary">
              Talk to us
            </a>
          </div>
        </div>
        <div className=" text-start mt-6  flex flex-col gap-3">
          <p className="text-sm text-white font-secondary">© Copyrights 2024, AI Lab</p>
          <p className="text-sm text-white font-secondary">All rights reserved</p>
        </div>
      </footer>
    )
  );
};

export default Footer;
