"use client";

import { useState } from "react";
import { ChildSelector } from "@/features/parents/components/ChildSelector";
import StudentGrades from "@/features/students/components/StudentGrades";

interface Child {
  id: string;
  username: string;
  email: string;
  class: { name: string } | null;
  img: string | null;
}

export default function ParentGradesPage() {
  const [selectedChild, setSelectedChild] = useState<{ email: string; data: Child } | null>(null);

  return (
    <div className="space-y-4">
      <ChildSelector
        onChildSelect={(email, data) => setSelectedChild({ email, data })}
        selectedChildEmail={selectedChild?.email}
      />
      
      {selectedChild && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Viewing grades for:</span> {selectedChild.data.username}
            {selectedChild.data.class && <span className="ml-2">({selectedChild.data.class.name})</span>}
          </p>
        </div>
      )}

      {selectedChild ? (
        <StudentGrades studentEmail={selectedChild.email} />
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          Please select a child to view their grades
        </div>
      )}
    </div>
  );
}
