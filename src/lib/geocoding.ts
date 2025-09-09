export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude: number;
}

// Base de données simplifiée de villes avec leurs coordonnées
const citiesDatabase: Record<string, Coordinates> = {
  'Paris, France': { latitude: 48.8566, longitude: 2.3522, altitude: 0.035 },
  'Lyon, France': { latitude: 45.7578, longitude: 4.8320, altitude: 0.173 },
  'Marseille, France': { latitude: 43.2965, longitude: 5.3698, altitude: 0.012 },
  'Toulouse, France': { latitude: 43.6047, longitude: 1.4442, altitude: 0.146 },
  'Nice, France': { latitude: 43.7102, longitude: 7.2620, altitude: 0.007 },
  'Nantes, France': { latitude: 47.2184, longitude: -1.5536, altitude: 0.020 },
  'Strasbourg, France': { latitude: 48.5734, longitude: 7.7521, altitude: 0.143 },
  'Montpellier, France': { latitude: 43.6108, longitude: 3.8767, altitude: 0.027 },
  'Bordeaux, France': { latitude: 44.8378, longitude: -0.5792, altitude: 0.010 },
  'Lille, France': { latitude: 50.6292, longitude: 3.0573, altitude: 0.023 },
  'Rennes, France': { latitude: 48.1173, longitude: -1.6778, altitude: 0.030 },
  'Reims, France': { latitude: 49.2583, longitude: 4.0317, altitude: 0.080 },
  'Saint-Étienne, France': { latitude: 45.4397, longitude: 4.3872, altitude: 0.513 },
  'Toulon, France': { latitude: 43.1242, longitude: 5.9280, altitude: 0.001 },
  'Angers, France': { latitude: 47.4736, longitude: -0.5516, altitude: 0.039 },
  'Grenoble, France': { latitude: 45.1885, longitude: 5.7245, altitude: 0.212 },
  'Dijon, France': { latitude: 47.3220, longitude: 5.0415, altitude: 0.245 },
  'Nîmes, France': { latitude: 43.8367, longitude: 4.3601, altitude: 0.039 },
  'Saint-Denis, France': { latitude: 48.9362, longitude: 2.3574, altitude: 0.033 },
  'Villeurbanne, France': { latitude: 45.7640, longitude: 4.8357, altitude: 0.181 },
  'Le Havre, France': { latitude: 49.4944, longitude: 0.1079, altitude: 0.005 },
  'Sète, France': { latitude: 43.4024, longitude: 3.6967, altitude: 0.001 },
  'Cognac, France': { latitude: 45.6958, longitude: -0.3292, altitude: 0.023 },
  'Bruxelles, Belgique': { latitude: 50.8503, longitude: 4.3517, altitude: 0.013 },
  'Amsterdam, Pays-Bas': { latitude: 52.3676, longitude: 4.9041, altitude: 0.002 },
  'Berlin, Allemagne': { latitude: 52.5200, longitude: 13.4050, altitude: 0.034 },
  'Rome, Italie': { latitude: 41.9028, longitude: 12.4964, altitude: 0.021 },
  'Madrid, Espagne': { latitude: 40.4168, longitude: -3.7038, altitude: 0.667 },
  'Londres, Royaume-Uni': { latitude: 51.5074, longitude: -0.1278, altitude: 0.035 },
  'New York, États-Unis': { latitude: 40.7128, longitude: -74.0060, altitude: 0.010 },
  'Los Angeles, États-Unis': { latitude: 34.0522, longitude: -118.2437, altitude: 0.093 },
  'Tokyo, Japon': { latitude: 35.6762, longitude: 139.6503, altitude: 0.040 },
  'Sydney, Australie': { latitude: -33.8688, longitude: 151.2093, altitude: 0.001 },
  'Montréal, Canada': { latitude: 45.5017, longitude: -73.5673, altitude: 0.035 },
  'Rio de Janeiro, Brésil': { latitude: -22.9068, longitude: -43.1729, altitude: 0.002 },
  'Le Caire, Égypte': { latitude: 30.0444, longitude: 31.2357, altitude: 0.023 },
  'Mumbai, Inde': { latitude: 19.0760, longitude: 72.8777, altitude: 0.014 },
  'Pékin, Chine': { latitude: 39.9042, longitude: 116.4074, altitude: 0.044 },
  'Moscou, Russie': { latitude: 55.7558, longitude: 37.6176, altitude: 0.156 }
};

export class GeocodingService {
  /**
   * Convertit un nom de ville en coordonnées géographiques
   */
  static async getCoordinates(cityName: string): Promise<Coordinates | null> {
    // Recherche exacte dans la base de données
    const exactMatch = citiesDatabase[cityName];
    if (exactMatch) {
      return exactMatch;
    }

    // Recherche approximative (insensible à la casse)
    const normalizedCityName = cityName.toLowerCase().trim();
    
    for (const [city, coords] of Object.entries(citiesDatabase)) {
      if (city.toLowerCase().includes(normalizedCityName) || 
          normalizedCityName.includes(city.toLowerCase().split(',')[0])) {
        return coords;
      }
    }

    // Si aucune correspondance, retourner Paris par défaut
    console.warn(`Ville non trouvée: ${cityName}, utilisation de Paris par défaut`);
    return citiesDatabase['Paris, France'];
  }

  /**
   * Recherche des suggestions de villes
   */
  static searchCities(query: string): string[] {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    const suggestions: string[] = [];
    
    for (const city of Object.keys(citiesDatabase)) {
      if (city.toLowerCase().includes(normalizedQuery)) {
        suggestions.push(city);
        if (suggestions.length >= 10) break; // Limiter à 10 suggestions
      }
    }
    
    return suggestions;
  }
}
