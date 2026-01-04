"use client";

import { Button } from "@/components/ui/button";
import { CommandMenu } from "@/components/command-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";

const prosesItems = [
  {
    title: "Proses 1",
    href: "/proses-1",
    description: "Confusion Matrix",
    icon: "📊",
  },
  {
    title: "Proses 2",
    href: "/proses-2",
    description: "K-Fold Cross Validation",
    icon: "🔄",
  },
  {
    title: "Proses 3",
    href: "/proses-3",
    description: "Epoch + Early Stopping",
    icon: "⏱️",
  },
  {
    title: "Proses 4",
    href: "/proses-4",
    description: "Batch Size",
    icon: "📦",
  },
  {
    title: "Proses 5",
    href: "/proses-5",
    description: "Optimizer",
    icon: "⚡",
  },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/30 backdrop-blur-xxl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left Side - Logo & Navigation */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo-vokasi.png"
                alt="Logo Vokasi UNESA"
                width={100}
                height={100}
                className="drop-shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="font-semibold text-white text-sm">
                Deteksi Website Legal & Ilegal
              </span>
            </Link>

            {/* Navigation Menu */}
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList className="gap-1">

                {/* Fitur Pengujian */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground text-sm h-9">
                    Fitur Pengujian
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {prosesItems.map((item) => (
                        <ListItem
                          key={item.title}
                          title={item.title}
                          href={item.href}
                          icon={item.icon}
                        >
                          {item.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Dataset */}
                <NavigationMenuItem>
                  <Link href="/dataset-model" passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-accent hover:text-accent-foreground text-sm h-9"
                      )}
                    >
                      Dataset Model
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {/* API Docs */}
                <NavigationMenuItem>
                  <a
                    href="http://localhost:5002/apidocs/#/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "bg-transparent hover:bg-accent hover:text-accent-foreground text-sm h-9"
                      )}
                    >
                      API Docs
                    </NavigationMenuLink>
                  </a>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side - Search */}
          <div className="flex items-center gap-2">
            {/* Command Menu (Search) */}
            <CommandMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

// ListItem Component - Using shadcn default styling
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & {
    title: string;
    icon?: string;
  }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <div className="text-sm font-medium leading-none">{title}</div>
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
