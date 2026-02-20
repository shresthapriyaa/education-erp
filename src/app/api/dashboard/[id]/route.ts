import { NextResponse } from 'next/server';
import { db } from '@/core/lib/db';


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

   
    const eventItem = await db.event.findUnique({
      where: { id },
    });

    if (eventItem) {
      return NextResponse.json({
        type: 'event',
        data: eventItem,
      });
    }

  
    const announcementItem = await db.announcement.findUnique({
      where: { id },
    });

    if (announcementItem) {
      return NextResponse.json({
        type: 'announcement',
        data: announcementItem,
      });
    }

    // If neither found
    return NextResponse.json(
      { error: 'Item not found' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Dashboard [id] GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'event') {
     
      const existingEvent = await db.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }

      
      const updatedEvent = await db.event.update({
        where: { id },
        data: {
          title: data.title,
          description: data.description,
          eventDate: new Date(data.eventDate),
        },
      });

      return NextResponse.json({
        message: 'Event updated successfully',
        event: updatedEvent,
      });
    } 
    
    else if (type === 'announcement') {
     
      const existingAnnouncement = await db.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        return NextResponse.json(
          { error: 'Announcement not found' },
          { status: 404 }
        );
      }

     
      const updatedAnnouncement = await db.announcement.update({
        where: { id },
        data: {
          title: data.title,
          content: data.content,
        },
      });

      return NextResponse.json({
        message: 'Announcement updated successfully',
        announcement: updatedAnnouncement,
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "event" or "announcement"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Dashboard [id] PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'event') {
    
      const existingEvent = await db.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }

     
      const updateData: Record<string, any> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.eventDate !== undefined) updateData.eventDate = new Date(data.eventDate);

 
      const updatedEvent = await db.event.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        message: 'Event updated successfully',
        event: updatedEvent,
      });
    } 
    
    else if (type === 'announcement') {
      
      const existingAnnouncement = await db.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        return NextResponse.json(
          { error: 'Announcement not found' },
          { status: 404 }
        );
      }


      const updateData: Record<string, any> = {};
      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;

      
      const updatedAnnouncement = await db.announcement.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        message: 'Announcement updated successfully',
        announcement: updatedAnnouncement,
      });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "event" or "announcement"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Dashboard [id] PATCH error:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'event') {
     
      const existingEvent = await db.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        return NextResponse.json(
          { error: 'Event not found' },
          { status: 404 }
        );
      }

    
      await db.event.delete({
        where: { id },
      });

      return NextResponse.json({
        message: 'Event deleted successfully',
        id,
      });
    } 
    
    else if (type === 'announcement') {
   
      const existingAnnouncement = await db.announcement.findUnique({
        where: { id },
      });

      if (!existingAnnouncement) {
        return NextResponse.json(
          { error: 'Announcement not found' },
          { status: 404 }
        );
      }

     
      await db.announcement.delete({
        where: { id },
      });

      return NextResponse.json({
        message: 'Announcement deleted successfully',
        id,
      });
    }

    return NextResponse.json(
      { error: 'Type parameter required. Use ?type=event or ?type=announcement' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Dashboard [id] DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}