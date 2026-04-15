# Teacher Portal Features

## Dashboard Overview
The Teacher Portal provides a comprehensive dashboard at `/teacher` with the following capabilities:

## ✅ Implemented Features

### 1. **View Routine** (READ-ONLY)
- **Route**: `/teacher/routine`
- **Description**: Teachers can VIEW their weekly timetable (cannot add/edit/delete)
- **Features**:
  - Day-by-day schedule view
  - Class timings and room information
  - Subject and class details
  - Search and filter functionality
- **Permissions**: VIEW ONLY - No add, edit, or delete buttons

### 2. **Mark Attendance**
- **Route**: `/teacher/attendance`
- **Description**: Take attendance for classes
- **Features**:
  - GPS-based location verification with geofence
  - Mark students as Present, Absent, Late, or Excused
  - Real-time attendance tracking
  - Location accuracy buffer for GPS precision

### 3. **Manage Lessons**
- **Route**: `/teacher/lessons`
- **Description**: Create and manage lesson materials
- **Features**:
  - Create lessons with title and content
  - Upload materials (PDFs, images, videos, documents, links)
  - Publish/unpublish lessons
  - Assign lessons to specific classes and subjects
  - Track published vs draft lessons

### 4. **Upload Assignments**
- **Route**: `/teacher/assignments`
- **Description**: Create and manage assignments for students
- **Features**:
  - Create assignments with title, description, and due date
  - Assign to specific classes and subjects
  - Set total marks
  - Track assignment submissions
  - Grade student work

### 5. **View Students** (READ-ONLY)
- **Route**: `/teacher/students`
- **Description**: View students in assigned classes (cannot add/edit/delete)
- **Features**:
  - View all students in teacher's classes
  - Access student profiles
  - View student information (contact, class, blood group, DOB, etc.)
  - Search and filter students
- **Permissions**: VIEW ONLY - No add, import, or delete buttons

## Teacher Permissions Summary

### ✅ Teachers CAN:
- ✅ View their routine/timetable
- ✅ Mark attendance for their classes
- ✅ Create, edit, and delete lessons
- ✅ Upload and manage assignments
- ✅ View students in their classes

### ❌ Teachers CANNOT:
- ❌ Add new routines
- ❌ Edit existing routines
- ❌ Delete routines
- ❌ Add new students
- ❌ Edit student information
- ❌ Delete students
- ❌ Bulk import students

## Admin-Only Functions

The following functions are restricted to ADMIN role only:
- Add/Edit/Delete Routines
- Add/Edit/Delete Students
- Add/Edit/Delete Teachers
- Add/Edit/Delete Classes
- Add/Edit/Delete Subjects
- Manage Schools and Geofencing
- System configuration

## Dashboard Statistics

The teacher dashboard displays:
- **Classes Today**: Number of scheduled classes for the current day
- **Total Lessons**: Count of all lessons created
- **Published Lessons**: Number of published lessons
- **Draft Lessons**: Number of unpublished lessons

## Today's Classes Section

Shows a detailed view of today's scheduled classes with:
- Subject name with color-coded badges
- Class name
- Time range (start - end)
- Room location
- Quick "Attend" button to mark attendance

## Quick Actions

Five quick action cards for easy navigation:
1. **Mark Attendance** - Take attendance for classes
2. **View Routine** - See weekly timetable (read-only)
3. **Lessons** - Manage lesson materials
4. **Assignments** - Upload and manage assignments
5. **View Students** - See class students (read-only)

## Technical Implementation

### Routes Structure
```
src/app/(dashboard)/teacher/
├── page.tsx              # Main dashboard
├── attendance/           # Attendance marking
├── routine/              # Weekly timetable (read-only)
├── lessons/              # Lesson management
├── assignments/          # Assignment management
└── students/             # Student viewing (read-only)
```

### Read-Only Implementation
- `RoutineTable` component supports `readOnly` prop
- `TeacherStudentTable` component supports `readOnly` prop
- When `readOnly={true}`:
  - Add/Edit/Delete buttons are hidden
  - Action handlers are optional
  - Dialogs are not rendered
  - Table columns adjust automatically

### Key Features
- Session-based authentication
- Real-time data fetching with React hooks
- Responsive design for mobile and desktop
- Loading states with skeletons
- Color-coded subject badges
- Time formatting (12-hour format)
- Greeting based on time of day

## User Experience

- Clean, modern UI with card-based layout
- Consistent color scheme across features
- Icon-based navigation
- Hover effects and transitions
- Empty states with helpful messages
- Loading indicators for async operations
- Clear permission boundaries (read-only vs editable)

## Access Control

- Only accessible to users with TEACHER role
- Teachers can only see their own classes and students
- Location-based verification for attendance marking
- Secure file uploads for lesson materials
- Read-only access to routines and student lists
- Full control over lessons and assignments

## Security Notes

- Teachers cannot modify system data (routines, students)
- Teachers can only mark attendance for their assigned classes
- GPS verification prevents attendance fraud
- File uploads are validated and sanitized
- All API endpoints check user role and permissions
