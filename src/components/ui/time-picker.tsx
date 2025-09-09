import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner une heure",
  className,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value ? parseInt(value.split(':')[0]) : 12);
  const [selectedMinute, setSelectedMinute] = useState(value ? parseInt(value.split(':')[1]) : 0);
  const [inputValue, setInputValue] = useState(value || '');
  const [isHolding, setIsHolding] = useState(false);
  const [holdDirection, setHoldDirection] = useState<'up' | 'down' | null>(null);
  const [holdType, setHoldType] = useState<'hour' | 'minute' | null>(null);
  
  const pickerRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      const [hour, minute] = value.split(':').map(Number);
      setSelectedHour(hour);
      setSelectedMinute(minute);
      setInputValue(value);
    }
  }, [value]);

  const handleTimeSelect = () => {
    const timeString = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    setInputValue(timeString);
    onChange(timeString);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    // Parse the input value and update if valid
    const match = inputValue.match(/^(\d{1,2}):(\d{2})$/);
    if (match) {
      const [, hour, minute] = match;
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      if (hourNum >= 0 && hourNum <= 23 && minuteNum >= 0 && minuteNum <= 59) {
        setSelectedHour(hourNum);
        setSelectedMinute(minuteNum);
        onChange(inputValue);
      }
    }
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const incrementHour = () => {
    setSelectedHour(prev => (prev + 1) % 24);
  };

  const decrementHour = () => {
    setSelectedHour(prev => prev === 0 ? 23 : prev - 1);
  };

  const incrementMinute = () => {
    setSelectedMinute(prev => (prev + 1) % 60);
  };

  const decrementMinute = () => {
    setSelectedMinute(prev => prev === 0 ? 59 : prev - 1);
  };

  const handleWheel = (e: React.WheelEvent, type: 'hour' | 'minute') => {
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'hour') {
      if (e.deltaY > 0) {
        incrementHour();
      } else {
        decrementHour();
      }
    } else {
      if (e.deltaY > 0) {
        incrementMinute();
      } else {
        decrementMinute();
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent, type: 'hour' | 'minute') => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    
    element.setAttribute('data-touch-start', touch.clientY.toString());
    element.setAttribute('data-touch-type', type);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLElement;
    const touchStart = element.getAttribute('data-touch-start');
    const touchType = element.getAttribute('data-touch-type');
    
    if (touchStart && touchType) {
      const startY = parseInt(touchStart);
      const currentY = touch.clientY;
      const deltaY = startY - currentY;
      
      // Sensibilité du défilement (ajustez cette valeur selon vos préférences)
      const sensitivity = 3;
      
      if (Math.abs(deltaY) > sensitivity) {
        if (touchType === 'hour') {
          if (deltaY > 0) {
            incrementHour();
          } else {
            decrementHour();
          }
        } else {
          if (deltaY > 0) {
            incrementMinute();
          } else {
            decrementMinute();
          }
        }
        
        // Mettre à jour la position de départ pour un défilement continu
        element.setAttribute('data-touch-start', currentY.toString());
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.currentTarget as HTMLElement;
    element.removeAttribute('data-touch-start');
    element.removeAttribute('data-touch-type');
  };

  const startHold = (direction: 'up' | 'down', type: 'hour' | 'minute') => {
    setIsHolding(true);
    setHoldDirection(direction);
    setHoldType(type);
    
    // Première action immédiate
    if (direction === 'up') {
      if (type === 'hour') incrementHour();
      else incrementMinute();
    } else {
      if (type === 'hour') decrementHour();
      else decrementMinute();
    }
    
    // Démarrer l'intervalle pour les actions continues
    holdIntervalRef.current = setInterval(() => {
      if (direction === 'up') {
        if (type === 'hour') incrementHour();
        else incrementMinute();
      } else {
        if (type === 'hour') decrementHour();
        else decrementMinute();
      }
    }, 100); // 100ms = 10 changements par seconde
  };

  const stopHold = () => {
    setIsHolding(false);
    setHoldDirection(null);
    setHoldType(null);
    
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  const handleMouseDown = (direction: 'up' | 'down', type: 'hour' | 'minute') => {
    startHold(direction, type);
  };

  const handleMouseUp = () => {
    stopHold();
  };

  const handleMouseLeave = () => {
    stopHold();
  };

  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0');
  };

  const formatMinute = (minute: number) => {
    return minute.toString().padStart(2, '0');
  };

  // Cleanup des intervalles quand le composant se démonte
  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      {/* Input field */}
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
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
        
        {/* Clock icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Clock size={18} />
        </div>
      </div>

      {/* Time picker dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 z-50">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-lg font-semibold text-gray-900">
              Sélectionner l'heure
            </div>
          </div>

          {/* Time selector */}
          <div className="flex items-center justify-center space-x-8 mb-6">
            {/* Hours */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">Heures</div>
              <div className="flex flex-col items-center space-y-2">
                <button
                  onMouseDown={() => handleMouseDown('up', 'hour')}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={() => handleMouseDown('up', 'hour')}
                  onTouchEnd={handleMouseUp}
                  className={cn(
                    "p-2 rounded-full hover:bg-gray-100 transition-colors",
                    isHolding && holdDirection === 'up' && holdType === 'hour' && "bg-blue-100 ring-2 ring-blue-300"
                  )}
                  type="button"
                >
                  <ChevronUp size={20} className="text-gray-600" />
                </button>
                
                <div 
                  ref={hourRef}
                  onWheel={(e) => handleWheel(e, 'hour')}
                  onTouchStart={(e) => handleTouchStart(e, 'hour')}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="text-3xl font-bold text-gray-900 w-16 h-16 flex items-center justify-center select-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  title="Utilisez la molette de souris ou glissez avec le doigt"
                  style={{ touchAction: 'none' }}
                >
                  {formatHour(selectedHour)}
                </div>
                
                <button
                  onMouseDown={() => handleMouseDown('down', 'hour')}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={() => handleMouseDown('down', 'hour')}
                  onTouchEnd={handleMouseUp}
                  className={cn(
                    "p-2 rounded-full hover:bg-gray-100 transition-colors",
                    isHolding && holdDirection === 'down' && holdType === 'hour' && "bg-blue-100 ring-2 ring-blue-300"
                  )}
                  type="button"
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Separator */}
            <div className="text-3xl font-bold text-gray-300">:</div>

            {/* Minutes */}
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">Minutes</div>
              <div className="flex flex-col items-center space-y-2">
                <button
                  onMouseDown={() => handleMouseDown('up', 'minute')}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={() => handleMouseDown('up', 'minute')}
                  onTouchEnd={handleMouseUp}
                  className={cn(
                    "p-2 rounded-full hover:bg-gray-100 transition-colors",
                    isHolding && holdDirection === 'up' && holdType === 'minute' && "bg-blue-100 ring-2 ring-blue-300"
                  )}
                  type="button"
                >
                  <ChevronUp size={20} className="text-gray-600" />
                </button>
                
                <div 
                  ref={minuteRef}
                  onWheel={(e) => handleWheel(e, 'minute')}
                  onTouchStart={(e) => handleTouchStart(e, 'minute')}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="text-3xl font-bold text-gray-900 w-16 h-16 flex items-center justify-center select-none cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  title="Utilisez la molette de souris ou glissez avec le doigt"
                  style={{ touchAction: 'none' }}
                >
                  {formatMinute(selectedMinute)}
                </div>
                
                <button
                  onMouseDown={() => handleMouseDown('down', 'minute')}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={() => handleMouseDown('down', 'minute')}
                  onTouchEnd={handleMouseUp}
                  className={cn(
                    "p-2 rounded-full hover:bg-gray-100 transition-colors",
                    isHolding && holdDirection === 'down' && holdType === 'minute' && "bg-blue-100 ring-2 ring-blue-300"
                  )}
                  type="button"
                >
                  <ChevronDown size={20} className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center mb-4">
            <p className="text-xs text-gray-500">
              💡 Maintenez enfoncé pour un défilement rapide, ou utilisez la molette de souris
            </p>
          </div>

          {/* Confirm button */}
          <button
            onClick={handleTimeSelect}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            type="button"
          >
            Confirmer
          </button>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
