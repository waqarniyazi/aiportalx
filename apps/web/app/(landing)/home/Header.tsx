"use client";

import { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { MenuIcon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { ModeToggle } from "@/components/DarkModeToggle";

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "FAQ", href: "/#faq" },
  { name: "Deployment", href: "/deployment", target: "_blank" as const },
  { name: "Refining", href: "/refining", target: "_blank" as const },
  { name: "Models", href: "/models" },
];

export function Header({ className }: { className?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const posthog = usePostHog();

  return (
    <header className={cn("absolute inset-x-0 top-0 z-50 py-2", className)}>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">AiPortalX</span>
            <img
              src="/aiportalxlogo.svg"
              alt="AIPortalX Logo"
              className="h-6 w-auto"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <ModeToggle />
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.target}
              prefetch={item.target !== "_blank"}
              className="text-sm font-semibold leading-6"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden gap-2 lg:flex lg:flex-1 lg:justify-end">
          <ModeToggle />
          <Button size="sm" variant="outline" className="rounded-full" asChild>
            <Link
              href="/sign-in"
              onClick={() => {
                posthog.capture("Clicked Log In", { position: "top-nav" });
                setMobileMenuOpen(false);
              }}
            >
              Log in
            </Link>
          </Button>
          <Button
            size="sm"
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 py-2 text-white transition-all hover:from-blue-600 hover:to-blue-800"
            asChild
          >
            <Link
              href="/models"
              onClick={() => {
                posthog.capture("Clicked Sign Up", { position: "top-nav" });
                setMobileMenuOpen(false);
              }}
            >
              Take a leep
            </Link>
          </Button>

          {/* <Link
            href="/login"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link> */}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">AiPortalX</span>
              <img
                src="/aiportalxlogo.svg"
                alt="AIPortalX Logo"
                className="h-4 w-auto"
              />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50"
                  onClick={() => {
                    posthog.capture("Clicked Log In", { position: "top-nav" });
                    setMobileMenuOpen(false);
                  }}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
