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
  private static readonly BASE_URL = 'https://oytxonaumefjsnkpzbxy.supabase.co/functions/v1/jpl-horizons-proxy';
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
   * Récupère les coordonnées d'une ville depuis la base de données enrichie
   * Utilise les coordonnées pré-fetchées (longitude, latitude, altitude)
   * Fallback sur Paris, France si la ville n'est pas trouvée
   */
  static async getCityCoordinates(cityName: string): Promise<BirthCoordinates | null> {
    console.log(`🔍 [JPLHorizons] Recherche des coordonnées pour: ${cityName}`);
    
    try {
      // Import de la base de données enrichie
      const { cities } = await import('./cities');
      
      // Recherche de la ville dans la base enrichie
      const cityData = cities.find(city => city.name === cityName);
      
      if (cityData) {
        const coordinates: BirthCoordinates = {
          longitude: cityData.longitude,
          latitude: cityData.latitude,
          altitude: cityData.altitude
        };
        console.log(`✅ [JPLHorizons] Coordonnées trouvées dans la base enrichie:`, coordinates);
        return coordinates;
      }

      // Fallback sur Paris si la ville n'est pas trouvée
      console.log(`⚠️ [JPLHorizons] Ville non trouvée → Fallback sur Paris, France`);
      const parisData = cities.find(city => city.name === 'Paris, France');
      
      if (parisData) {
        const parisCoordinates: BirthCoordinates = {
          longitude: parisData.longitude,
          latitude: parisData.latitude,
          altitude: parisData.altitude
        };
        console.log(`🏛️ [JPLHorizons] Utilisation des coordonnées de Paris comme fallback:`, parisCoordinates);
        return parisCoordinates;
      }

      // Dernier recours si même Paris n'est pas trouvé
      console.error(`❌ [JPLHorizons] Erreur critique: Paris non trouvé dans la base de données`);
      return null;
      
    } catch (error) {
      console.error(`❌ [JPLHorizons] Erreur lors de l'import de la base de données:`, error);
      return null;
    }
  }

  /**
   * Table de correspondance pays → fuseau horaire (décalage en heures)
   * Format: "Pays" → { été: décalage_été, hiver: décalage_hiver }
   */
  private static readonly TIMEZONE_OFFSETS: Record<string, { été: number; hiver: number }> = {
    'France': { été: 2, hiver: 1 }, // CEST (UTC+2) / CET (UTC+1)
    'Belgique': { été: 2, hiver: 1 },
    'Suisse': { été: 2, hiver: 1 },
    'Luxembourg': { été: 2, hiver: 1 },
    'Italie': { été: 2, hiver: 1 },
    'Espagne': { été: 2, hiver: 1 },
    'Portugal': { été: 1, hiver: 0 }, // WEST (UTC+1) / WET (UTC+0)
    'Allemagne': { été: 2, hiver: 1 },
    'Autriche': { été: 2, hiver: 1 },
    'Pays-Bas': { été: 2, hiver: 1 },
    'Danemark': { été: 2, hiver: 1 },
    'Suède': { été: 2, hiver: 1 },
    'Norvège': { été: 2, hiver: 1 },
    'Finlande': { été: 3, hiver: 2 }, // EEST (UTC+3) / EET (UTC+2)
    'Pologne': { été: 2, hiver: 1 },
    'République tchèque': { été: 2, hiver: 1 },
    'Slovaquie': { été: 2, hiver: 1 },
    'Hongrie': { été: 2, hiver: 1 },
    'Roumanie': { été: 3, hiver: 2 },
    'Bulgarie': { été: 3, hiver: 2 },
    'Grèce': { été: 3, hiver: 2 },
    'Croatie': { été: 2, hiver: 1 },
    'Slovénie': { été: 2, hiver: 1 },
    'Estonie': { été: 3, hiver: 2 },
    'Lettonie': { été: 3, hiver: 2 },
    'Lituanie': { été: 3, hiver: 2 },
    'Canada': { été: -4, hiver: -5 }, // EDT (UTC-4) / EST (UTC-5) pour l'est
    'États-Unis': { été: -4, hiver: -5 }, // EDT (UTC-4) / EST (UTC-5) pour l'est
    'Royaume-Uni': { été: 1, hiver: 0 }, // BST (UTC+1) / GMT (UTC+0)
    'Irlande': { été: 1, hiver: 0 }
  };

  /**
   * Détermine si une date est en période d'été (heure d'été)
   * Règle : 27 mars → 27 octobre (changement d'heure fixe)
   */
  private static isSummerTime(date: string): boolean {
    const year = parseInt(date.split('-')[0]);
    const month = parseInt(date.split('-')[1]);
    const day = parseInt(date.split('-')[2]);
    
    // Date de début d'été : 27 mars
    const summerStart = new Date(year, 2, 27); // mois 2 = mars (0-indexé)
    // Date de fin d'été : 27 octobre  
    const summerEnd = new Date(year, 9, 27); // mois 9 = octobre (0-indexé)
    
    const currentDate = new Date(year, month - 1, day); // month - 1 car 0-indexé
    
    // Période d'été : du 27 mars au 27 octobre (inclus)
    return currentDate >= summerStart && currentDate <= summerEnd;
  }

  /**
   * Extrait le pays depuis le nom de la ville
   * Format attendu: "Ville, Pays"
   */
  private static extractCountry(cityName: string): string {
    const parts = cityName.split(', ');
    return parts.length > 1 ? parts[1].trim() : 'France'; // Fallback sur France
  }

  /**
   * Convertit une heure approximative en heure précise
   * Gère les cas comme "environ 04:00", "par défaut 12:00"
   */
  private static parseApproximateTime(time: string): string {
    // Si c'est déjà une heure précise (format HH:MM)
    if (/^\d{1,2}:\d{2}$/.test(time)) {
      return time;
    }
    
    // Extraire l'heure des formats approximatifs
    const timeMatch = time.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      return `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
    }
    
    // Fallback sur midi si aucun format reconnu
    console.warn(`⚠️ [JPLHorizons] Format d'heure non reconnu: ${time} → utilisation de 12:00`);
    return '12:00';
  }

  /**
   * Convertit une date/heure locale en UTC avec gestion des fuseaux horaires
   * Version corrigée qui gère les fuseaux européens et les heures approximatives
   */
  static convertLocalToUTC(date: string, time: string, cityName: string = 'Paris, France'): string {
    console.log(`🕐 [JPLHorizons] Conversion heure locale → UTC: ${date} ${time} (${cityName})`);
    
    try {
      // 1. Parser l'heure (gérer les formats approximatifs)
      const preciseTime = this.parseApproximateTime(time);
      console.log(`⏰ [JPLHorizons] Heure parsée: ${time} → ${preciseTime}`);
      
      // 2. Extraire le pays
      const country = this.extractCountry(cityName);
      console.log(`🌍 [JPLHorizons] Pays détecté: ${country}`);
      
      // 3. Déterminer la période (été/hiver)
      const isSummer = this.isSummerTime(date);
      console.log(`📅 [JPLHorizons] Période: ${isSummer ? 'été' : 'hiver'}`);
      
      // 4. Récupérer le décalage horaire
      const timezoneData = this.TIMEZONE_OFFSETS[country];
      if (!timezoneData) {
        console.warn(`⚠️ [JPLHorizons] Pays non reconnu: ${country} → utilisation du fuseau français`);
        const offset = isSummer ? 2 : 1; // France par défaut
        console.log(`🕐 [JPLHorizons] Décalage appliqué: UTC${offset >= 0 ? '+' : ''}${offset}`);
        
        // 5. Convertir en UTC
        const [hours, minutes] = preciseTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const utcMinutes = totalMinutes - (offset * 60);
        
        // Gérer les débordements de jour
        let utcHours = Math.floor(utcMinutes / 60);
        let utcMins = utcMinutes % 60;
        
        if (utcMins < 0) {
          utcMins += 60;
          utcHours -= 1;
        }
        if (utcHours < 0) {
          utcHours += 24;
        }
        if (utcHours >= 24) {
          utcHours -= 24;
        }
        
        const utcTime = `${utcHours.toString().padStart(2, '0')}:${utcMins.toString().padStart(2, '0')}:00`;
        const result = `${date} ${utcTime}`;
        
        console.log(`✅ [JPLHorizons] Conversion terminée: ${date} ${preciseTime} (${country} ${isSummer ? 'été' : 'hiver'}) → ${result} UTC`);
        return result;
      }
      
      const offset = isSummer ? timezoneData.été : timezoneData.hiver;
      console.log(`🕐 [JPLHorizons] Décalage appliqué: UTC${offset >= 0 ? '+' : ''}${offset}`);
      
      // 5. Convertir en UTC
      const [hours, minutes] = preciseTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const utcMinutes = totalMinutes - (offset * 60);
      
      // Gérer les débordements de jour
      let utcHours = Math.floor(utcMinutes / 60);
      let utcMins = utcMinutes % 60;
      
      if (utcMins < 0) {
        utcMins += 60;
        utcHours -= 1;
      }
      if (utcHours < 0) {
        utcHours += 24;
      }
      if (utcHours >= 24) {
        utcHours -= 24;
      }
      
      const utcTime = `${utcHours.toString().padStart(2, '0')}:${utcMins.toString().padStart(2, '0')}:00`;
      const result = `${date} ${utcTime}`;
      
      console.log(`✅ [JPLHorizons] Conversion terminée: ${date} ${preciseTime} (${country} ${isSummer ? 'été' : 'hiver'}) → ${result} UTC`);
      return result;
      
    } catch (error) {
      console.error(`❌ [JPLHorizons] Erreur lors de la conversion UTC:`, error);
      // Fallback sur l'ancienne méthode en cas d'erreur
      const localDateTime = new Date(`${date}T${time}:00`);
      const utcDateTime = new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000);
      const fallback = utcDateTime.toISOString().slice(0, 19).replace('T', ' ');
      console.log(`🔄 [JPLHorizons] Fallback utilisé: ${fallback}`);
      return fallback;
    }
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
