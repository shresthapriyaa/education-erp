"use client";
import AppSideBar, { type MenuItemConfig } from "@/core/components/app-sidebar";
import {
  LayoutDashboard, UserCheck,
  CalendarDays, BookOpen, GraduationCap,
} from "lucide-react";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const menu: MenuItemConfig[] = [
    { label: "Dashboard",  href: "/teacher",            icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Attendance", href: "/teacher/attendance", icon: <UserCheck       className="w-5 h-5" /> },
    { label: "Schedule",   href: "/teacher/schedule",   icon: <CalendarDays    className="w-5 h-5" /> },
    { label: "Lessons",    href: "/teacher/lessons",    icon: <BookOpen        className="w-5 h-5" /> },
  ];
  return (
    <AppSideBar
      menu={menu}
      title="Teacher Portal"
      titleIcon={<GraduationCap className="w-6 h-6" />}
      allowedRole="TEACHER"
      settingsHref="/teacher/settings"
      fallbackName="Teacher"
    >
      {children}
    </AppSideBar>
  );
}