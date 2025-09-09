import React, { useState } from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import DatePicker from './ui/date-picker';
import TimePicker from './ui/time-picker';
import Autocomplete from './ui/autocomplete';
import { cities } from '../lib/cities';

interface BirthData {
  date: string;
  time: string;
  place: string;
}

interface BirthFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading?: boolean;
}

const BirthForm = ({ onSubmit, isLoading = false }: BirthFormProps) => {
  const [formData, setFormData] = useState<BirthData>({
    date: '',
    time: '',
    place: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.date && formData.time && formData.place) {
      onSubmit(formData);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (date) {
      // Utiliser une méthode qui préserve la date locale sans conversion UTC
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      setFormData(prev => ({ ...prev, date: dateString }));
    } else {
      setFormData(prev => ({ ...prev, date: '' }));
    }
  };

  const handleTimeChange = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };

  const handlePlaceChange = (place: string) => {
    setFormData(prev => ({ ...prev, place }));
  };

  const isFormValid = formData.date && formData.time && formData.place;

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date de naissance */}
        <div className="space-y-2">
          <Label htmlFor="birth-date" className="text-sm font-medium text-gray-700">
            Date de naissance
          </Label>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="JJ/MM/AAAA"
            className="w-full"
          />
        </div>

        {/* Heure de naissance */}
        <div className="space-y-2">
          <Label htmlFor="birth-time" className="text-sm font-medium text-gray-700">
            Heure de naissance
          </Label>
          <TimePicker
            value={formData.time}
            onChange={handleTimeChange}
            placeholder="HH:MM"
            className="w-full"
          />
        </div>

        {/* Lieu de naissance */}
        <div className="space-y-2">
          <Label htmlFor="birth-place" className="text-sm font-medium text-gray-700">
            Lieu de naissance
          </Label>
          <Autocomplete
            value={formData.place}
            onChange={handlePlaceChange}
            placeholder="Rechercher une ville..."
            options={cities}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Calcul en cours...</span>
            </div>
          ) : (
            'Voir les coordonnées'
          )}
        </Button>
      </form>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center mt-6 leading-relaxed">
        <em>Les calculs précis seront activés via API. Pour l'instant, aperçu démonstratif.</em>
      </p>
    </div>
  );
};

export default BirthForm;
