// "use client";
// import { ReactNode, useEffect, useState, useMemo } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   LayoutDashboard,
//   Users,
//   Settings,
//   LogOut,
//   Shield,
//   Menu,
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
//   MoreHorizontal,
//   Search,
//   UsersRound,
//   ChevronDown,
//   DollarSign,
//   Library,
//   StickyNote,
//   ChevronRight,
//   Home,
//   MapPin,
// } from "lucide-react";
// import { Button } from "@/core/components/ui/button";
// import { ScrollArea } from "@/core/components/ui/scroll-area";
// import { Input } from "@/core/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/core/components/ui/dropdown-menu";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/core/components/ui/collapsible";
// import { cn } from "@/core/lib/utils";
// import { Avatar, AvatarFallback } from "@/core/components/ui/avatar";

// interface MenuItem {
//   label: string;
//   href: string;
//   icon: ReactNode;
//   submenu?: MenuItem[];
// }

// const menu: MenuItem[] = [
//   {
//     label: "Dashboard",
//     href: "/admin",
//     icon: <LayoutDashboard className="w-5 h-5" />,
//   },
//   {
//     label: "Users",
//     href: "/admin/users",
//     icon: <Users className="w-5 h-5" />,
//     submenu: [
//       {
//         label: "All Users",
//         href: "/admin/users",
//         icon: <UsersRound className="w-4 h-4" />,
//       },
//       {
//         label: "Students",
//         href: "/admin/students",
//         icon: <GraduationCap className="w-4 h-4" />,
//       },
//       {
//         label: "Teachers",
//         href: "/admin/teachers",
//         icon: <UserCircle className="w-4 h-4" />,
//       },
//       {
//         label: "Parents",
//         href: "/admin/parents",
//         icon: <UserCheck className="w-4 h-4" />,
//       },
//       {
//         label: "Accountants",
//         href: "/admin/accountants",
//         icon: <Briefcase className="w-4 h-4" />,
//       },
//     ],
//   },
//   {
//     label: "Subjects",
//     href: "/admin/subjects",
//     icon: <BookMarked className="w-5 h-5" />,
//   },
//   {
//     label: "Classes",
//     href: "/admin/classes",
//     icon: <School className="w-5 h-5" />,
//   },
//   {
//     label: "Schools",
//     href: "/admin/schools",
//     icon: <School className="w-5 h-5" />,
//   },
//   {
//   label: "School Zones",
//   href: "/admin/schoolzones",
//   icon: <MapPin className="w-5 h-5" />,
// },
//   {
//     label: "Lessons",
//     href: "/admin/lessons",
//     icon: <BookOpen className="w-5 h-5" />,
//   },
//   {
//     label: "Grades",
//     href: "/admin/grades",
//    icon: <ClipboardList className="w-5 h-5" />,

//   },
//   {
//     label: "Exams",
//     href: "/admin/exams",
//     icon: <ClipboardList className="w-5 h-5" />,
//   },
//   {
//     label: "Assignments",
//     href: "/admin/assignments",
//     icon: <FileText className="w-5 h-5" />,
//   },
//   {
//     label: "Results",
//     href: "/admin/results",
//     icon: <Trophy className="w-5 h-5" />,
//   },
//   {
//     label: "Attendance",
//     href: "/admin/attendance",
//     icon: <UserCheck className="w-5 h-5" />,
//   },
//   {
//     label: "Sessions",
//     href: "/admin/sessions",
//     icon: <CalendarDays className="w-5 h-5" />,
//   },
//   {
//     label: "Schedule",
//     href: "/admin/schedules",
//     icon: <CalendarDays className="w-5 h-5" />,
//   },
//   {
//     label: "Fees",
//     href: "/admin/fees",
//     icon: <DollarSign className="w-5 h-5" />,
//   },
//   {
//     label: "Events",
//     href: "/admin/events",
//     icon: <CalendarDays className="w-5 h-5" />,
//   },
//   {
//     label: "Notices",
//     href: "/admin/notices",
//     icon: <StickyNote className="w-5 h-5" />,
//   },
//   {
//     label: "Messages",
//     href: "/admin/messages",
//     icon: <MessageSquare className="w-5 h-5" />,
//   },
//   {
//     label: "Announcements",
//     href: "/admin/announcements",
//     icon: <Bell className="w-5 h-5" />,
//   },
//   {
//     label: "Library",
//     href: "/admin/library",
//     icon: <Library className="w-5 h-5" />,
//   },
// ];

// // Build breadcrumb segments from current pathname
// interface BreadcrumbSegment {
//   label: string;
//   href: string;
// }

// function useBreadcrumbs(pathname: string): BreadcrumbSegment[] {
//   return useMemo(() => {
//     const crumbs: BreadcrumbSegment[] = [
//       { label: "Home", href: "/admin" },
//     ];

