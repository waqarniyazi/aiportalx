"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils";

const navigation = [
  { name: "Features", href: "/#features" },
  { name: "FAQ", href: "/#faq" },
  { name: "AI Models", href: "/models", target: "_blank" as const },
  { name: "Contribute", href: "/contribute", target: "_blank" as const },
  { name: "Blogs", href: "/blogs" },
];

export function Header({ className }: { className?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scroll, setScroll] = useState(false); // Track if user has scrolled
  const [lastScrollY, setLastScrollY] = useState(0); // Track last scroll position

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 20) {
      setIsVisible(false); // Hide header on scroll down
    } else if (currentScrollY < lastScrollY) {
      setIsVisible(true); // Show header on scroll up
    }

    setScroll(currentScrollY > 0); // Set scroll state based on position
    setLastScrollY(currentScrollY); // Update last scroll position
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header
      className={cn(
        "sticky top-0 left-0 z-50 transition-transform duration-300",
        className,
        isVisible ? "translate-y-0" : "-translate-y-full", // Show or hide header
        scroll
          ? "bg-white bg-opacity-70 backdrop-blur-lg shadow-md" // Add shadow when scrolling
          : "bg-transparent" // No shadow at the top
      )}
    >
      <nav
        className="flex items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">AIPortalX</span>
            <Logo className="h-4 w-auto" />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
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
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden gap-2 lg:flex lg:flex-1 lg:justify-end">
          <Button size="sm" variant="outline" className="rounded-full" asChild>
            <Link href="/models" onClick={() => setMobileMenuOpen(false)}>
              Explore AI
            </Link>
          </Button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">AIPortalX</span>
              <Logo className="h-4 w-auto" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
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
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
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
