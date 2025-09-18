/**
 * Service API pour le microservice de calculs astrologiques
 * Remplace JPL Horizons par votre microservice Cloud Run
 */

import { cities, CityData } from './cities';
import { DateTime } from 'luxon';

// Interfaces pour la compatibilité avec le code existant
export interface BirthData {
  date: string;
  time: string;
  place: string;
}

export interface BirthCoordinates {
  longitude: number;
  latitude: number;
  altitude: number;
}

export interface PlanetPosition {
  longitude: number;
  latitude: number;
  sign: string;
  house: string;
}

export interface PlanetaryPosition {
  planetId: string;
  planet: string;
  longitude: number;
  latitude: number;
  distance: number;
  magnitude: number;
  timestamp: string;
}

export interface HouseCusp {
  house: number;
  longitude: number;
  sign: string;
  degrees: number;
  minutes: number;
}

export interface HouseSystem {
  ascendant: HouseCusp;
  mc: HouseCusp;
  houses: HouseCusp[];
  system: 'Placidus' | 'Equal' | 'Koch';
}

export interface AstroData {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  planets: PlanetaryPosition[];
  houseSystem: HouseSystem;
}

// Interface pour la réponse du microservice
interface MicroserviceResponse {
  ascendant: {
    sign: string;
    degree: number;
    display: string;
  };
  descendant: {
    sign: string;
    degree: number;
    display: string;
  };
  mc: {
    sign: string;
    degree: number;
    display: string;
  };
  ic: {
    sign: string;
    degree: number;
    display: string;
  };
  planets: Array<{
    name: string;
    sign: string;
    degree: number;
    house: number;
    retrograde: boolean;
    display: string;
  }>;
  calculation_date: string;
  metadata: {
    house_system: string;
    timezone: string;
    ephemeris_version: string;
    request_id: string;
  };
}

export class MicroserviceAPI {
  private static readonly BASE_URL = 'https://astro-calcul-424488213714.europe-west9.run.app';
  private static readonly TIMEOUT = 30000; // 30 secondes

  /**
   * Récupère les coordonnées d'une ville depuis la base de données enrichie
   * Utilise les coordonnées pré-fetchées (longitude, latitude, altitude)
   * Fallback sur Paris, France si la ville n'est pas trouvée
   */
  static async getCityCoordinates(cityName: string): Promise<BirthCoordinates | null> {
    try {
      console.log(`🌍 [MicroserviceAPI] Recherche des coordonnées pour: ${cityName}`);

      // Recherche exacte d'abord
      let city = cities.find(c => 
        c.name.toLowerCase() === cityName.toLowerCase() ||
        c.name.toLowerCase().includes(cityName.toLowerCase()) ||
        cityName.toLowerCase().includes(c.name.toLowerCase())
      );

      // Si pas trouvé, recherche partielle
      if (!city) {
        const searchTerms = cityName.toLowerCase().split(/[,\s]+/);
        city = cities.find(c => {
          const cityTerms = c.name.toLowerCase().split(/[,\s]+/);
          return searchTerms.some(term => 
            term.length > 2 && cityTerms.some(cityTerm => 
              cityTerm.includes(term) || term.includes(cityTerm)
            )
          );
        });
      }

      if (city) {
        console.log(`✅ [MicroserviceAPI] Ville trouvée: ${city.name}`);
        return {
          longitude: city.longitude,
          latitude: city.latitude,
          altitude: city.altitude || 0
        };
      }

      // Fallback sur Paris, France
      console.log(`⚠️ [MicroserviceAPI] Ville non trouvée, utilisation de Paris comme fallback`);
      const paris = cities.find(c => c.name === 'Paris, France');
      if (paris) {
        return {
          longitude: paris.longitude,
          latitude: paris.latitude,
          altitude: paris.altitude || 0
        };
      }

      return null;
    } catch (error) {
      console.error('❌ [MicroserviceAPI] Erreur lors de la récupération des coordonnées:', error);
      return null;
    }
  }

  /**
   * Convertit l'heure locale en UTC
   * Utilise le service timezone-utils existant
   */
  static async convertLocalToUTC(date: string, time: string, cityName: string): Promise<string> {
    // Récupérer les coordonnées de la ville d'abord
    const coordinates = await this.getCityCoordinates(cityName);
    if (!coordinates) {
      throw new Error(`Coordonnées non trouvées pour: ${cityName}`);
    }
    
    // Trouver la ville dans la base de données pour récupérer le timezone réel
    const city = cities.find(c => 
      c.name.toLowerCase() === cityName.toLowerCase() ||
      c.name.toLowerCase().includes(cityName.toLowerCase()) ||
      cityName.toLowerCase().includes(c.name.toLowerCase())
    );
    
    if (!city) {
      throw new Error(`Ville non trouvée dans la base de données: ${cityName}`);
    }
    
    // Utiliser le timezone réel de la ville (gère automatiquement l'heure d'été/hiver)
    const cityData: CityData = {
      name: city.name,
      timezone: city.timezone, // ✅ Timezone réel de la ville
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
      altitude: coordinates.altitude
    };
    
    console.log(`🕐 [MicroserviceAPI] Conversion timezone: ${cityName} → ${city.timezone}`);
    
    // Utiliser Luxon pour une conversion timezone correcte
    try {
      // 1. Construire la date dans le bon fuseau horaire de la ville
      const localDateTime = DateTime.fromISO(`${date}T${time}`, { zone: city.timezone });
      
      // 2. Convertir en UTC
      const utcDateTime = localDateTime.toUTC();
      
      // 3. Retourner au format HH:MM
      const utcTime = utcDateTime.toFormat('HH:mm');
      
      console.log(`✅ [MicroserviceAPI] Conversion réussie: ${time} (${city.timezone}) → ${utcTime} UTC`);
      return utcTime;
      
    } catch (error) {
      console.error('❌ [MicroserviceAPI] Erreur conversion timezone:', error);
      // Fallback : retourner l'heure locale
      return time;
    }
  }

