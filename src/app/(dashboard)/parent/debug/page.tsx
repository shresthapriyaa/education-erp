"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";

export default function DebugPage() {
  const { data: session } = useSession();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    loadDebugInfo();
  }, [session]);

  async function loadDebugInfo() {
    if (!session?.user?.email) return;

    try {
      // Get parent info
      const parentRes = await fetch(`/api/parents?email=${session.user.email}`);
      const parentData = await parentRes.json();
      
      const parent = Array.isArray(parentData) ? parentData[0] : null;
      
      if (!parent) {
        setDebugInfo({ error: "Parent not found" });
        return;
      }

      // Get students
      const studentsRes = await fetch(`/api/students?parentId=${parent.id}`);
      const studentsData = await studentsRes.json();

      // Get ALL students to compare
      const allStudentsRes = await fetch(`/api/students`);
      const allStudentsData = await allStudentsRes.json();

      setDebugInfo({
        sessionEmail: session.user.email,
        parent: parent,
        studentsForThisParent: studentsData,
        allStudents: allStudentsData,
        studentsWithThisParentId: allStudentsData.students?.filter((s: any) => s.parentId === parent.id) || [],
      });
    } catch (error) {
      setDebugInfo({ error: String(error) });
    }
  }

  if (!debugInfo) {
    return <div className="p-6">Loading debug info...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto bg-gray-100 p-4 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Session Email:</strong> {debugInfo.sessionEmail}</p>
          <p><strong>Parent ID:</strong> {debugInfo.parent?.id}</p>
          <p><strong>Parent Username:</strong> {debugInfo.parent?.username}</p>
          <p><strong>Students returned by API with parentId filter:</strong> {debugInfo.studentsForThisParent?.students?.length || debugInfo.studentsForThisParent?.length || 0}</p>
          <p><strong>Students with matching parentId in all students:</strong> {debugInfo.studentsWithThisParentId?.length || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}
