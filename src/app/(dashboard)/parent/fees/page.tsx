"use client";

import { useState, useEffect } from "react";
import { ChildSelector } from "@/features/parents/components/ChildSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Wallet, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";
import { ScrollArea } from "@/core/components/ui/scroll-area";

interface Child {
  id: string;
  username: string;
  email: string;
  class: { name: string } | null;
  img: string | null;
}

interface Fee {
  id: string;
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
  remarks: string | null;
}

export default function ParentFeesPage() {
  const [selectedChild, setSelectedChild] = useState<{ email: string; data: Child } | null>(null);
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChild?.email) {
      loadFees();
    }
  }, [selectedChild]);

  async function loadFees() {
    if (!selectedChild?.email) return;
    
    setLoading(true);
    try {
      // Get student by email first
      const studentRes = await fetch(`/api/students?email=${selectedChild.email}`);
      const studentData = await studentRes.json();
      const students = studentData.students || [];
      
      if (students.length > 0) {
        const studentId = students[0].id;
        
        // Fetch fees for this student
        const res = await fetch(`/api/fees?studentId=${studentId}`);
        if (res.ok) {
          const data = await res.json();
          setFees(Array.isArray(data) ? data : []);
        }
      }
    } catch (error) {
      console.error("Failed to load fees:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800 border-green-300";
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "OVERDUE": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const totalPending = fees
    .filter(f => f.status === "PENDING" || f.status === "OVERDUE")
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div className="space-y-4">
      <ChildSelector
        onChildSelect={(email, data) => setSelectedChild({ email, data })}
        selectedChildEmail={selectedChild?.email}
      />
      
      {selectedChild && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Viewing fees for:</span> {selectedChild.data.username}
            {selectedChild.data.class && <span className="ml-2">({selectedChild.data.class.name})</span>}
          </p>
        </div>
      )}

      {!selectedChild ? (
        <div className="text-center py-10 text-muted-foreground">
          Please select a child to view their fees
        </div>
      ) : loading ? (
        <div className="space-y-6">
          <div className="h-12 bg-muted animate-pulse rounded" />
          <div className="h-96 bg-muted animate-pulse rounded" />
        </div>
      ) : (
        <>
          {totalPending > 0 && (
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-900 text-sm">Pending Payment</p>
                    <p className="text-xs text-orange-700">Total: ${totalPending.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {fees.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center text-muted-foreground">
                <Wallet className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No fee records found</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-4">
                {fees.map((fee) => (
                  <Card key={fee.id} className="hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-bold text-black">
                          ${fee.amount.toFixed(2)}
                        </CardTitle>
                        <Badge className={`${getStatusColor(fee.status)} border text-xs`}>
                          {fee.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Due:</span>
                        <span className="text-black font-medium">
                          {new Date(fee.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {fee.paidDate && (
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3 w-3 text-green-600" />
                          <span className="text-muted-foreground">Paid:</span>
                          <span className="text-black font-medium">
                            {new Date(fee.paidDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {fee.remarks && (
                        <p className="text-xs text-muted-foreground pt-2 border-t">
                          {fee.remarks}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </>
      )}
    </div>
  );
}
