import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  availableDates: string[]; // ISO date strings
  selectedDate: string;
  onSelect: (date: string) => void;
}

const Calendar: React.FC<CalendarProps> = ({ availableDates, selectedDate, onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const availableDateMap = new Set(availableDates.map(d => new Date(d).toISOString().split('T')[0]));
  const selectedStr = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : '';

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i, 12, 0, 0); // avoid timezone shifts
    const dateStr = d.toISOString().split('T')[0];
    const isAvailable = availableDateMap.has(dateStr);
    const isSelected = selectedStr === dateStr;

    days.push(
      <button
        key={dateStr}
        disabled={!isAvailable}
        onClick={() => isAvailable && onSelect(dateStr)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
          isSelected 
            ? 'bg-tan text-richBlack scale-110 shadow-md' 
            : isAvailable 
              ? 'text-white hover:bg-white/10 hover:text-tan cursor-pointer' 
              : 'text-gray-600 cursor-not-allowed opacity-50'
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="bg-black/20 border border-white/10 rounded-2xl p-4 w-full max-w-sm mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <div className="text-white font-semibold">
          {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={nextMonth} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {days}
      </div>
    </div>
  );
};

export default Calendar;
