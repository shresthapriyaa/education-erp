"use client";
import AppSideBar, { type MenuSectionConfig } from "@/core/components/app-sidebar";
import {
  LayoutDashboard, BookOpen, ClipboardList, Calendar,
  UserCheck, MessageSquare, GraduationCap, Bell, CalendarDays,
  Award, FileText, TrendingUp, Wallet, BookMarked,
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const menu: MenuSectionConfig[] = [
    {
      section: "",
      items: [
        { 
          label: "Dashboard", 
          href: "/student", 
          icon: <LayoutDashboard className="w-5 h-5" /> 
        },
        {
          label: "Infrastructure",
          href: "/student/lessons",
          icon: <BookOpen className="w-5 h-5" />,
          submenu: [
            { 
              label: "Lessons", 
              href: "/student/lessons", 
              icon: <BookMarked className="w-4 h-4" /> 
            },
            { 
              label: "Assignments", 
              href: "/student/assignments", 
              icon: <ClipboardList className="w-4 h-4" /> 
            },
          ],
        },
        {
          label: "Curriculum",
          href: "/student/routine",
          icon: <Calendar className="w-5 h-5" />,
          submenu: [
            { 
              label: "Routine", 
              href: "/student/routine", 
              icon: <CalendarDays className="w-4 h-4" /> 
            },
          ],
        },
        {
          label: "Assessment",
          href: "/student/grades",
          icon: <Award className="w-5 h-5" />,
          submenu: [
            { 
              label: "My Grades", 
              href: "/student/grades", 
              icon: <Award className="w-4 h-4" /> 
            },
            { 
              label: "Exams", 
              href: "/student/exams", 
              icon: <FileText className="w-4 h-4" /> 
            },
            { 
              label: "Results", 
              href: "/student/results", 
              icon: <TrendingUp className="w-4 h-4" /> 
            },
          ],
        },
        { 
          label: "Attendance", 
          href: "/student/attendance", 
          icon: <UserCheck className="w-5 h-5" /> 
        },
        { 
          label: "Fees", 
          href: "/student/fees", 
          icon: <Wallet className="w-5 h-5" /> 
        },
        {
          label: "Communication",
          href: "/student/announcements",
          icon: <MessageSquare className="w-5 h-5" />,
          submenu: [
            { 
              label: "Announcements", 
              href: "/student/announcements", 
              icon: <Bell className="w-4 h-4" /> 
            },
            { 
              label: "Events", 
              href: "/student/events", 
              icon: <CalendarDays className="w-4 h-4" /> 
            },
            { 
              label: "Messages", 
              href: "/student/messages", 
              icon: <MessageSquare className="w-4 h-4" /> 
            },
          ],
        },
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
