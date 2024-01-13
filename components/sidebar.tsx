import Link from "next/link";
import React from "react";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import { DashboardIcon } from "./icons";

function Sidebar() {
  const sidebarLinks = [
    { label: "Dashboard", link: "/" },
    { label: "Core Pool", link: "/core-pool" },
    { label: "Isolated Pools", link: "/isolated-pools" },
    { label: "Vaults", link: "/vaults" },
    { label: "Swap", link: "/swap" },
    { label: "History", link: "/history" },
    { label: "Governance", link: "/governance" },
    { label: "XVS", link: "/xvs" },
    { label: "Convert VRT", link: "/convert-vrt" },
    { label: "VAI", link: "/vai" },
  ];

  return (
    <div className="hidden bg-[#1E2431] pt-7 md:flex md:flex-col md:items-center xl:w-56">
      <Link
        href="/"
        className="text-blue hover:underline mb-4 flex w-full gap-2 items-center justify-center py-2"
      >
        <Image src={Logo} alt="Jupiter" className="w-12 h-12" />
        <span className="text-4xl font-bold">Jupiter</span>
      </Link>
      <div className="flex-1 overflow-auto px-3 py-6 xl:w-full xl:px-0">
        {sidebarLinks.map((link) => (
          <Link
            href={link.link}
            key={link.label}
            className="flex items-center justify-center whitespace-nowrap px-6 py-4 hover:bg-lightGrey active:bg-lightGrey md:h-14 md:w-14 md:rounded-2xl md:p-0 xl:relative xl:h-auto xl:w-full xl:rounded-none xl:px-8 xl:py-4 xl:font-semibold text-blue md:bg-lightGrey md:text-offWhite xl:before:absolute xl:before:bottom-0 xl:before:left-0 xl:before:top-0 xl:before:w-1 xl:before:rounded-br-lg xl:before:rounded-tr-lg xl:before:bg-blue"
          >
            <DashboardIcon />
            <div className="flex grow items-center md:hidden xl:flex">
              <p className="overflow-hidden text-ellipsis text-offWhite xl:text-inherit">
                {link.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
