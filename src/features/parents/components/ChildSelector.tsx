"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Card } from "@/core/components/ui/card";
import { Users } from "lucide-react";

interface Child {
  id: string;
  username: string;
  email: string;
  class: { name: string } | null;
  img: string | null;
}

interface ChildSelectorProps {
  onChildSelect: (childEmail: string, childData: Child) => void;
  selectedChildEmail?: string;
}

export function ChildSelector({ onChildSelect, selectedChildEmail }: ChildSelectorProps) {
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

      // Auto-select first child if none selected
      if (childrenArray.length > 0 && !selectedChildEmail) {
        onChildSelect(childrenArray[0].email, childrenArray[0]);
      }
    } catch (error) {
      console.error("Failed to load children:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Card className="p-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
      </Card>
    );
  }

  if (children.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span className="text-sm">No children found</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Users className="h-5 w-5 text-blue-600 shrink-0" />
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Select Child
          </label>
          <Select
            value={selectedChildEmail || children[0]?.email}
            onValueChange={(email) => {
              const child = children.find((c) => c.email === email);
              if (child) onChildSelect(email, child);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a child" />
            </SelectTrigger>
            <SelectContent>
              {children.map((child) => (
                <SelectItem key={child.id} value={child.email}>
                  <div className="flex items-center gap-2">
                    {child.img ? (
                      <img
                        src={child.img}
                        alt={child.username}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-semibold text-blue-600">
                          {child.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">{child.username}</span>
                      {child.class && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({child.class.name})
                        </span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