  /**
   * Appelle le microservice pour récupérer les données astrologiques
   */
  static async getAstroData(
    date: string,
    timeUtc: string,
    coordinates: BirthCoordinates
  ): Promise<MicroserviceResponse> {
    try {
      const url = `${this.BASE_URL}/astro/structured`;
      
      const requestData = {
        date: date,
        time_utc: timeUtc,
        lat: coordinates.latitude,
        lng: coordinates.longitude
      };

      console.log(`🚀 [MicroserviceAPI] Appel au microservice:`, url);
      console.log(`📊 [MicroserviceAPI] Données envoyées:`, requestData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: AbortSignal.timeout(this.TIMEOUT)
      });

      if (!response.ok) {
        throw new Error(`Microservice API Error: ${response.status} ${response.statusText}`);
      }

      const data: MicroserviceResponse = await response.json();
      console.log(`✅ [MicroserviceAPI] Données reçues du microservice:`, data);

      return data;
    } catch (error) {
      console.error('❌ [MicroserviceAPI] Erreur lors de l\'appel au microservice:', error);
      throw error;
    }
  }

  /**
   * Convertit la réponse du microservice vers le format AstroData existant
   */
  static convertToAstroData(
    microserviceData: MicroserviceResponse,
    birthData: BirthData
  ): AstroData {
    console.log(`🔄 [MicroserviceAPI] Conversion des données du microservice...`);

    // Mapping des noms de planètes
    const planetMapping: Record<string, string> = {
      'Soleil': 'sun',
      'Lune': 'moon',
      'Mercure': 'mercury',
      'Vénus': 'venus',
      'Mars': 'mars',
      'Jupiter': 'jupiter',
      'Saturne': 'saturn',
      'Uranus': 'uranus',
      'Neptune': 'neptune',
      'Pluton': 'pluto'
    };

    // Créer l'objet AstroData
    const astroData: AstroData = {
      sun: { longitude: 0, latitude: 0, sign: '', house: '' },
      moon: { longitude: 0, latitude: 0, sign: '', house: '' },
      mercury: { longitude: 0, latitude: 0, sign: '', house: '' },
      venus: { longitude: 0, latitude: 0, sign: '', house: '' },
      mars: { longitude: 0, latitude: 0, sign: '', house: '' },
      jupiter: { longitude: 0, latitude: 0, sign: '', house: '' },
      saturn: { longitude: 0, latitude: 0, sign: '', house: '' },
      uranus: { longitude: 0, latitude: 0, sign: '', house: '' },
      neptune: { longitude: 0, latitude: 0, sign: '', house: '' },
      pluto: { longitude: 0, latitude: 0, sign: '', house: '' },
      planets: [],
      houseSystem: {
        ascendant: {
          house: 1,
          longitude: microserviceData.ascendant.degree,
          sign: microserviceData.ascendant.sign,
          degrees: Math.floor(microserviceData.ascendant.degree),
          minutes: Math.round((microserviceData.ascendant.degree % 1) * 60)
        },
        mc: {
          house: 10,
          longitude: microserviceData.mc.degree,
          sign: microserviceData.mc.sign,
          degrees: Math.floor(microserviceData.mc.degree),
          minutes: Math.round((microserviceData.mc.degree % 1) * 60)
        },
        houses: [],
        system: 'Placidus' as const
      }
    };

    // Remplir les données des planètes
    microserviceData.planets.forEach(planet => {
      const planetKey = planetMapping[planet.name] as keyof AstroData;
      if (planetKey && astroData[planetKey]) {
        const planetData = astroData[planetKey] as PlanetPosition;
        planetData.longitude = planet.degree;
        planetData.latitude = 0; // Le microservice ne fournit pas la latitude
        planetData.sign = planet.sign;
        planetData.house = `Maison ${planet.house}`;

        // Ajouter aux données brutes
        astroData.planets.push({
          planetId: this.getPlanetId(planet.name),
          planet: planet.name,
          longitude: planet.degree,
          latitude: 0,
          distance: 0,
          magnitude: 0,
          timestamp: microserviceData.calculation_date
        });
      }
    });

    console.log(`✅ [MicroserviceAPI] Conversion terminée:`, astroData);
    return astroData;
  }

  /**
   * Obtient l'ID de planète pour la compatibilité
   */
  private static getPlanetId(planetName: string): string {
    const planetIds: Record<string, string> = {
      'Soleil': '10',
      'Lune': '301',
      'Mercure': '199',
      'Vénus': '299',
      'Mars': '499',
      'Jupiter': '599',
      'Saturne': '699',
      'Uranus': '799',
      'Neptune': '899',
      'Pluton': '999'
    };
    return planetIds[planetName] || '0';
  }
}
