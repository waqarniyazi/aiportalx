import Image from "next/image";
import Link from "next/link";
import logo from "/public/aiportalxlogo.svg";
import { GlobalSearch } from "@/components/GlobalSearch";
import { ModeToggle } from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";

export function HeaderX() {
  return (
    <header className="fixed inset-x-0 z-20 flex h-[--header-height] items-center justify-between bg-background px-4 shadow-md">
      <div className="flex lg:flex-1">
        <Link href="/" className="mr-1 p-1.5">
          <span className="sr-only">AiPortalX</span>
          <img
            src="/aiportalxlogo.svg"
            alt="AIPortalX Logo"
            className="h-6 w-auto"
          />
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <GlobalSearch />
        <ModeToggle />
        <Link href="/sign-in">
          <Button variant="outline" className="h-8 px-4">
            Log in
          </Button>
        </Link>
      </div>
    </header>
  );
}