//     if (pathname === "/admin") return crumbs;

    
//     for (const item of menu) {
//       if (item.submenu) {
//         const sub = item.submenu.find((s) => s.href === pathname);
//         if (sub) {
//           crumbs.push({ label: item.label, href: item.href });
//           crumbs.push({ label: sub.label, href: sub.href });
//           return crumbs;
//         }
//       }
//       if (item.href === pathname) {
//         crumbs.push({ label: item.label, href: item.href });
//         return crumbs;
//       }
//     }

//     // Fallback: split path into segments
//     const parts = pathname.replace(/^\/admin\/?/, "").split("/").filter(Boolean);
//     parts.forEach((part, i) => {
//       const href = "/admin/" + parts.slice(0, i + 1).join("/");
//       const label = part.charAt(0).toUpperCase() + part.slice(1);
//       crumbs.push({ label, href });
//     });

//     return crumbs;
//   }, [pathname]);
// }

// export default function SideBar({ children }: { children: ReactNode }) {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();
//   const router = useRouter();
//   const [collapsed, setCollapsed] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openMenus, setOpenMenus] = useState<string[]>([]);

//   const breadcrumbs = useBreadcrumbs(pathname);

//   const filteredMenu = useMemo(() => {
//     if (!searchQuery.trim()) return menu;
//     const query = searchQuery.toLowerCase();
//     return menu
//       .filter((item) => {
//         if (item.label.toLowerCase().includes(query)) return true;
//         if (item.submenu) {
//           return item.submenu.some((sub) =>
//             sub.label.toLowerCase().includes(query),
//           );
//         }
//         return false;
//       })
//       .map((item) => {
//         if (item.submenu) {
//           return {
//             ...item,
//             submenu: item.submenu.filter((sub) =>
//               sub.label.toLowerCase().includes(query),
//             ),
//           };
//         }
//         return item;
//       });
//   }, [searchQuery]);

//   const userInitials = useMemo(() => {
//     return session?.user?.email
//       ? session.user.email.substring(0, 2).toUpperCase()
//       : "AD";
//   }, [session?.user?.email]);

//   useEffect(() => {
//     if (status === "authenticated" && session?.user?.role !== "ADMIN") {
//       router.replace("/");
//     }
//   }, [status, session, router]);

//   if (status === "loading") {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-primary" />
//       </div>
//     );
//   }

//   const toggleMenu = (label: string) => {
//     setOpenMenus((prev) =>
//       prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
//     );
//   };

//   const renderMenuItem = (item: MenuItem) => {
//     const isActive = pathname === item.href;
//     const hasSubmenu = item.submenu && item.submenu.length > 0;
//     const isOpen = openMenus.includes(item.label);

//     if (hasSubmenu && !collapsed) {
//       return (
//         <Collapsible
//           key={item.href}
//           open={isOpen || searchQuery.length > 0}
//           onOpenChange={() => toggleMenu(item.label)}
//           className="w-full"
//         >
//           <CollapsibleTrigger asChild>
//             <Button
//               variant="ghost"
//               className={cn(
//                 "w-full justify-start gap-3 h-10 px-3",
//                 isActive &&
//                   "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
//               )}
//             >
//               {item.icon}
//               {!collapsed && (
//                 <>
//                   <span className="flex-1 text-left">{item.label}</span>
//                   <ChevronDown
//                     className={cn(
//                       "w-4 h-4 transition-transform duration-200",
//                       (isOpen || searchQuery.length > 0) && "rotate-180",
//                     )}
//                   />
//                 </>
//               )}
//             </Button>
//           </CollapsibleTrigger>
//           <CollapsibleContent className="ml-6 pl-3 border-l-2 border-muted mt-1">
//             <div className="space-y-0">
//               {item.submenu?.map((subItem) => (
//                 <Button
//                   key={subItem.href}
//                   variant="ghost"
//                   onClick={() => router.push(subItem.href)}
//                   className={cn(
//                     "w-full justify-start gap-2 h-9 pl-3 rounded-none",
//                     pathname === subItem.href &&
//                       "bg-muted text-foreground hover:bg-muted hover:text-foreground",
//                   )}
//                 >
//                   {subItem.icon}
//                   <span className="flex-1 text-left text-sm">
//                     {subItem.label}
//                   </span>
//                 </Button>
//               ))}
//             </div>
//           </CollapsibleContent>
//         </Collapsible>
//       );
//     }

//     return (
//       <Button
//         key={item.href}
//         variant="ghost"
//         onClick={() => router.push(item.href)}
//         className={cn(
//           "w-full justify-start gap-3 h-10 px-3",
//           isActive &&
//             "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
//         )}
//       >
//         {item.icon}
//         {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
//       </Button>
//     );
//   };

