import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  options: string[];
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Rechercher...",
  className,
  disabled = false,
  options
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const filterOptions = (input: string) => {
    if (!input.trim()) {
      setFilteredOptions([]);
      return;
    }

    const filtered = options.filter(option =>
      option.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredOptions(filtered.slice(0, 8)); // Limiter à 8 suggestions
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    filterOptions(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    if (inputValue.trim()) {
      filterOptions(inputValue);
      setIsOpen(true);
    }
  };

  const handleOptionSelect = (option: string) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const clearInput = () => {
    setInputValue('');
    onChange('');
    setFilteredOptions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-white",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "transition-all duration-200 placeholder:text-gray-400",
            "disabled:bg-gray-50 disabled:text-gray-500",
            "pl-12 pr-16", // Plus d'espace à gauche pour la loupe, à droite pour les boutons
            className
          )}
          disabled={disabled}
        />
        
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <Search size={18} />
        </div>
        
        {/* Clear button */}
        {inputValue && (
          <button
            onClick={clearInput}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            type="button"
          >
            ×
          </button>
        )}
        
        {/* Dropdown indicator */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={18} className={cn(
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        </div>
      </div>

      {/* Dropdown suggestions */}
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-64 overflow-y-auto z-50">
          {filteredOptions.map((option, index) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={cn(
                "w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors",
                "flex items-center space-x-3",
                highlightedIndex === index && "bg-blue-50 text-blue-700"
              )}
              type="button"
            >
              <MapPin size={16} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
