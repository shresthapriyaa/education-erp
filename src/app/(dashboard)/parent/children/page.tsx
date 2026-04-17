"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Users, Mail, Phone } from "lucide-react";
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
            {children.map((child) => (
              <Card key={child.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      {child.img ? (
                        <img src={child.img} alt={child.username || "Child"} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-blue-600">
                          {child.username?.charAt(0)?.toUpperCase() || "?"}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base text-black">
                        {child.username || "Unknown"}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        Class: {child.class?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {child.email && (
                    <div className="flex items-center gap-2 text-xs">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{child.email}</span>
                    </div>
                  )}
                  {child.phone && (
                    <div className="flex items-center gap-2 text-xs">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{child.phone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
