"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/core/components/ui/avatar";
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

interface ParentInfo {
  username: string;
  img: string | null;
}

export default function ParentDashboard() {
  const { data: session } = useSession();
  const [children, setChildren] = useState<Child[]>([]);
  const [parentInfo, setParentInfo] = useState<ParentInfo | null>(null);
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

      // Set parent info
      setParentInfo({
        username: currentParent.username || session.user.name || "Parent",
        img: currentParent.img || null,
      });

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
      {/* Header with Profile Photo */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary shadow-lg">
          {parentInfo?.img && (
            <AvatarImage 
              src={parentInfo.img} 
              alt={parentInfo.username}
              className="object-cover"
            />
          )}
          <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {(parentInfo?.username || session?.user?.name || "P").substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-black">
            Welcome back, {parentInfo?.username || session?.user?.name || "Parent"}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your children's academic progress and activities.
          </p>
        </div>
      </div>

      {/* Stats Cards with Pop Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                My Children
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-black">{stats.totalChildren}</p>
            <p className="text-xs text-muted-foreground mt-1">Total enrolled</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance Rate
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.attendanceRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Average across children</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Fees
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Wallet className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">${stats.pendingFees}</p>
            <p className="text-xs text-muted-foreground mt-1">Outstanding balance</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl hover:scale-105 transition-all duration-300 border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Upcoming Exams
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{stats.upcomingExams}</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Children Cards - Compact Design */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">My Children</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Quick access to each child's information
          </p>
        </CardHeader>
        <CardContent>
          {children.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No children found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {children.map((child) => (
                <Card 
                  key={child.id} 
                  className="hover:shadow-lg transition-all duration-300 border"
                >
                  <CardContent className="p-4">
                    {/* Child Profile - Compact */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full shrink-0">
                        {child.img ? (
                          <img 
                            src={child.img} 
                            alt={child.username} 
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" 
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-blue-100">
                            <span className="text-lg font-bold text-white">
                              {child.username?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-black truncate">
                          {child.username || "Unknown"}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {child.class?.name || "No class"}
                        </p>
                      </div>
                    </div>

                    {/* Quick Actions - Compact */}
                    <div className="space-y-1.5 pt-3 border-t">
                      <a
                        href={`/parent/attendance?childEmail=${encodeURIComponent(child.username)}`}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-green-50 transition-colors group"
                      >
                        <UserCheck className="h-3.5 w-3.5 text-green-600" />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-green-700">
                          Attendance
                        </span>
                      </a>

                      <a
                        href={`/parent/grades?childEmail=${encodeURIComponent(child.username)}`}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-blue-50 transition-colors group"
                      >
                        <Award className="h-3.5 w-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-700">
                          Academic
                        </span>
                      </a>

                      <a
                        href={`/parent/messages?childId=${child.id}`}
                        className="flex items-center gap-2 p-1.5 rounded hover:bg-purple-50 transition-colors group"
                      >
                        <Bell className="h-3.5 w-3.5 text-purple-600" />
                        <span className="text-xs font-medium text-gray-700 group-hover:text-purple-700">
                          Messages
                        </span>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions with Pop Effect */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Access frequently used features
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/parent/attendance"
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 hover:border-green-400 hover:bg-green-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="p-3 bg-green-100 rounded-full mb-2">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-center">View Attendance</span>
            </a>
            <a
              href="/parent/grades"
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="p-3 bg-blue-100 rounded-full mb-2">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-center">Check Grades</span>
            </a>
            <a
              href="/parent/fees"
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 hover:border-orange-400 hover:bg-orange-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="p-3 bg-orange-100 rounded-full mb-2">
                <Wallet className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-center">Pay Fees</span>
            </a>
            <a
              href="/parent/messages"
              className="flex flex-col items-center justify-center p-4 rounded-lg border-2 hover:border-purple-400 hover:bg-purple-50 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="p-3 bg-purple-100 rounded-full mb-2">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-center">Messages</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
