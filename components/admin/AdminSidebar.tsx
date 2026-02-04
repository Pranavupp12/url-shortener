"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, BarChart2, FileText, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AdminSidebarProps {
  children: React.ReactNode;
  userRole: 'ADMIN' | 'EMPLOYEE'; 
  username: string;
}

export function AdminSidebar({ children, userRole, username }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  const allLinks = [
    {
      label: "Overview",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      roles: ['ADMIN'], 
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      roles: ['ADMIN'], 
    },
    {
      label: "Blog Posts",
      href: "/admin/blog",
      icon: <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      roles: ['ADMIN', 'EMPLOYEE'], 
    },
  ];

  const visibleLinks = allLinks.filter(link => link.roles.includes(userRole));

  return (
    <div className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {/* 1. PASS THE ROLE PROP HERE */}
            {open ? <Logo role={userRole} /> : <LogoIcon />}
            
            <div className="mt-8 flex flex-col gap-2">
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

// 2. UPDATE LOGO TO ACCEPT THE PROP
export const Logo = ({ role }: { role: string }) => {
  return (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <Image src="/logos/favicon-32x32.png" alt="Logo" width={20} height={20} />
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 whitespace-pre">
        {/* 3. USE THE PROP HERE */}
        {role === "ADMIN" ? "Admin" : "Editor"} Panel
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link href="#" className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
      <Image src="/logos/favicon-32x32.png" alt="Logo" width={24} height={24} />
    </Link>
  );
};