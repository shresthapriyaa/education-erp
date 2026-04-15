import { NextResponse } from "next/server";
import prisma from "@/core/lib/prisma";

export async function GET() {
  try {
    // Get date range for last 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6);

    // Fetch attendance records for last 7 days
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      select: {
        date: true,
        status: true,
      },
    });

    // Group by date and count statuses
    const dailyStats = new Map<string, { present: number; absent: number; late: number }>();
    
    // Initialize all 7 days with zero counts
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyStats.set(dateStr, { present: 0, absent: 0, late: 0 });
    }

    // Count attendance by status for each day
    attendanceRecords.forEach((record) => {
      const dateStr = new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const stats = dailyStats.get(dateStr);
      if (stats) {
        if (record.status === "PRESENT") stats.present++;
        else if (record.status === "ABSENT") stats.absent++;
        else if (record.status === "LATE") stats.late++;
      }
    });

    // Calculate overall attendance rate
    const totalPresent = attendanceRecords.filter((r) => r.status === "PRESENT").length;
    const totalLate = attendanceRecords.filter((r) => r.status === "LATE").length;
    const totalRecords = attendanceRecords.length;
    const attendanceRate = totalRecords > 0 
      ? Math.round(((totalPresent + totalLate) / totalRecords) * 100) 
      : 0;

    // Calculate trend (compare last 3 days vs previous 4 days)
    const allDays = Array.from(dailyStats.values());
    const last3Days = allDays.slice(-3);
    const prev4Days = allDays.slice(0, 4);
    
    const last3Rate = last3Days.reduce((sum, d) => sum + d.present + d.late, 0) / 
                      Math.max(1, last3Days.reduce((sum, d) => sum + d.present + d.absent + d.late, 0));
    const prev4Rate = prev4Days.reduce((sum, d) => sum + d.present + d.late, 0) / 
                      Math.max(1, prev4Days.reduce((sum, d) => sum + d.present + d.absent + d.late, 0));
    
    const trend = last3Rate >= prev4Rate ? "up" : "down";

    // Format weekly data
    const weeklyData = Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date,
      present: stats.present,
      absent: stats.absent,
      late: stats.late,
    }));

    return NextResponse.json({
      rate: attendanceRate,
      trend,
      weeklyData,
    });
  } catch (error) {
    console.error("[ATTENDANCE_STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance stats" },
      { status: 500 }
    );
  }
}
