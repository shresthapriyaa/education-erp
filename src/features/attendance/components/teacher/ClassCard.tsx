"use client";

import { Users, ChevronRight, BookOpen, Clock, User } from "lucide-react";
import type { ClassItem } from "../../hooks/useTeacherAttendance";

interface Props {
  cls:      ClassItem;
  onSelect: (cls: ClassItem) => void;
}

export default function ClassCard({ cls, onSelect }: Props) {
  // Get unique subjects from schedules
  const subjects = cls.schedules
    ? [...new Set(cls.schedules.map(s => s.subject.name))].slice(0, 3)
    : [];

  // Get today's schedule if available
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  const todaySchedule = cls.schedules?.find(s => s.day === today);

  return (
    <div
      onClick={() => onSelect(cls)}
      className="group bg-white border-2 border-gray-200 rounded-xl p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-400"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-black mb-2">
            {cls.name}
          </h3>
          
          {/* Teacher Name */}
          {cls.teacher && (
            <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-3">
              <User size={12} className="text-gray-400" />
              <span>{cls.teacher.username}</span>
            </div>
          )}

          {/* Info Row */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-sm font-medium text-gray-700">
                {cls._count.students} students
              </span>
            </div>

            {subjects.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-600">
                  {subjects.join(", ")}
                </span>
              </div>
            )}
          </div>

          {todaySchedule && (
            <div className="mt-3 flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg w-fit">
              <Clock size={12} className="text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">
                Today at {new Date(todaySchedule.startTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            </div>
          )}
        </div>

        {/* Arrow Button */}
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-black text-white group-hover:bg-gray-800 transition-colors duration-200">
          <ChevronRight size={20} />
        </div>
      </div>
    </div>
  );
}
