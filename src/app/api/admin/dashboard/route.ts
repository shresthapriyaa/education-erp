import { NextResponse } from 'next/server';
import { db } from '@/core/lib/db';


export async function GET() {
  try {
   
    const [teachers, students, parents, accountants] = await Promise.all([
      db.user.count({ where: { role: 'TEACHER' } }),
      db.user.count({ where: { role: 'STUDENT' } }),
      db.user.count({ where: { role: 'PARENT' } }),
      db.user.count({ where: { role: 'ACCOUNTANT' } }),
    ]);


    const [boys, girls] = await Promise.all([
      db.student.count({ where: { sex: 'MALE' } }),
      db.student.count({ where: { sex: 'FEMALE' } }),
    ]);

    // Fetch upcoming events
    const events = await db.event.findMany({
      where: {
        eventDate: {
          gte: new Date(), // Only future and today's events
        },
      },
      orderBy: {
        eventDate: 'asc',
      },
      take: 10, 
      select: {
        id: true,
        title: true,
        description: true,
        eventDate: true,
      },
    });

    const data = {
      stats: {
        teachers,
        students,
        parents,
        accountants,
        studentGender: {
          boys,
          girls,
        },
      },
      events: events.map(event => ({
        id: event.id,
        date: event.eventDate.toISOString(),
        title: event.title,
        description: event.description,
      })),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Dashboard API GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'event') {
     
      const event = await db.event.create({
        data: {
          title: data.title,
          description: data.description,
          eventDate: new Date(data.eventDate),
        },
      });

      return NextResponse.json({
        message: 'Event created successfully',
        event,
      }, { status: 201 });
    } 
    
    else if (type === 'announcement') {
     
      const announcement = await db.announcement.create({
        data: {
          title: data.title,
          content: data.content,
        },
      });

      return NextResponse.json({
        message: 'Announcement created successfully',
        announcement,
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "event" or "announcement"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Dashboard API POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}





// import { NextResponse } from 'next/server';
// import { db } from '@/core/lib/db';

// export async function GET() {
//   try {
//     // ── Today boundaries ─────────────────────────────────────
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     // ── User counts ──────────────────────────────────────────
//     const [teachers, students, parents, accountants] = await Promise.all([
//       db.user.count({ where: { role: 'TEACHER' } }),
//       db.user.count({ where: { role: 'STUDENT' } }),
//       db.user.count({ where: { role: 'PARENT' } }),
//       db.user.count({ where: { role: 'ACCOUNTANT' } }),
//     ]);

//     // ── Gender split ─────────────────────────────────────────
//     const [boys, girls] = await Promise.all([
//       db.student.count({ where: { sex: 'MALE' } }),
//       db.student.count({ where: { sex: 'FEMALE' } }),
//     ]);

//     // ── Today's attendance ───────────────────────────────────
//     const [todayPresent, todayAbsent, todayLate, todayTotal] = await Promise.all([
//       db.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: 'PRESENT' } }),
//       db.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: 'ABSENT' } }),
//       db.attendance.count({ where: { date: { gte: today, lt: tomorrow }, status: 'LATE' } }),
//       db.attendance.count({ where: { date: { gte: today, lt: tomorrow } } }),
//     ]);

//     // ── Weekly trend (last 7 days) ───────────────────────────
//     const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
//     const weeklyTrend = await Promise.all(
//       Array.from({ length: 7 }).map(async (_, i) => {
//         const day = new Date(today);
//         day.setDate(day.getDate() - (6 - i));
//         const nextDay = new Date(day);
//         nextDay.setDate(nextDay.getDate() + 1);

//         const [present, absent, late] = await Promise.all([
//           db.attendance.count({ where: { date: { gte: day, lt: nextDay }, status: 'PRESENT' } }),
//           db.attendance.count({ where: { date: { gte: day, lt: nextDay }, status: 'ABSENT' } }),
//           db.attendance.count({ where: { date: { gte: day, lt: nextDay }, status: 'LATE' } }),
//         ]);

//         return { day: weekDays[day.getDay()], present, absent, late };
//       })
//     );

//     // ── Recent sessions (uses your Session model) ────────────
//     const sessions = await db.session.findMany({
//       where: {
//         date: { gte: today, lt: tomorrow },
//       },
//       include: {
//         class: {
//           include: {
//             teacher: true,
//           },
//         },
//         attendance: true,
//       },
//       orderBy: { startTime: 'desc' },
//       take: 10,
//     });

//     const recentSessions = sessions.map((s) => {
//       const present = s.attendance.filter((a) => a.status === 'PRESENT').length;
//       const total   = s.attendance.length;

//       return {
//         id:        s.id,
//         className: s.class.name,
//         teacher:   s.class.teacher.username,
//         time:      s.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
//         present,
//         total,
//         status:    s.isOpen ? 'active' : 'ended',
//       } as const;
//     });

//     // ── Events ───────────────────────────────────────────────
//     const events = await db.event.findMany({
//       where: { eventDate: { gte: new Date() } },
//       orderBy: { eventDate: 'asc' },
//       take: 10,
//       select: { id: true, title: true, description: true, eventDate: true },
//     });

//     return NextResponse.json({
//       stats: {
//         teachers,
//         students,
//         parents,
//         accountants,
//         studentGender: { boys, girls },
//       },
//       attendance: {
//         todayPresent,
//         todayAbsent,
//         todayLate,
//         todayTotal,
//         weeklyTrend,
//         recentSessions,
//       },
//       events: events.map((e) => ({
//         id:          e.id,
//         date:        e.eventDate.toISOString(),
//         title:       e.title,
//         description: e.description,
//       })),
//     });

//   } catch (error) {
//     console.error('Dashboard API GET error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch dashboard data' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const { type, ...data } = body;

//     if (type === 'event') {
//       const event = await db.event.create({
//         data: {
//           title:       data.title,
//           description: data.description,
//           eventDate:   new Date(data.eventDate),
//         },
//       });
//       return NextResponse.json({ message: 'Event created successfully', event }, { status: 201 });
//     }

//     if (type === 'announcement') {
//       const announcement = await db.announcement.create({
//         data: {
//           title:   data.title,
//           content: data.content,
//         },
//       });
//       return NextResponse.json({ message: 'Announcement created successfully', announcement }, { status: 201 });
//     }

//     return NextResponse.json(
//       { error: 'Invalid type. Use "event" or "announcement"' },
//       { status: 400 }
//     );

//   } catch (error) {
//     console.error('Dashboard API POST error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create item' },
//       { status: 500 }
//     );
//   }
// }