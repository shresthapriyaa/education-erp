"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChildSelector } from "@/features/parents/components/ChildSelector";
import StudentAttendance from "@/features/students/components/StudentAttendance";
import { Card } from "@/core/components/ui/card";
import { User } from "lucide-react";

interface Child {
  id: string;
  username: string;
  email: string;
  class: { name: string } | null;
  img: string | null;
}

export default function ParentAttendancePage() {
  const searchParams = useSearchParams();
  const childEmailParam = searchParams.get("childEmail");
  const [selectedChild, setSelectedChild] = useState<{ email: string; data: Child } | null>(null);
  const [children, setChildren] = useState<Child[]>([]);

  // Load children and auto-select if URL parameter exists
  useEffect(() => {
    if (childEmailParam && children.length > 0) {
      const child = children.find(c => c.username === childEmailParam || c.email === childEmailParam);
      if (child) {
        setSelectedChild({ email: child.email, data: child });
      }
    }
  }, [childEmailParam, children]);

  const handleChildrenLoaded = (loadedChildren: Child[]) => {
    setChildren(loadedChildren);
  };

  return (
    <div className="space-y-6">
      {/* Simple Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your child's attendance records
        </p>
      </div>

      {/* Child Selector */}
      <ChildSelector
        onChildSelect={(email, data) => setSelectedChild({ email, data })}
        selectedChildEmail={selectedChild?.email}
        onChildrenLoaded={handleChildrenLoaded}
      />
      
      {/* Selected Child Info */}
      {selectedChild && (
        <Card className="border border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-4">
              {selectedChild.data.img ? (
                <img
                  src={selectedChild.data.img}
                  alt={selectedChild.data.username}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="text-lg font-semibold text-gray-600">
                    {selectedChild.data.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedChild.data.username}
                </h3>
                {selectedChild.data.class && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedChild.data.class.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Attendance Content */}
      {selectedChild ? (
        <div className="[&>div>div:first-child]:hidden">
          <StudentAttendance studentEmail={selectedChild.email} />
        </div>
      ) : (
        <Card className="border border-gray-200">
          <div className="text-center py-16">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">
              Select a child to view their attendance
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
