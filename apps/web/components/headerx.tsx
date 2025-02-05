"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import logo from "/public/aiportalxlogo.svg";
import { Separator } from "@/components/ui/separator";

// Set your header height here (you can adjust it as needed)
const HEADER_HEIGHT = "64px";

export const HeaderX = () => {
  // Set a CSS variable on the body for use in other components (e.g. Sidebar offset)
  useEffect(() => {
    document.body.style.setProperty("--header-height", HEADER_HEIGHT);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 flex w-full items-center justify-between bg-background px-4 py-2"
      style={{ height: HEADER_HEIGHT }}
    >
      <div className="flex items-center gap-2">
        {/* Removed SidebarTrigger from here */}
        <Separator orientation="vertical" className="mr-2 h-4" />
        {/* Logo */}
        <Image src={logo} alt="AI Portal X Logo" height={32} width={32} />
        <span className="text-lg font-bold">AI Portal X</span>
      </div>
      {/* You can add additional header content here if needed */}
    </header>
  );
};

export default HeaderX;
