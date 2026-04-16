"use client";

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Wallet, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/core/components/ui/badge";

interface Fee {
  id: string;
  amount: number;
  status: string;
  dueDate: string;
  paidDate: string | null;
  student: {
    name: string;
  };
  createdAt: string;
}

const FeesPage = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    setLoading(true);
    try {
      const res = await fetch("/api/fees");
      if (res.ok) {
        const data = await res.json();
        setFees(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load fees:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    if (status === "PAID") return "bg-green-100 text-green-700 border-green-200";
    if (status === "PENDING") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (status === "OVERDUE") return "bg-red-100 text-red-700 border-red-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status: string) => {
    if (status === "PAID") return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (status === "PENDING") return <Clock className="h-4 w-4 text-yellow-600" />;
    if (status === "OVERDUE") return <XCircle className="h-4 w-4 text-red-600" />;
    return <Clock className="h-4 w-4 text-gray-600" />;
  };

  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = fees.filter(f => f.status === "PAID").reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

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
        <h1 className="text-2xl font-bold text-black">Fee Management</h1>
        <p className="text-sm text-muted-foreground mt-1">View your fee status and payment history.</p>
      </div>

      {/* Summary Cards */}
      {fees.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">Total Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-black">${totalAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">${paidAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-normal">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">${pendingAmount.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fee Records */}
      {fees.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Wallet className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No fee records available</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-350px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
            {fees.map((fee) => (
              <Card key={fee.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(fee.status)}
                      <CardTitle className="text-base text-black">Fee Payment</CardTitle>
                    </div>
                    <Badge className={`${getStatusColor(fee.status)} border shrink-0 text-xs`}>
                      {fee.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount:</span>
                    <span className="text-xl font-bold text-black">${fee.amount.toFixed(2)}</span>
                  </div>
                  <div className="pt-2 border-t space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="text-black font-medium">
                        {new Date(fee.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    {fee.paidDate && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Paid On:</span>
                        <span className="text-green-600 font-medium">
                          {new Date(fee.paidDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
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

export default FeesPage;
