
// import SideBar from '@/core/components/app-sidebar'
// import React from 'react'

// const layout = ({ children }: { children: React.ReactNode }) => {
//   return (
//     <div>
//       <SideBar>{children}</SideBar>
//     </div>
//   )
// }

// export default layout





// import AppSideBar, { MenuItemConfig } from "@/core/components/AppSideBar";
// import AppSideBar, { MenuItemConfig } from "@/core/components/app-sidebar";

// import {
//   LayoutDashboard, Users, BookMarked, School, BookOpen,
//   ClipboardList, FileText, Trophy, UserCheck, CalendarDays,
//   DollarSign, StickyNote, MessageSquare, Bell, Library,
//   Shield, UsersRound, GraduationCap, UserCircle, Briefcase,
//   Building2,
// } from "lucide-react";

// const menu: MenuItemConfig[] = [
//   { label: "Dashboard",     href: "/admin",               icon: <LayoutDashboard className="w-5 h-5" /> },
//   {
//     label: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" />,
//     submenu: [
//       { label: "All Users",   href: "/admin/users",        icon: <UsersRound    className="w-4 h-4" /> },
//       { label: "Students",    href: "/admin/students",     icon: <GraduationCap className="w-4 h-4" /> },
//       { label: "Teachers",    href: "/admin/teachers",     icon: <UserCircle    className="w-4 h-4" /> },
//       { label: "Parents",     href: "/admin/parents",      icon: <UserCheck     className="w-4 h-4" /> },
//       { label: "Accountants", href: "/admin/accountants",  icon: <Briefcase     className="w-4 h-4" /> },
//     ],
//   },
//   { label: "Subjects",      href: "/admin/subjects",      icon: <BookMarked    className="w-5 h-5" /> },
//   { label: "Classes",       href: "/admin/classes",       icon: <School        className="w-5 h-5" /> },
//   { label: "Schools",       href: "/admin/schools",       icon: <Building2     className="w-5 h-5" /> },
//   { label: "Lessons",       href: "/admin/lessons",       icon: <BookOpen      className="w-5 h-5" /> },
//   { label: "Exams",         href: "/admin/exams",         icon: <ClipboardList className="w-5 h-5" /> },
//   { label: "Assignments",   href: "/admin/assignments",   icon: <FileText      className="w-5 h-5" /> },
//   { label: "Results",       href: "/admin/results",       icon: <Trophy        className="w-5 h-5" /> },
//   { label: "Attendance",    href: "/admin/attendance",    icon: <UserCheck     className="w-5 h-5" /> },
//   { label: "Sessions",      href: "/admin/sessions",      icon: <CalendarDays  className="w-5 h-5" /> },
//   { label: "Schedule",      href: "/admin/schedules",     icon: <CalendarDays  className="w-5 h-5" /> },
//   { label: "Fees",          href: "/admin/fees",          icon: <DollarSign    className="w-5 h-5" /> },
//   { label: "Events",        href: "/admin/events",        icon: <CalendarDays  className="w-5 h-5" /> },
//   { label: "Notices",       href: "/admin/notices",       icon: <StickyNote    className="w-5 h-5" /> },
//   { label: "Messages",      href: "/admin/messages",      icon: <MessageSquare className="w-5 h-5" /> },
//   { label: "Announcements", href: "/admin/announcements", icon: <Bell          className="w-5 h-5" /> },
//   { label: "Library",       href: "/admin/library",       icon: <Library       className="w-5 h-5" /> },
// ];

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <AppSideBar
//       menu={menu}
//       title="Admin Panel"
//       titleIcon={<Shield className="w-6 h-6" />}
//       allowedRole="ADMIN"
//       settingsHref="/admin/settings"
//       fallbackName="Admin"
//     >
//       {children}
//     </AppSideBar>
//   );
// }




// import AppSideBar, { MenuItemConfig } from "@/core/components/AppSideBar";
import AppSideBar, { MenuItemConfig } from "@/core/components/app-sidebar";
import {
  LayoutDashboard, UserCircle, UserCheck, Trophy,
  ClipboardList, FileText, CalendarDays, DollarSign,
  StickyNote, Bell, MessageSquare, GraduationCap,
} from "lucide-react";

const menu: MenuItemConfig[] = [
  { label: "Dashboard",     href: "/student",               icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: "Profile",       href: "/student/profile",       icon: <UserCircle      className="w-5 h-5" /> },
  { label: "Attendance",    href: "/student/attendance",    icon: <UserCheck       className="w-5 h-5" /> },
  { label: "Results",       href: "/student/results",       icon: <Trophy          className="w-5 h-5" /> },
  { label: "Exams",         href: "/student/exams",         icon: <ClipboardList   className="w-5 h-5" /> },
  { label: "Assignments",   href: "/student/assignments",   icon: <FileText        className="w-5 h-5" /> },
  { label: "Schedule",      href: "/student/schedule",      icon: <CalendarDays    className="w-5 h-5" /> },
  { label: "Fees",          href: "/student/fees",          icon: <DollarSign      className="w-5 h-5" /> },
  { label: "Notices",       href: "/student/notices",       icon: <StickyNote      className="w-5 h-5" /> },
  { label: "Announcements", href: "/student/announcements", icon: <Bell            className="w-5 h-5" /> },
  { label: "Messages",      href: "/student/messages",      icon: <MessageSquare   className="w-5 h-5" /> },
];

export default function StudentLayout({ children }: { children: React.ReactNode }) {
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