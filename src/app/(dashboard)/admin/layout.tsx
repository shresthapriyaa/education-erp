"use client";
import AppSideBar from "@/core/components/app-sidebar";
import { type MenuItemConfig } from "@/core/components/app-sidebar"; 
import {
  LayoutDashboard, Users, Shield, GraduationCap,
  UserCircle, BookOpen, FileText, ClipboardList,
  BookMarked, Trophy, UserCheck, Briefcase, School,
  CalendarDays, MessageSquare, Bell, DollarSign,
  Library, StickyNote, UsersRound, MapPin,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const menu: MenuItemConfig[] = [
    {
      label: "Dashboard", href: "/admin",
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      label: "Users", href: "/admin/users",
      icon: <Users className="w-5 h-5" />,
      submenu: [
        { label: "All Users",   href: "/admin/users",       icon: <UsersRound    className="w-4 h-4" /> },
        { label: "Students",    href: "/admin/students",    icon: <GraduationCap className="w-4 h-4" /> },
        { label: "Teachers",    href: "/admin/teachers",    icon: <UserCircle    className="w-4 h-4" /> },
        { label: "Parents",     href: "/admin/parents",     icon: <UserCheck     className="w-4 h-4" /> },
        { label: "Accountants", href: "/admin/accountants", icon: <Briefcase     className="w-4 h-4" /> },
      ],
    },
    { label: "Subjects",      href: "/admin/subjects",      icon: <BookMarked    className="w-5 h-5" /> },
    { label: "Classes",       href: "/admin/classes",       icon: <School        className="w-5 h-5" /> },
    { label: "Schools",       href: "/admin/schools",       icon: <School        className="w-5 h-5" /> },
    { label: "School Zones",  href: "/admin/schoolzones",   icon: <MapPin        className="w-5 h-5" /> },
    { label: "Lessons",       href: "/admin/lessons",       icon: <BookOpen      className="w-5 h-5" /> },
    { label: "Grades",        href: "/admin/grades",        icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Exams",         href: "/admin/exams",         icon: <ClipboardList className="w-5 h-5" /> },
    { label: "Assignments",   href: "/admin/assignments",   icon: <FileText      className="w-5 h-5" /> },
    { label: "Results",       href: "/admin/results",       icon: <Trophy        className="w-5 h-5" /> },
    { label: "Attendance",    href: "/admin/attendance",    icon: <UserCheck     className="w-5 h-5" /> },
    { label: "Sessions",      href: "/admin/sessions",      icon: <CalendarDays  className="w-5 h-5" /> },
    { label: "Schedule",      href: "/admin/schedules",     icon: <CalendarDays  className="w-5 h-5" /> },
    { label: "Fees",          href: "/admin/fees",          icon: <DollarSign    className="w-5 h-5" /> },
    { label: "Events",        href: "/admin/events",        icon: <CalendarDays  className="w-5 h-5" /> },
    { label: "Notices",       href: "/admin/notices",       icon: <StickyNote    className="w-5 h-5" /> },
    { label: "Messages",      href: "/admin/messages",      icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Announcements", href: "/admin/announcements", icon: <Bell          className="w-5 h-5" /> },
    { label: "Library",       href: "/admin/library",       icon: <Library       className="w-5 h-5" /> },
  ];

  return (
    <AppSideBar
      menu={menu}
      title="Admin Panel"
      titleIcon={<Shield className="w-6 h-6" />}
      allowedRole="ADMIN"
      settingsHref="/admin/settings"
      fallbackName="Admin"
    >
      {children}
    </AppSideBar>
  );
}