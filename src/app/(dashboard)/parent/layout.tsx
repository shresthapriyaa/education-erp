"use client";
import AppSideBar, { type MenuSectionConfig } from "@/core/components/app-sidebar";
import {
  LayoutDashboard, UserCheck, MessageSquare, Users,
  Bell, CalendarDays, Award, FileText, TrendingUp, Wallet,
} from "lucide-react";

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  const menu: MenuSectionConfig[] = [
    {
      section: "",
      items: [
        { 
          label: "Dashboard", 
          href: "/parent", 
          icon: <LayoutDashboard className="w-5 h-5" /> 
        },
        { 
          label: "My Children", 
          href: "/parent/children", 
          icon: <Users className="w-5 h-5" /> 
        },
        { 
          label: "Attendance", 
          href: "/parent/attendance", 
          icon: <UserCheck className="w-5 h-5" /> 
        },
        {
          label: "Academic",
          href: "/parent/grades",
          icon: <Award className="w-5 h-5" />,
          submenu: [
            { 
              label: "Grades", 
              href: "/parent/grades", 
              icon: <Award className="w-4 h-4" /> 
            },
            { 
              label: "Exams", 
              href: "/parent/exams", 
              icon: <FileText className="w-4 h-4" /> 
            },
            { 
              label: "Results", 
              href: "/parent/results", 
              icon: <TrendingUp className="w-4 h-4" /> 
            },
          ],
        },
        { 
          label: "Fees", 
          href: "/parent/fees", 
          icon: <Wallet className="w-5 h-5" /> 
        },
        {
          label: "Communication",
          href: "/parent/announcements",
          icon: <MessageSquare className="w-5 h-5" />,
          submenu: [
            { 
              label: "Announcements", 
              href: "/parent/announcements", 
              icon: <Bell className="w-4 h-4" /> 
            },
            { 
              label: "Events", 
              href: "/parent/events", 
              icon: <CalendarDays className="w-4 h-4" /> 
            },
            { 
              label: "Messages", 
              href: "/parent/messages", 
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
      title="Parent Portal"
      titleIcon={<Users className="w-6 h-6" />}
      allowedRole="PARENT"
      settingsHref="/parent/settings"
      fallbackName="Parent"
    >
      {children}
    </AppSideBar>
  );
}