//   return (
//     <div className="flex min-h-screen bg-background">
//       {/* SIDEBAR */}
//       <aside
//         className={cn(
//           "border-r bg-card flex flex-col h-screen sticky top-0 transition-all duration-300",
//           collapsed ? "w-20" : "w-64",
//         )}
//       >
//         {/* HEADER */}
//         <div className="px-4 py-4 border-b flex items-center justify-between shrink-0">
//           <div className="flex items-center gap-2">
//             <Shield className="w-6 h-6 text-primary" />
//             {!collapsed && (
//               <span className="font-semibold text-lg">Admin Panel</span>
//             )}
//           </div>
//         </div>

//         {/* NAV - scrollable */}
//         <ScrollArea className="flex-1 overflow-hidden px-2 py-4">
//           <nav className="space-y-1">
//             {filteredMenu.length > 0 ? (
//               filteredMenu.map((item) => renderMenuItem(item))
//             ) : (
//               <div className="text-center py-8 text-muted-foreground text-sm">
//                 No results found
//               </div>
//             )}
//           </nav>
//         </ScrollArea>

//         {/* USER MENU */}
//         <div className="border-t p-3 shrink-0">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start gap-3 h-auto py-2"
//               >
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback>{userInitials}</AvatarFallback>
//                 </Avatar>
//                 {!collapsed && (
//                   <div className="flex-1 text-left">
//                     <p className="text-sm font-medium leading-none">
//                       {session?.user?.name || "Admin"}
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {session?.user?.email}
//                     </p>
//                   </div>
//                 )}
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
//                 <Settings className="mr-2 h-4 w-4" />
//                 Settings
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => router.push("/admin/other")}>
//                 <MoreHorizontal className="mr-2 h-4 w-4" />
//                 Other
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => signOut({ callbackUrl: "/auth/login" })}
//                 className="text-destructive focus:text-destructive"
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </aside>

//       {/* CONTENT */}
//       <div className="flex-1 flex flex-col min-h-screen">
//         {/* TOP BAR */}
//         <header className="border-b bg-card px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => setCollapsed(!collapsed)}
//           >
//             <Menu className="w-5 h-5" />
//           </Button>

//           {/* BREADCRUMB */}
//           <nav aria-label="breadcrumb">
//             <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
//               {breadcrumbs.map((crumb, index) => {
//                 const isLast = index === breadcrumbs.length - 1;
//                 return (
//                   <li key={`${index}-${crumb.href}`} className="inline-flex items-center gap-1.5">
//                     {index > 0 && (
//                       <ChevronRight className="w-3.5 h-3.5 shrink-0" />
//                     )}
//                     {isLast ? (
//                       <span className="font-medium text-foreground">
//                         {crumb.label}
//                       </span>
//                     ) : (
//                       <button
//                         onClick={() => router.push(crumb.href)}
//                         className="flex items-center gap-1 hover:text-foreground transition-colors"
//                       >
//                         {index === 0 ? <Home className="w-3.5 h-3.5" /> : crumb.label}
//                       </button>
//                     )}
//                   </li>
//                 );
//               })}
//             </ol>
//           </nav>

//           <div className="flex-1" />

//           <div className="max-w-md">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 type="text"
//                 placeholder="Search menu..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-9 h-9"
//               />
//             </div>
//           </div>
//         </header>

//         {/* MAIN CONTENT */}
//         <main className="flex-1 p-6 overflow-y-auto bg-muted/10">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }



"use client";
import { ReactNode, useEffect, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings, LogOut, Menu, Search,
  ChevronDown, ChevronRight, Home,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { Input } from "@/core/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import { cn } from "@/core/lib/utils";
import { Avatar, AvatarFallback } from "@/core/components/ui/avatar";

// ✅ exported so layouts can import it
export interface MenuItemConfig {
  label: string;
  href: string;
  icon: ReactNode;
  submenu?: MenuItemConfig[];
}

interface AppSideBarProps {
  children: ReactNode;
  menu: MenuItemConfig[];
  title: string;
  titleIcon: ReactNode;
  allowedRole: string;
  settingsHref: string;
  fallbackName?: string;
}

interface BreadcrumbSegment {
  label: string;
  href: string;
}

function useBreadcrumbs(
  pathname: string,
  menu: MenuItemConfig[],
  rootHref: string
): BreadcrumbSegment[] {
  return useMemo(() => {
    const crumbs: BreadcrumbSegment[] = [{ label: "Home", href: rootHref }];
    if (pathname === rootHref) return crumbs;

    for (const item of menu) {
      if (item.submenu) {
        const sub = item.submenu.find((s) => s.href === pathname);
        if (sub) {
          crumbs.push({ label: item.label, href: item.href });
          crumbs.push({ label: sub.label, href: sub.href });
          return crumbs;
        }
      }
      if (item.href === pathname) {
        crumbs.push({ label: item.label, href: item.href });
        return crumbs;
      }
    }

    const base = rootHref.replace(/\/$/, "");
    const parts = pathname.replace(new RegExp(`^${base}\\/?`), "").split("/").filter(Boolean);
    parts.forEach((part, i) => {
      const href = base + "/" + parts.slice(0, i + 1).join("/");
      crumbs.push({ label: part.charAt(0).toUpperCase() + part.slice(1), href });
    });

    return crumbs;
  }, [pathname, menu, rootHref]);
}

export default function AppSideBar({
  children,
  menu,
  title,
  titleIcon,
  allowedRole,
  settingsHref,
  fallbackName = "User",
}: AppSideBarProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const rootHref = "/" + settingsHref.split("/")[1];
  const breadcrumbs = useBreadcrumbs(pathname, menu, rootHref);

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return menu;
    const query = searchQuery.toLowerCase();
    return menu
      .filter((item) => {
        if (item.label.toLowerCase().includes(query)) return true;
        return item.submenu?.some((sub) => sub.label.toLowerCase().includes(query)) ?? false;
      })
      .map((item) =>
        item.submenu
          ? { ...item, submenu: item.submenu.filter((sub) => sub.label.toLowerCase().includes(query)) }
          : item
      );
  }, [searchQuery, menu]);

  const userInitials = useMemo(() => {
    return session?.user?.email
      ? session.user.email.substring(0, 2).toUpperCase()
      : fallbackName.substring(0, 2).toUpperCase();
  }, [session?.user?.email, fallbackName]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== allowedRole) {
      router.replace("/");
    }
  }, [status, session, router, allowedRole]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-primary" />
      </div>
    );
  }

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const renderMenuItem = (item: MenuItemConfig) => {
    const isActive = pathname === item.href;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isOpen = openMenus.includes(item.label);

    if (hasSubmenu && !collapsed) {
      return (
        <Collapsible
          key={item.href}
          open={isOpen || searchQuery.length > 0}
          onOpenChange={() => toggleMenu(item.label)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10 px-3",
                isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", (isOpen || searchQuery.length > 0) && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-6 pl-3 border-l-2 border-muted mt-1">
            <div className="space-y-0">
              {item.submenu?.map((subItem) => (
                <Button
                  key={subItem.href}
                  variant="ghost"
                  onClick={() => router.push(subItem.href)}
                  className={cn(
                    "w-full justify-start gap-2 h-9 pl-3 rounded-none",
                    pathname === subItem.href && "bg-muted text-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {subItem.icon}
                  <span className="flex-1 text-left text-sm">{subItem.label}</span>
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.href}
        variant="ghost"
        onClick={() => router.push(item.href)}
        className={cn(
          "w-full justify-start gap-3 h-10 px-3",
          isActive && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        )}
      >
        {item.icon}
        {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
      </Button>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("border-r bg-card flex flex-col h-screen sticky top-0 transition-all duration-300", collapsed ? "w-20" : "w-64")}>
        <div className="px-4 py-4 border-b flex items-center gap-2 shrink-0">
          <span className="text-primary">{titleIcon}</span>
          {!collapsed && <span className="font-semibold text-lg">{title}</span>}
        </div>

        <ScrollArea className="flex-1 overflow-hidden px-2 py-4">
          <nav className="space-y-1">
            {filteredMenu.length > 0
              ? filteredMenu.map((item) => renderMenuItem(item))
              : <div className="text-center py-8 text-muted-foreground text-sm">No results found</div>
            }
          </nav>
        </ScrollArea>

        <div className="border-t p-3 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium leading-none">{session?.user?.name || fallbackName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{session?.user?.email}</p>
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push(settingsHref)}>
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="border-b bg-card px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <Button variant="outline" size="icon" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="w-5 h-5" />
          </Button>
          <nav aria-label="breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={`${index}-${crumb.href}`} className="inline-flex items-center gap-1.5">
                    {index > 0 && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                    {isLast
                      ? <span className="font-medium text-foreground">{crumb.label}</span>
                      : <button onClick={() => router.push(crumb.href)} className="flex items-center gap-1 hover:text-foreground transition-colors">
                          {index === 0 ? <Home className="w-3.5 h-3.5" /> : crumb.label}
                        </button>
                    }
                  </li>
                );
              })}
            </ol>
          </nav>
          <div className="flex-1" />
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto bg-muted/10">{children}</main>
      </div>
    </div>
  );
}