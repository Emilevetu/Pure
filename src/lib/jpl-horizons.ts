/**
 * Service JPL Horizons pour récupérer les positions planétaires
 * Utilise l'API officielle de la NASA
 */

export interface BirthCoordinates {
  longitude: number;
  latitude: number;
  altitude: number;
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

interface JPLHorizonsResponse {
  result: string;
}

export class JPLHorizonsService {
  private static readonly BASE_URL = '/api/jpl-horizons.api';
  private static readonly TIMEOUT = 30000; // 30 secondes

  // IDs des planètes dans JPL Horizons
  private static readonly PLANET_IDS: Record<string, string> = {
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

  // Noms des planètes par ID
  private static readonly PLANET_NAMES: Record<string, string> = {
    '10': 'Soleil',
    '301': 'Lune',
    '199': 'Mercure',
    '299': 'Vénus',
    '499': 'Mars',
    '599': 'Jupiter',
    '699': 'Saturne',
    '799': 'Uranus',
    '899': 'Neptune',
    '999': 'Pluton'
  };

  /**
   * Récupère les coordonnées d'une ville
   */
  static getCityCoordinates(cityName: string): BirthCoordinates | null {
    // Coordonnées des principales villes françaises
    const cities: Record<string, BirthCoordinates> = {
      'Paris, France': { longitude: 2.3522, latitude: 48.8566, altitude: 0.035 },
      'Lyon, France': { longitude: 4.8357, latitude: 45.7640, altitude: 0.173 },
      'Marseille, France': { longitude: 5.3698, latitude: 43.2965, altitude: 0.012 },
      'Toulouse, France': { longitude: 1.4442, latitude: 43.6047, altitude: 0.146 },
      'Nice, France': { longitude: 7.2619, latitude: 43.7102, altitude: 0.010 },
      'Nantes, France': { longitude: -1.5536, latitude: 47.2184, altitude: 0.020 },
      'Strasbourg, France': { longitude: 7.7521, latitude: 48.5734, altitude: 0.140 },
      'Montpellier, France': { longitude: 3.8767, latitude: 43.6108, altitude: 0.027 },
      'Bordeaux, France': { longitude: -0.5792, latitude: 44.8378, altitude: 0.010 },
      'Lille, France': { longitude: 3.0573, latitude: 50.6292, altitude: 0.025 }
    };

    return cities[cityName] || null;
  }

  /**
   * Convertit une date/heure locale en UTC
   */
  static convertLocalToUTC(date: string, time: string): string {
    const localDateTime = new Date(`${date}T${time}:00`);
    const utcDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000);
    return utcDateTime.toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * Récupère la position d'une planète spécifique
   */
  static async getPlanetaryPosition(
    planetId: string,
    date: string,
    coordinates: BirthCoordinates
  ): Promise<PlanetaryPosition | null> {
    try {
      const url = this.buildHorizonsURL(planetId, date, coordinates);
      console.log(`🌍 Requête JPL Horizons pour ${this.PLANET_NAMES[planetId]}:`, url);
      console.log(`🕐 Heure UTC envoyée:`, date);
      console.log(`🔗 URL finale:`, url);

      const response = await this.makeRequest(url);
      
      if (response.result) {
        const position = this.parseHorizonsResult(response.result, planetId);
        return position;
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Erreur lors de la requête JPL Horizons pour ${this.PLANET_NAMES[planetId]}:`, error);
      return null;
    }
  }

  /**
   * Récupère les positions de toutes les planètes principales
   * MODIFIÉ : Requêtes séquentielles avec délai pour éviter le rate limiting
   */
  static async getAllPlanetaryPositions(
    date: string,
    coordinates: BirthCoordinates
  ): Promise<PlanetaryPosition[]> {
    const planetIds = Object.values(this.PLANET_IDS);
    const positions: PlanetaryPosition[] = [];

    console.log(`🚀 Récupération des positions pour ${planetIds.length} planètes...`);

    // Requêtes SÉQUENTIELLES avec délai pour éviter de surcharger l'API
    for (const planetId of planetIds) {
      try {
        console.log(`🌍 Récupération de ${this.PLANET_NAMES[planetId]} (ID: ${planetId})...`);
        
        const position = await this.getPlanetaryPosition(planetId, date, coordinates);
        if (position) {
          positions.push(position);
          console.log(`✅ ${position.planet}: ${position.longitude.toFixed(2)}°`);
        }
        
        // Délai de 1 seconde entre chaque requête pour éviter le rate limiting
        if (planetId !== planetIds[planetIds.length - 1]) { // Pas de délai après la dernière
          console.log(`⏳ Attente de 1 seconde avant la prochaine planète...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`❌ Erreur pour ${this.PLANET_NAMES[planetId]}:`, error);
        // Continuer avec la planète suivante au lieu d'arrêter tout
      }
    }

    console.log(`🎯 ${positions.length}/${planetIds.length} planètes récupérées avec succès`);
    return positions.sort((a, b) => a.longitude - b.longitude); // Tri par longitude
  }

