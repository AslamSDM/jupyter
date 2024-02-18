"use client";
import Link from "next/link";
import React from "react";
import Logo from "../assets/logo.svg";
import Image from "next/image";
import { DashboardIcon, SidebarIcons } from "./icons";
import { usePathname } from "next/navigation";

function Sidebar() {
  const pathname = usePathname();

  const sidebarLinks = [
    { label: "Dashboard", link: "/" },
    { label: "Account", link: "/account" },
    { label: "Core Pool", link: "/core-pool" },
    { label: "Isolated Pools", link: "/isolated-pools" },
    { label: "Vaults", link: "/vaults" },
    { label: "Swap", link: "/swap" },
    // { label: "Swap", link: "/swap" },
    // { label: "History", link: "/history" },
    // { label: "Governance", link: "/governance" },
    // { label: "XVS", link: "/xvs" },
    // { label: "Convert VRT", link: "/convert-vrt" },
    // { label: "VAI", link: "/vai" },
  ];

  return (
    <div className="hidden h-screen sticky top-0 bg-[#1E2431] pt-7 md:flex md:flex-col md:items-center xl:w-56">
      <Link
        href="/"
        className="text-blue hover:underline flex w-full gap-2 items-center justify-center py-2 text-white"
      >
        <Image src={Logo} alt="Jupiter" className="w-12 h-12" />
        <span className="text-4xl font-bold">Jupiter</span>
      </Link>
      <div className="flex-1 overflow-auto px-3 py-6 xl:w-full xl:px-0 text-[#AAB3CA]">
        {sidebarLinks.map((link) => (
          <Link
            href={link.link}
            key={link.label}
            className={`flex items-center justify-center whitespace-nowrap px-6 py-4 ${
              pathname === link.link
                ? "text-white border-l-3 border-blue-600 bg-gray-700"
                : "hover:bg-gray-700"
            }  `}
          >
            <SidebarIcons pathLink={link.link} />
            <div className="flex grow items-center md:hidden xl:flex">
              <p className="overflow-hidden text-ellipsis">{link.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
