"use client";
import AppSideBar, { type MenuSectionConfig } from "@/core/components/app-sidebar";
import {
  LayoutDashboard, BookOpen, ClipboardList, Calendar,
  UserCheck, MessageSquare, GraduationCap,
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const menu: MenuSectionConfig[] = [
    {
      section: "MAIN",
      items: [
        { label: "Dashboard",   href: "/student",             icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: "My Lessons",  href: "/student/lessons",     icon: <BookOpen        className="w-5 h-5" /> },
        { label: "Assignments", href: "/student/assignments", icon: <ClipboardList   className="w-5 h-5" /> },
        { label: "Attendance",  href: "/student/attendance",  icon: <UserCheck       className="w-5 h-5" /> },
        { label: "Routine",     href: "/student/routine",     icon: <Calendar        className="w-5 h-5" /> },
        { label: "Messages",    href: "/student/messages",    icon: <MessageSquare   className="w-5 h-5" /> },
      ],
    },
  ];

  return (
    <AppSideBar
      menu={menu}
      title="Student Portal"
      titleIcon={<GraduationCap className="w-6 h-6" />}
      allowedRole="STUDENT"
      settingsHref="/student/settings"
      fallbackName="Student"
    >
      {children}
    </AppSideBar>
  );
}
