import React from 'react';
import { PlanetaryPosition } from '../lib/jpl-horizons';

interface BirthData {
  date: string;
  time: string;
  place: string;
}

interface TableauPlanetesProps {
  planetaryData: PlanetaryPosition[];
  birthData?: BirthData | null;
}

const TableauPlanetes = ({ planetaryData, birthData }: TableauPlanetesProps) => {
  // Fonction pour obtenir le signe astrologique
  const getZodiacSign = (longitude: number): string => {
    const signs = [
      'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
      'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
    ];
    
    // Normaliser la longitude entre 0 et 360
    const normalizedLongitude = ((longitude % 360) + 360) % 360;
    
    // Calculer l'index du signe (chaque signe fait 30°)
    const signIndex = Math.floor(normalizedLongitude / 30);
    
    // Calculer les degrés dans le signe
    const degreesInSign = Math.floor(normalizedLongitude % 30);
    const minutesInSign = Math.floor((normalizedLongitude % 30 - degreesInSign) * 60);
    
    const sign = signs[signIndex] || 'Inconnu';
    
    return `${degreesInSign + 1}° ${minutesInSign}' ${sign}`;
  };

  // Fonction pour formater la longitude
  const formatLongitude = (longitude: number): string => {
    const degrees = Math.floor(longitude);
    const minutes = Math.floor((longitude - degrees) * 60);
    const seconds = Math.floor(((longitude - degrees) * 60 - minutes) * 60);
    return `${degrees}° ${minutes}' ${seconds}"`;
  };

  // Noms et symboles des planètes (toutes les planètes possibles)
  const planetInfo = {
    '10': { name: 'Soleil', symbol: '☉' },
    '301': { name: 'Lune', symbol: '☽' },
    '199': { name: 'Mercure', symbol: '☿' },
    '299': { name: 'Vénus', symbol: '♀' },
    '499': { name: 'Mars', symbol: '♂' },
    '599': { name: 'Jupiter', symbol: '♃' },
    '699': { name: 'Saturne', symbol: '♄' },
    '799': { name: 'Uranus', symbol: '♅' },
    '899': { name: 'Neptune', symbol: '♆' },
    '999': { name: 'Pluton', symbol: '♇' }
  };

  // Créer un tableau complet avec toutes les planètes
  const allPlanets = Object.entries(planetInfo).map(([planetId, info]) => {
    const planetData = planetaryData.find(p => p.planetId === planetId);
    
    if (planetData) {
      // Planète avec données récupérées
      return {
        ...planetData,
        status: 'success' as const,
        statusText: '✅ Données NASA'
      };
    } else {
      // Planète sans données (erreur 503 ou autre)
      return {
        planetId,
        planet: info.name,
        longitude: 0,
        latitude: 0,
        distance: 0,
        magnitude: 0,
        timestamp: '',
        status: 'error' as const,
        statusText: '❌ Erreur API'
      };
    }
  });

  // Compter les planètes avec succès et en erreur
  const successfulPlanets = allPlanets.filter(p => p.status === 'success');
  const errorPlanets = allPlanets.filter(p => p.status === 'error');

  // Si pas de données planétaires, ne rien afficher
  if (!planetaryData || planetaryData.length === 0) {
    return null;
  }

  // Formater la date de naissance pour l'affichage
  const formatBirthDate = (dateString: string, timeString: string) => {
    if (!dateString || !timeString) return 'Date non spécifiée';
    
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      const formattedDate = date.toLocaleDateString('fr-FR', options);
      return `${formattedDate}, ${timeString}`;
    } catch {
      return `${dateString}, ${timeString}`;
    }
  };

  // Maintenant on a les vraies données, afficher le tableau
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-blue-200">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
        🌟 Tableau des Positions Planétaires
      </h2>
      
      <div className="text-center mb-6">
        <p className="text-lg text-gray-600 mb-4">
          📊 Données récupérées depuis l'API NASA JPL Horizons
        </p>
        <div className="flex justify-center space-x-8 text-sm">
          <p className="text-green-600 font-medium">
            ✅ {successfulPlanets.length} planètes récupérées
          </p>
          <p className="text-red-600 font-medium">
            ❌ {errorPlanets.length} planètes en erreur
          </p>
        </div>
        {birthData && (
          <p className="text-xs text-gray-500 mt-2">
            📍 {birthData.place} • 📅 {formatBirthDate(birthData.date, birthData.time)}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-50">
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Planète</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Symbole</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Longitude</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Latitude</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Signe</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Distance (UA)</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Magnitude</th>
              <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Statut</th>
            </tr>
          </thead>
          <tbody>
            {allPlanets.map((planet, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${
                planet.status === 'success' ? 'ring-2 ring-green-200' : 'ring-2 ring-red-200'
              }`}>
                <td className="border border-gray-300 px-4 py-3 font-medium">
                  {planetInfo[planet.planetId]?.name || planet.planet}
                  {planet.status === 'success' && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">NASA</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center text-2xl">
                  {planetInfo[planet.planetId]?.symbol || '?'}
                </td>
                <td className="border border-gray-300 px-4 py-3 font-mono">
                  {planet.status === 'success' ? formatLongitude(planet.longitude) : '—'}
                </td>
                <td className="border border-gray-300 px-4 py-3 font-mono">
                  {planet.status === 'success' ? `${planet.latitude.toFixed(2)}°` : '—'}
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  {planet.status === 'success' ? getZodiacSign(planet.longitude) : '—'}
                </td>
                <td className="border border-gray-300 px-4 py-3 font-mono">
                  {planet.status === 'success' ? planet.distance.toFixed(4) : '—'}
                </td>
                <td className="border border-gray-300 px-4 py-3 font-mono">
                  {planet.status === 'success' ? planet.magnitude.toFixed(2) : '—'}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-sm">
                  {planet.status === 'success' ? (
                    <span className="text-green-600 font-medium">NASA JPL</span>
                  ) : (
                    <span className="text-red-600 font-medium">Erreur 503</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-600 text-center mt-6">
        <p>🌍 Données récupérées depuis l'API JPL Horizons de la NASA</p>
        {birthData && (
          <>
            <p>📍 Coordonnées: {birthData.place}</p>
            <p>🕐 Date/Heure: {formatBirthDate(birthData.date, birthData.time)}</p>
          </>
        )}
        <p>⏰ Timestamp: {new Date().toLocaleString('fr-FR')}</p>
        {errorPlanets.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              ⚠️ Certaines planètes sont temporairement indisponibles (erreur 503). 
              L'API JPL Horizons peut être surchargée. Réessayez plus tard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableauPlanetes;
