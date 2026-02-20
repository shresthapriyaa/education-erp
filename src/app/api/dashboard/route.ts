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