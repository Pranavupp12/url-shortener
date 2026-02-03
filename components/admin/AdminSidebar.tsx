"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, BarChart2, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  children: React.ReactNode;
  userRole: 'ADMIN' | 'EMPLOYEE'; // Receive role as prop
  username: string;
}

export function AdminSidebar({ children, userRole, username }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Call the API to delete the cookie
    await fetch("/api/logout", { method: "POST" });
    
    // 2. FORCE a hard refresh to the login page
    // (Do not use router.push here)
    window.location.href = "/admin/login";
  };


  // 1. Define all links
  const allLinks = [
    {
      label: "Overview",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      roles: ['ADMIN'], // Only Admin sees this
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      roles: ['ADMIN'], // Only Admin sees this
    },
    {
      label: "Blog Posts",
      href: "/admin/blog",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      roles: ['ADMIN', 'EMPLOYEE'], // Both see this
    },
  ];

  // 2. Filter links based on the current user's role
  const visibleLinks = allLinks.filter(link => link.roles.includes(userRole));

  return (
    <div className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              
              {/* Render Filtered Links */}
              {visibleLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
              
              <button onClick={handleLogout} className="text-left w-full">
                <SidebarLink
                  link={{
                    label: "Logout",
                    href: "#",
                    icon: <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
                  }}
                />
              </button>
            </div>
          </div>
          
          <div>
            <SidebarLink
              link={{
                label: username || "User",
                href: "#",
                icon: (
                  <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {username?.[0]?.toUpperCase() || "U"}
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 overflow-y-auto bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-700">
          {children}
      </div>
    </div>
  );
}

// ... Keep your Logo and LogoIcon components here as they were ...
export const Logo = () => {
  return (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-medium text-black dark:text-white whitespace-pre">
        MinifyLinks {process.env.NODE_ENV === 'development' ? 'Dev' : ''}
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <div className="h-5 w-6 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};