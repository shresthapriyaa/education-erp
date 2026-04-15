"use client";
import { ReactNode, useEffect, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Settings,
  LogOut,
  Menu,
  Search,
  ChevronDown,
  ChevronRight,
  Home,
} from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { ScrollArea } from "@/core/components/ui/scroll-area";
import { Input } from "@/core/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/core/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/core/components/ui/collapsible";
import { cn } from "@/core/lib/utils";
import { Avatar, AvatarFallback } from "@/core/components/ui/avatar";

/* ================= TYPES ================= */

export interface MenuItemConfig {
  label: string;
  href: string;
  icon: ReactNode;
  submenu?: MenuItemConfig[];
}

export interface MenuSectionConfig {
  section: string;
  items: MenuItemConfig[];
}

interface AppSideBarProps {
  children: ReactNode;
  menu: MenuSectionConfig[];
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

/* ================= BREADCRUMBS ================= */

function useBreadcrumbs(
  pathname: string,
  menu: MenuSectionConfig[],
  rootHref: string,
): BreadcrumbSegment[] {
  return useMemo(() => {
    const crumbs: BreadcrumbSegment[] = [{ label: "Home", href: rootHref }];
    if (pathname === rootHref) return crumbs;

    for (const section of menu) {
      for (const item of section.items) {
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
    }

    return crumbs;
  }, [pathname, menu, rootHref]);
}

/* ================= COMPONENT ================= */

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

  /* ================= SEARCH FILTER ================= */

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return menu;

    const query = searchQuery.toLowerCase();

    return menu
      .map((section) => ({
        ...section,
        items: section.items
          .filter((item) => {
            if (item.label.toLowerCase().includes(query)) return true;
            return item.submenu?.some((sub) =>
              sub.label.toLowerCase().includes(query),
            );
          })
          .map((item) =>
            item.submenu
              ? {
                  ...item,
                  submenu: item.submenu.filter((sub) =>
                    sub.label.toLowerCase().includes(query),
                  ),
                }
              : item,
          ),
      }))
      .filter((section) => section.items.length > 0);
  }, [searchQuery, menu]);

  /* ================= USER INITIALS ================= */

  const userInitials = useMemo(() => {
    return session?.user?.email
      ? session.user.email.substring(0, 2).toUpperCase()
      : fallbackName.substring(0, 2).toUpperCase();
  }, [session?.user?.email, fallbackName]);

  /* ================= ROLE PROTECTION ================= */

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

  /* ================= MENU TOGGLE ================= */

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  /* ================= MENU ITEM RENDER ================= */

  const renderMenuItem = (item: MenuItemConfig) => {
    const isActive = pathname === item.href;
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isOpen = openMenus.includes(item.label);

    if (hasSubmenu && !collapsed) {
      return (
        <Collapsible
          key={item.href}
          open={isOpen}
          onOpenChange={() => toggleMenu(item.label)}
          className="w-full"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-10 px-3",
                isActive && "bg-primary text-primary-foreground",
              )}
            >
              {item.icon}
              <span className="flex-1 text-left font-semibold">{item.label}</span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  isOpen && "rotate-180",
                )}
              />
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="ml-6 pl-3 border-l mt-1">
            {item.submenu?.map((subItem) => (
              <Button
                key={subItem.href}
                variant="ghost"
                onClick={() => router.push(subItem.href)}
                className={cn(
                  "w-full justify-start gap-2 h-9",
                  pathname === subItem.href && "bg-muted",
                )}
              >
                {subItem.icon}
                <span className="text-sm">{subItem.label}</span>
              </Button>
            ))}
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
          isActive && "bg-primary text-primary-foreground",
        )}
      >
        {item.icon}
        {!collapsed && <span className="font-semibold">{item.label}</span>}
      </Button>
    );
  };

  /* ================= UI ================= */

  return (
    <div className="flex min-h-screen bg-background">
      {/* ---- SIDEBAR ---- */}
      <aside
        className={cn(
          "border-r bg-card flex flex-col h-screen min-h-0 sticky top-0 transition-all",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {/* HEADER */}
        <div className="px-4 h-[73px] border-b flex items-center gap-2 shrink-0">
          <span className="text-primary">{titleIcon}</span>
          {!collapsed && <span className="font-semibold text-lg">{title}</span>}
        </div>

        {/* MENU */}
        <ScrollArea className="flex-1 min-h-0 px-2 py-4 ">
          <nav className="space-y-4">
            {filteredMenu.map((section) => (
              <div key={section.section}>
                {!collapsed && section.section && (
                  <p className="px-3 text-xs font-bold text-foreground uppercase mb-2 tracking-wide">
                    {section.section}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => renderMenuItem(item))}
                </div>
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* USER */}
        <div className="border-t p-3 shrink-0 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 ">
                <Avatar className="h-8 w-8 ">
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <div className="text-left">
                    <p className="text-sm font-medium">
                      {session?.user?.name || fallbackName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session?.user?.email}
                    </p>
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
                className="text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* ---- MAIN ---- */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 border-b bg-card px-6 h-[73px] flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* BREADCRUMBS */}
          <nav>
            <ol className="flex items-center gap-1 text-sm text-muted-foreground">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={index} className="flex items-center gap-1">
                    {index > 0 && <ChevronRight className="w-3 h-3" />}
                    {isLast ? (
                      <span className="text-foreground">{crumb.label}</span>
                    ) : (
                      <button onClick={() => router.push(crumb.href)}>
                        {index === 0 ? (
                          <Home className="w-3 h-3" />
                        ) : (
                          crumb.label
                        )}
                      </button>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex-1" />

          {/* SEARCH */}
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-muted/10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
