import React, { useState, useEffect } from 'react';
import { cities, getCityCoordinates } from '../lib/cities';
import { convertLocalToUTCSimple } from '../lib/timezone-utils';
import { prepareDataForMicroservice } from '../lib/timezone-test';

export default function TimezoneTest() {
  const [selectedCity, setSelectedCity] = useState('Neuilly-sur-Seine, France');
  const [localTime, setLocalTime] = useState('11:00');
  const [date, setDate] = useState('2002-10-03');
  const [result, setResult] = useState<any>(null);

  const testConversion = () => {
    try {
      const city = getCityCoordinates(selectedCity);
      if (!city) {
        setResult({ error: 'Ville non trouvée' });
        return;
      }

      const conversionResult = convertLocalToUTCSimple(localTime, date, city);
      const microserviceData = prepareDataForMicroservice(localTime, date, selectedCity);
      
      setResult({
        city: city.name,
        timezone: city.timezone,
        localTime,
        date,
        conversion: conversionResult,
        microserviceData
      });
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  useEffect(() => {
    testConversion();
  }, [selectedCity, localTime, date]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🧪 Test de Conversion Timezone
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6">Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Ville
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {cities.slice(0, 20).map((city) => (
                  <option key={city.name} value={city.name} className="text-gray-800">
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Heure locale
              </label>
              <input
                type="time"
                value={localTime}
                onChange={(e) => setLocalTime(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">Résultats</h2>
            
            {result.error ? (
              <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
                ❌ {result.error}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">📍 Ville</h3>
                    <p className="text-gray-300">{result.city}</p>
                    <p className="text-gray-300">🌍 {result.timezone}</p>
                  </div>
                  
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">🕐 Heure</h3>
                    <p className="text-gray-300">Locale: {result.localTime}</p>
                    <p className="text-gray-300">Date: {result.date}</p>
                  </div>
                </div>

                {/* Conversion */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">🔄 Conversion</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Heure UTC</p>
                      <p className="text-white text-xl font-mono">{result.conversion.utcTime}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Offset</p>
                      <p className="text-white text-xl font-mono">{result.conversion.offsetHours}h</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Timezone</p>
                      <p className="text-white text-lg">{result.conversion.timezone}</p>
                    </div>
                  </div>
                </div>

                {/* Données pour le microservice */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">🚀 Données pour le microservice</h3>
                  <pre className="text-gray-300 text-sm overflow-x-auto">
                    {JSON.stringify(result.microserviceData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
