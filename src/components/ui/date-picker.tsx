import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  className,
  disabled = false
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [inputValue, setInputValue] = useState(value ? formatDate(value) : '');
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setInputValue(formatDate(value));
      setCurrentMonth(new Date(value));
    }
  }, [value]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setInputValue(formatDate(date));
    onChange(date);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    // Parse the input value and update if valid
    const parsedDate = parseDateInput(inputValue);
    if (parsedDate) {
      setSelectedDate(parsedDate);
      onChange(parsedDate);
      setCurrentMonth(parsedDate);
    }
  };

  const parseDateInput = (input: string): Date | null => {
    // Parse DD/MM/YYYY format
    const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const [, day, month, year] = match;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (date.getDate() === parseInt(day) && date.getMonth() === parseInt(month) - 1) {
        return date;
      }
    }
    return null;
  };

  const clearDate = () => {
    setSelectedDate(null);
    setInputValue('');
    onChange(null);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToPreviousYear = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear() - 1, prev.getMonth(), 1));
  };

  const goToNextYear = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear() + 1, prev.getMonth(), 1));
  };

  const goToYear = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setViewMode('month');
  };

  const goToMonth = (month: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1));
    setViewMode('month');
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isCurrentMonthDay = isCurrentMonth(date);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(date)}
          className={cn(
            "h-10 w-10 rounded-full text-sm font-medium transition-all duration-200 hover:bg-gray-100 active:scale-95",
            isToday(date) && "bg-blue-100 text-blue-600 font-semibold",
            isSelected(date) && "bg-blue-600 text-white hover:bg-blue-700",
            !isCurrentMonthDay && "text-gray-400",
            isCurrentMonthDay && !isToday(date) && !isSelected(date) && "text-gray-900 hover:bg-gray-100"
          )}
          disabled={disabled}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderYearView = () => {
    const currentYear = currentMonth.getFullYear();
    const years = [];
    
    // Generate years from current year + 10 down to 1900 (inverse order)
    for (let year = new Date().getFullYear() + 10; year >= 1900; year--) {
      years.push(year);
    }

    return (
      <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
        {years.map(year => (
          <button
            key={year}
            onClick={() => goToYear(year)}
            className={cn(
              "py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200",
              year === currentYear 
                ? "bg-blue-600 text-white" 
                : "hover:bg-gray-100 text-gray-700"
            )}
            type="button"
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
      'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
    ];

    return (
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => goToMonth(index)}
            className={cn(
              "py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200",
              index === currentMonth.getMonth()
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-100 text-gray-700"
            )}
            type="button"
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="relative" ref={pickerRef}>
      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200 placeholder:text-gray-400",
            "disabled:bg-gray-50 disabled:text-gray-500",
            className
          )}
          disabled={disabled}
        />
        
        {/* Calendar icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Calendar size={18} />
        </div>
        
        {/* Clear button */}
        {selectedDate && (
          <button
            onClick={clearDate}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            type="button"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={viewMode === 'month' ? goToPreviousMonth : goToPreviousYear}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              type="button"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            
            <div className="text-center">
              <button
                onClick={() => setViewMode(viewMode === 'month' ? 'year' : 'month')}
                className="hover:bg-gray-100 rounded-lg px-3 py-1 transition-colors"
                type="button"
              >
                <div className="text-lg font-semibold text-gray-900">
                  {viewMode === 'month' ? monthNames[currentMonth.getMonth()] : currentMonth.getFullYear()}
                </div>
                <div className="text-sm text-gray-500">
                  {viewMode === 'month' ? currentMonth.getFullYear() : 'Cliquez pour changer'}
                </div>
              </button>
            </div>
            
            <button
              onClick={viewMode === 'month' ? goToNextMonth : goToNextYear}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              type="button"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Navigation rapide */}
          <div className="mb-4 flex space-x-2">
            <button
              onClick={() => setViewMode('year')}
              className={cn(
                "flex-1 py-2 px-3 text-sm rounded-lg transition-colors",
                viewMode === 'year' 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              type="button"
            >
              Année
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={cn(
                "flex-1 py-2 px-3 text-sm rounded-lg transition-colors",
                viewMode === 'month' 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
              type="button"
            >
              Mois
            </button>
          </div>

          {/* Content based on view mode */}
          {viewMode === 'year' ? renderYearView() : (
            <>
              {/* Week days */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
