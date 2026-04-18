"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Users, Mail, Phone, UserCheck, Award, Bell } from "lucide-react";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Child {
  id: string;
  username: string;
  email: string | null;
  phone: string | null;
  class: {
    name: string;
  } | null;
  img: string | null;
}

export default function ChildrenPage() {
  const { data: session } = useSession();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildren();
  }, [session]);

  async function loadChildren() {
    setLoading(true);
    try {
      if (!session?.user?.email) return;

      // Get current parent
      const parentRes = await fetch(`/api/parents?email=${session.user.email}`);
      const parentData = await parentRes.json();
      const parents = Array.isArray(parentData) ? parentData : [];
      
      if (parents.length === 0) {
        setLoading(false);
        return;
      }

      const currentParent = parents[0];

      // Fetch children filtered by parentId
      const res = await fetch(`/api/students?parentId=${currentParent.id}`);
      const data = await res.json();
      const childrenArray = Array.isArray(data) ? data : (data.students || []);
      setChildren(childrenArray);
    } catch (error) {
      console.error("Failed to load children:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">My Children</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage your children's information.</p>
      </div>

      {children.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No children found</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pr-4">
            {children.map((child) => (
              <Card key={child.id} className="hover:shadow-lg transition-all duration-300 border">
                <CardContent className="p-4">
                  {/* Child Profile - Compact */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full shrink-0">
                      {child.img ? (
                        <img 
                          src={child.img} 
                          alt={child.username || "Child"} 
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

                  {/* Contact Information - Compact */}
                  {(child.email || child.phone) && (
                    <div className="space-y-1 mb-3 pb-3 border-b">
                      {child.email && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Mail className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground truncate">{child.email}</span>
                        </div>
                      )}
                      {child.phone && (
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="h-3 w-3 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">{child.phone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quick Actions - Compact */}
                  <div className="space-y-1.5">
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
        </ScrollArea>
      )}
    </div>
  );
}
