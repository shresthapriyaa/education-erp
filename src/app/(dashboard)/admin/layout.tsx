// "use client";
// import AppSideBar, { MenuSectionConfig } from "@/core/components/app-sidebar";
// import {
//   LayoutDashboard,
//   Users,
//   Shield,
//   GraduationCap,
//   UserCircle,
//   BookOpen,
//   FileText,
//   ClipboardList,
//   BookMarked,
//   Trophy,
//   UserCheck,
//   Briefcase,
//   School,
//   CalendarDays,
//   MessageSquare,
//   Bell,
//   DollarSign,
//   Library,
//   Home,
//   BarChart2,
//   UsersRound,
// } from "lucide-react";

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const menu: MenuSectionConfig[] = [
//     {
//       section: "",
//       items: [
//         {
//           label: "Dashboard",
//           href: "/admin",
//           icon: <LayoutDashboard className="w-5 h-5" />,
//         },

//         {
//           label: "Users",
//           href: "/admin/users",
//           icon: <Users className="w-5 h-5" />,
//           submenu: [
//             {
//               label: "All Users",
//               href: "/admin/users",
//               icon: <UsersRound className="w-4 h-4" />,
//             },
//             {
//               label: "Students",
//               href: "/admin/students",
//               icon: <GraduationCap className="w-4 h-4" />,
//             },
//             {
//               label: "Teachers",
//               href: "/admin/teachers",
//               icon: <UserCircle className="w-4 h-4" />,
//             },
//             {
//               label: "Parents",
//               href: "/admin/parents",
//               icon: <UserCheck className="w-4 h-4" />,
//             },
//             {
//               label: "Accountants",
//               href: "/admin/accountants",
//               icon: <Briefcase className="w-4 h-4" />,
//             },
//           ],
//         },

//         {
//           label: "Infrastructure",
//           href: "/admin/schools",
//           icon: <School className="w-5 h-5" />,
//           submenu: [
//             {
//               label: "Schools",
//               href: "/admin/schools",
//               icon: <School className="w-4 h-4" />,
//             },
//             {
//               label: "Classes",
//               href: "/admin/classes",
//               icon: <Home className="w-4 h-4" />,
//             },
//             {
//               label: "Subjects",
//               href: "/admin/subjects",
//               icon: <BookOpen className="w-4 h-4" />,
//             },
//           ],
//         },

//         {
//           label: "Curriculum",
//           href: "/admin/lessons",
//           icon: <BookMarked className="w-5 h-5" />,
//           submenu: [
//             {
//               label: "Routines",
//               href: "/admin/routines",
//               icon: <CalendarDays className="w-4 h-4" />,
//             },
//             {
//               label: "Lessons",
//               href: "/admin/lessons",
//               icon: <BookMarked className="w-4 h-4" />,
//             },
//             {
//               label: "Assignments",
//               href: "/admin/assignments",
//               icon: <FileText className="w-4 h-4" />,
//             },
//           ],
//         },

//         {
//           label: "Assessment",
//           href: "/admin/exams",
//           icon: <ClipboardList className="w-5 h-5" />,
//           submenu: [
//             {
//               label: "Exams",
//               href: "/admin/exams",
//               icon: <ClipboardList className="w-4 h-4" />,
//             },
//             {
//               label: "Grades",
//               href: "/admin/grades",
//               icon: <BarChart2 className="w-4 h-4" />,
//             },
//             {
//               label: "Results",
//               href: "/admin/results",
//               icon: <Trophy className="w-4 h-4" />,
//             },
//           ],
//         },

//         {
//           label: "Daily Ops",
//           href: "/admin/attendance",
//           icon: <CalendarDays className="w-5 h-5" />,
//           submenu: [
//             {
//               label: "Attendance",
//               href: "/admin/attendance",
//               icon: <UserCheck className="w-4 h-4" />,
//             },
//           ],
//         },

//         {
//           label: "Fees",
//           href: "/admin/fees",
//           icon: <DollarSign className="w-5 h-5" />,
//         },

//         {
//           label: "Communicate",
//           href: "/admin/announcements",
//           icon: <Bell className="w-5 h-5" />,
//           submenu: [
//             {
//               label: "Announcements",
//               href: "/admin/announcements",
//               icon: <Bell className="w-4 h-4" />,
//             },
//             {
//               label: "Messages",
//               href: "/admin/messages",
//               icon: <MessageSquare className="w-4 h-4" />,
//             },
//             {
//               label: "Events",
//               href: "/admin/events",
//               icon: <CalendarDays className="w-4 h-4" />,
//             },
//           ],
//         },

//         {
//           label: "Library",
//           href: "/admin/library",
//           icon: <Library className="w-5 h-5" />,
//         },
//       ],
//     },
//   ];

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






"use client";
import AppSideBar, { MenuSectionConfig } from "@/core/components/app-sidebar";
import {
  LayoutDashboard,
  Users,
  Shield,
  GraduationCap,
  UserCircle,
  BookOpen,
  FileText,
  ClipboardList,
  BookMarked,
  Trophy,
  UserCheck,
  Briefcase,
  School,
  CalendarDays,
  MessageSquare,
  Bell,
  DollarSign,
  Library,
  Home,
  BarChart2,
  UsersRound,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menu: MenuSectionConfig[] = [
    {
      section: "",
      items: [
        {
          label: "Dashboard",
          href: "/admin",
          icon: <LayoutDashboard className="w-5 h-5" />,
        },

        {
          label: "Users",
          href: "/admin/users",
          icon: <Users className="w-5 h-5" />,
          submenu: [
            {
              label: "All Users",
              href: "/admin/users",
              icon: <UsersRound className="w-4 h-4" />,
            },
            {
              label: "Students",
              href: "/admin/students",
              icon: <GraduationCap className="w-4 h-4" />,
            },
            {
              label: "Teachers",
              href: "/admin/teachers",
              icon: <UserCircle className="w-4 h-4" />,
            },
            {
              label: "Parents",
              href: "/admin/parents",
              icon: <UserCheck className="w-4 h-4" />,
            },
            {
              label: "Accountants",
              href: "/admin/accountants",
              icon: <Briefcase className="w-4 h-4" />,
            },
          ],
        },

        {
          label: "Infrastructure",
          href: "/admin/schools",
          icon: <School className="w-5 h-5" />,
          submenu: [
            {
              label: "Schools",
              href: "/admin/schools",
              icon: <School className="w-4 h-4" />,
            },
            {
              label: "Classes",
              href: "/admin/classes",
              icon: <Home className="w-4 h-4" />,
            },
            {
              label: "Subjects",
              href: "/admin/subjects",
              icon: <BookOpen className="w-4 h-4" />,
            },
            // ✅ Moved here under Subjects
            {
              label: "Lessons",
              href: "/admin/lessons",
              icon: <BookMarked className="w-4 h-4" />,
            },
            {
              label: "Assignments",
              href: "/admin/assignments",
              icon: <FileText className="w-4 h-4" />,
            },
          ],
        },

        {
          label: "Curriculum",
          href: "/admin/routines",
          icon: <BookMarked className="w-5 h-5" />,
          submenu: [
            {
              label: "Routines",
              href: "/admin/routines",
              icon: <CalendarDays className="w-4 h-4" />,
            },
          ],
        },

        {
          label: "Assessment",
          href: "/admin/exams",
          icon: <ClipboardList className="w-5 h-5" />,
          submenu: [
            {
              label: "Exams",
              href: "/admin/exams",
              icon: <ClipboardList className="w-4 h-4" />,
            },
            {
              label: "Grades",
              href: "/admin/grades",
              icon: <BarChart2 className="w-4 h-4" />,
            },
            {
              label: "Results",
              href: "/admin/results",
              icon: <Trophy className="w-4 h-4" />,
            },
          ],
        },

        {
          label: "Daily Ops",
          href: "/admin/attendance",
          icon: <CalendarDays className="w-5 h-5" />,
          submenu: [
            {
              label: "Attendance",
              href: "/admin/attendance",
              icon: <UserCheck className="w-4 h-4" />,
            },
          ],
        },

        {
          label: "Fees",
          href: "/admin/fees",
          icon: <DollarSign className="w-5 h-5" />,
        },

        {
          label: "Communicate",
          href: "/admin/announcements",
          icon: <Bell className="w-5 h-5" />,
          submenu: [
            {
              label: "Announcements",
              href: "/admin/announcements",
              icon: <Bell className="w-4 h-4" />,
            },
            {
              label: "Messages",
              href: "/admin/messages",
              icon: <MessageSquare className="w-4 h-4" />,
            },
            {
              label: "Events",
              href: "/admin/events",
              icon: <CalendarDays className="w-4 h-4" />,
            },
          ],
        },

        {
          label: "Library",
          href: "/admin/library",
          icon: <Library className="w-5 h-5" />,
        },
      ],
    },
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