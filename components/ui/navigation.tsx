"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { clientLogger } from "../../lib/logger/client";
import { cn } from "../../lib/utils";

interface NavItemProps {
  href: string;
  children: React.ReactNode;
}

export function NavigationRoot({ children }: { children: React.ReactNode }) {
  clientLogger.debug("Rendering Navigation.Root");
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">{children}</div>
        </div>
      </div>
    </nav>
  );
}

export function NavigationItem({ href, children }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  clientLogger.debug("Rendering Navigation.Item", { href, isActive });

  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium",
        isActive
          ? "border-blue-500 text-gray-900"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
      )}
    >
      {children}
    </Link>
  );
}

export function NavigationBrand({ children }: { children: React.ReactNode }) {
  clientLogger.debug("Rendering Navigation.Brand");
  return (
    <div className="flex-shrink-0 flex items-center">
      <span className="text-xl font-bold text-gray-900">{children}</span>
    </div>
  );
}
