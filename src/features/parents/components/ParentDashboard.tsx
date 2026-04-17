"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Users, UserCheck, Award, Wallet, Calendar, Bell } from "lucide-react";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Child {
  id: string;
  username: string;
  class: {
    name: string;
  } | null;
  img: string | null;
}

interface DashboardStats {
  totalChildren: number;
  attendanceRate: number;
  pendingFees: number;
  upcomingExams: number;
}

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [children, setChildren] = useState<Child[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalChildren: 0,
    attendanceRate: 0,
    pendingFees: 0,
    upcomingExams: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  async function loadDashboardData() {
    setLoading(true);
    try {
      if (!session?.user?.email) return;

      // Get current parent
      const parentRes = await fetch(`/api/parents?email=${session.user.email}`);
      const parentData = await parentRes.json();
      console.log("Parent API response:", parentData);
      const parents = Array.isArray(parentData) ? parentData : [];
      
      if (parents.length === 0) {
        setLoading(false);
        return;
      }

      const currentParent = parents[0];
      console.log("Current parent:", currentParent);

      // Fetch children data filtered by parentId
      const childrenRes = await fetch(`/api/students?parentId=${currentParent.id}`);
      const childrenData = await childrenRes.json();
      console.log("Students API response:", childrenData);
      const childrenArray = Array.isArray(childrenData) ? childrenData : (childrenData.students || []);
      console.log("Children array length:", childrenArray.length);
      
      setChildren(childrenArray.slice(0, 4)); // Show first 4 children
      
      setStats({
        totalChildren: childrenArray.length,
        attendanceRate: 85, // Mock data
        pendingFees: 0,
        upcomingExams: 0,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">
          Welcome back, {session?.user?.name || "Parent"}! 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor your children's academic progress and activities.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Children
              </CardTitle>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-black">{stats.totalChildren}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance Rate
              </CardTitle>
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.attendanceRate}%</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Fees
              </CardTitle>
              <Wallet className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">${stats.pendingFees}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Exams
              </CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">{stats.upcomingExams}</p>
          </CardContent>
        </Card>
      </div>

      {/* Children Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">My Children</CardTitle>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No children found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {children.map((child) => (
                <Card key={child.id} className="hover:shadow-md transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto mb-3 flex items-center justify-center">
                      {child.img ? (
                        <img src={child.img} alt={child.username} className="w-16 h-16 rounded-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold text-blue-600">
                          {child.username?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-black text-sm">
                      {child.username || "Unknown"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Class: {child.class?.name || "N/A"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/parent/attendance"
              className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <UserCheck className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-xs font-medium text-center">View Attendance</span>
            </a>
            <a
              href="/parent/grades"
              className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Award className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-xs font-medium text-center">Check Grades</span>
            </a>
            <a
              href="/parent/fees"
              className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Wallet className="h-6 w-6 text-orange-600 mb-2" />
              <span className="text-xs font-medium text-center">Pay Fees</span>
            </a>
            <a
              href="/parent/messages"
              className="flex flex-col items-center justify-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <Bell className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-xs font-medium text-center">Messages</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