  /**
   * Construit l'URL de requête JPL Horizons
   */
  private static buildHorizonsURL(
    planetId: string,
    date: string,
    coordinates: BirthCoordinates
  ): string {
    // Copie exacte du format qui fonctionne
    const baseUrl = this.BASE_URL;
    
    // Format avec QUANTITIES=31,32,20,23 pour coordonnées écliptiques directes
    // 31 = longitude écliptique, 32 = latitude écliptique, 20 = distance, 23 = magnitude
    const url = `${baseUrl}?format=json&COMMAND=%27${planetId}%27&EPHEM_TYPE=%27OBSERVER%27&CENTER=%27coord%40399%27&COORD_TYPE=%27GEODETIC%27&SITE_COORD=%27${coordinates.longitude},${coordinates.latitude},${coordinates.altitude}%27&TLIST=%27${date.replace(' ', '%20')}%27&QUANTITIES=%2731,32,20,23%27`;
    
    return url;
  }

  /**
   * Effectue la requête HTTP avec timeout
   */
  private static async makeRequest(url: string): Promise<JPLHorizonsResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Astro-Alignement/1.0 (https://github.com/user/astro-alignement)'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Requête JPL Horizons expirée (timeout)');
      }
      throw error;
    }
  }

  /**
   * Parse le résultat de JPL Horizons (format complexe JPL)
   */
  private static parseHorizonsResult(result: string, planetId: string): PlanetaryPosition | null {
    try {
      console.log('🔍 Parsing de la réponse JPL Horizons...');
      
      // Chercher la ligne de données ($$SOE)
      const lines = result.split('\n');
      let dataLine = '';
      let foundSOE = false;
      
      for (const line of lines) {
        if (line.trim() === '$$SOE') {
          foundSOE = true;
          console.log('✅ Section $$SOE trouvée');
          continue;
        }
        
        if (foundSOE && line.trim() === '$$EOE') {
          console.log('✅ Section $$EOE trouvée - fin des données');
          break;
        }
        
        if (foundSOE && line.trim() && !line.startsWith('$$')) {
          dataLine = line.trim();
          console.log('📊 Ligne de données trouvée:', dataLine);
          break;
        }
      }
      
      if (!dataLine) {
        console.log('❌ Aucune ligne de données trouvée');
        return null;
      }
      
      // Parser la ligne de données JPL Horizons avec QUANTITIES=1,2,20,23
      // Format: JD UT Longitude_écliptique Latitude_écliptique Distance Magnitude
      const parts = dataLine.split(/\s+/);
      console.log('🔢 Parties parsées:', parts);
      
      if (parts.length < 6) {
        console.log('❌ Format de données invalide');
        return null;
      }
      
      // Extraire les données selon le format JPL Horizons avec coordonnées écliptiques
      // QUANTITIES=31,32,20,23 retourne des degrés décimaux directs
      // Longitude écliptique (colonne 3) - degrés décimaux
      const longitude = parseFloat(parts[3]);
      
      // Latitude écliptique (colonne 4) - degrés décimaux
      const latitude = parseFloat(parts[4]);
      
      // Distance (colonne 7)
      const distance = parseFloat(parts[7]) || 1.0;
      
      // Magnitude (colonne 8)
      const magnitude = parseFloat(parts[8]) || -26.7;
      
      console.log('✅ Données parsées avec succès:');
      console.log('  - Longitude écliptique:', longitude, '°');
      console.log('  - Latitude écliptique:', latitude, '°');
      console.log('  - Distance:', distance, 'UA');
      console.log('  - Magnitude:', magnitude);
      
      return {
        planetId,
        planet: this.PLANET_NAMES[planetId] || 'Inconnu',
        longitude,
        latitude,
        distance,
        magnitude,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Erreur lors du parsing JPL Horizons:', error);
      return null;
    }
  }
}
