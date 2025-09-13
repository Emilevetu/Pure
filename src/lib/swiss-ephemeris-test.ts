/**
 * Test Swiss Ephemeris WASM pour remplacer JPL Horizons
 * Calculs astrologiques précis et rapides
 */

import SwissEph from 'swisseph-wasm';

export interface BirthCoordinates {
  longitude: number;
  latitude: number;
  altitude: number;
}

export interface BirthData {
  date: string;
  time: string;
  place: string;
}

export interface SwissPlanetaryPosition {
  planetId: string;
  planet: string;
  longitude: number;
  latitude: number;
  distance: number;
  magnitude: number;
  timestamp: string;
}

export interface SwissHouseCusp {
  house: number;
  longitude: number;
  sign: string;
  degrees: number;
  minutes: number;
}

export interface SwissHouseSystem {
  ascendant: SwissHouseCusp;
  mc: SwissHouseCusp;
  houses: SwissHouseCusp[];
  system: 'Placidus' | 'Koch' | 'Equal';
}

export class SwissEphemerisTestService {
  private static se: SwissEph | null = null;

  // IDs des planètes dans Swiss Ephemeris
  private static readonly PLANET_IDS: Record<string, number> = {
    'Soleil': 0,
    'Lune': 1,
    'Mercure': 2,
    'Vénus': 3,
    'Mars': 4,
    'Jupiter': 5,
    'Saturne': 6,
    'Uranus': 7,
    'Neptune': 8,
    'Pluton': 9
  };

  // Noms des planètes par ID
  private static readonly PLANET_NAMES: Record<number, string> = {
    0: 'Soleil',
    1: 'Lune',
    2: 'Mercure',
    3: 'Vénus',
    4: 'Mars',
    5: 'Jupiter',
    6: 'Saturne',
    7: 'Uranus',
    8: 'Neptune',
    9: 'Pluton'
  };

  /**
   * Initialise Swiss Ephemeris (doit être appelé avant utilisation)
   */
  static async initialize(): Promise<void> {
    if (!this.se) {
      console.log('🔧 [SwissEphemeris] Initialisation...');
      try {
        // Créer une nouvelle instance et attendre qu'elle soit prête
        this.se = new SwissEph();
        
        // Attendre que le module WASM soit chargé
        await new Promise((resolve) => {
          if (this.se && typeof this.se.initialize === 'function') {
            this.se.initialize().then(resolve).catch(resolve);
          } else {
            // Si pas de méthode initialize, attendre un peu
            setTimeout(resolve, 100);
          }
        });
        
        console.log('✅ [SwissEphemeris] Initialisé avec succès');
      } catch (error) {
        console.error('❌ [SwissEphemeris] Erreur d\'initialisation:', error);
        throw error;
      }
    }
  }

  /**
   * Convertit une date/heure en Julian Day Number
   */
  private static dateToJulianDay(date: string, time: string): number {
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes, seconds] = time.split(':').map(Number);

    // Algorithme de conversion en Julian Day
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;

    const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // Ajouter la fraction de jour
    const dayFraction = (hours + minutes / 60 + (seconds || 0) / 3600) / 24;
    
    return jd + dayFraction;
  }

  /**
   * Convertit une date/heure locale en UTC avec gestion des fuseaux horaires
   */
  static convertLocalToUTC(date: string, time: string, cityName: string = 'Paris, France'): string {
    console.log(`🕐 [SwissEphemeris] Conversion heure locale → UTC: ${date} ${time} (${cityName})`);
    
    try {
      // 1. Parser l'heure
      const preciseTime = time.includes(':') ? time : `${time}:00`;
      
      // 2. Extraire le pays
      const country = cityName.split(', ')[1] || 'France';
      
      // 3. Déterminer la période (été/hiver) - règle simplifiée
      const year = parseInt(date.split('-')[0]);
      const month = parseInt(date.split('-')[1]);
      const day = parseInt(date.split('-')[2]);
      
      // Règle simplifiée : été du 27 mars au 27 octobre
      const isSummer = (month > 3 && month < 10) || 
                      (month === 3 && day >= 27) || 
                      (month === 10 && day <= 27);
      
      // 4. Récupérer le décalage horaire
      const offset = isSummer ? 2 : 1; // France : CEST (UTC+2) / CET (UTC+1)
      
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
      
      console.log(`✅ [SwissEphemeris] Conversion terminée: ${date} ${preciseTime} (${country} ${isSummer ? 'été' : 'hiver'}) → ${result} UTC`);
      return result;
      
    } catch (error) {
      console.error(`❌ [SwissEphemeris] Erreur lors de la conversion UTC:`, error);
      return `${date} ${time}:00`;
    }
  }

  /**
   * Récupère la position d'une planète spécifique
   */
  static async getPlanetaryPosition(
    planetId: number,
    jd: number
  ): Promise<SwissPlanetaryPosition | null> {
    if (!this.se) {
      throw new Error('Swiss Ephemeris non initialisé');
    }

    try {
      console.log(`🌍 [SwissEphemeris] Calcul position ${this.PLANET_NAMES[planetId]}...`);
      
      // Calculer la position de la planète
      const result = this.se.calc_ut(jd, planetId, 0); // 0 = vitesse
      
      if (result && result.length >= 3) {
        const [longitude, latitude, distance] = result;
        
        console.log(`✅ [SwissEphemeris] ${this.PLANET_NAMES[planetId]}: ${longitude.toFixed(6)}°`);
        
        return {
          planetId: planetId.toString(),
          planet: this.PLANET_NAMES[planetId],
          longitude: longitude,
          latitude: latitude,
          distance: distance || 1.0,
          magnitude: -26.7, // Valeur par défaut
          timestamp: new Date().toISOString()
        };
      }
      
      return null;
    } catch (error) {
      console.error(`❌ [SwissEphemeris] Erreur pour ${this.PLANET_NAMES[planetId]}:`, error);
      return null;
    }
  }

  /**
   * Récupère les positions de toutes les planètes principales
   */
  static async getAllPlanetaryPositions(
    utcDateTime: string,
    coordinates: BirthCoordinates
  ): Promise<SwissPlanetaryPosition[]> {
    if (!this.se) {
      await this.initialize();
    }

    const [date, time] = utcDateTime.split(' ');
    const jd = this.dateToJulianDay(date, time);
    
    console.log(`🚀 [SwissEphemeris] Calcul positions pour ${Object.keys(this.PLANET_IDS).length} planètes...`);
    console.log(`📊 [SwissEphemeris] Julian Day: ${jd}`);

    const positions: SwissPlanetaryPosition[] = [];
    const planetIds = Object.values(this.PLANET_IDS);

    for (const planetId of planetIds) {
      try {
        const position = await this.getPlanetaryPosition(planetId, jd);
        if (position) {
          positions.push(position);
        }
      } catch (error) {
        console.error(`❌ [SwissEphemeris] Erreur pour planète ${planetId}:`, error);
      }
    }

    console.log(`🎯 [SwissEphemeris] ${positions.length}/${planetIds.length} planètes calculées`);
    return positions.sort((a, b) => a.longitude - b.longitude);
  }

  /**
   * Calcule l'Ascendant avec Swiss Ephemeris (version simplifiée)
   */
  static async calculateAscendant(
    utcDateTime: string,
    coordinates: BirthCoordinates
  ): Promise<{ ascendant: number; mc: number }> {
    if (!this.se) {
      await this.initialize();
    }

    const [date, time] = utcDateTime.split(' ');
    const jd = this.dateToJulianDay(date, time);
    
    console.log(`🏠 [SwissEphemeris] Calcul Ascendant...`);
    console.log(`📍 [SwissEphemeris] Coordonnées: ${coordinates.longitude}°, ${coordinates.latitude}°`);

    try {
      // Calculer l'Ascendant et le MC avec Swiss Ephemeris
      const result = this.se.houses(
        jd, 
        coordinates.latitude, 
        coordinates.longitude, 
        'P' // Placidus
      );

      if (!result || result.length < 13) {
        throw new Error('Erreur lors du calcul des maisons');
      }

      // Les 12 premières valeurs sont les cuspides des maisons (1-12)
      // L'Ascendant est la cuspide de la maison 1
      const ascendant = result[0]; // Maison 1
      const mc = result[9]; // Maison 10

      console.log(`✅ [SwissEphemeris] Ascendant calculé: ${ascendant.toFixed(6)}°`);
      console.log(`✅ [SwissEphemeris] MC calculé: ${mc.toFixed(6)}°`);

      return { ascendant, mc };

    } catch (error) {
      console.error(`❌ [SwissEphemeris] Erreur calcul Ascendant:`, error);
      throw new Error(`Erreur lors du calcul de l'Ascendant: ${error}`);
    }
  }

  /**
   * Détermine le signe zodiacal basé sur la longitude
   */
  private static getZodiacSign(longitude: number): string {
    const normalizedLongitude = ((longitude % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedLongitude / 30);
    
    const signs = [
      'Bélier', 'Taureau', 'Gémeaux', 'Cancer',
      'Lion', 'Vierge', 'Balance', 'Scorpion',
      'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
    ];
    
    return signs[signIndex] || 'Inconnu';
  }

  /**
   * Calcule les degrés et minutes dans le signe
   */
  private static getDegreesInSign(longitude: number): { degrees: number; minutes: number } {
    const normalizedLongitude = ((longitude % 360) + 360) % 360;
    const degreesInSign = normalizedLongitude % 30;
    let degrees = Math.floor(degreesInSign);
    let minutes = Math.round((degreesInSign - degrees) * 60);
    
    // Gérer le cas où minutes = 60
    if (minutes === 60) {
      minutes = 0;
      degrees = (degrees + 1) % 30;
    }
    
    return { degrees, minutes };
  }

  /**
   * Crée un objet HouseCusp
   */
  private static createHouseCusp(house: number, longitude: number): SwissHouseCusp {
    const sign = this.getZodiacSign(longitude);
    const { degrees, minutes } = this.getDegreesInSign(longitude);
    
    return {
      house,
      longitude,
      sign,
      degrees,
      minutes
    };
  }

  /**
   * Détermine dans quelle maison se trouve une planète
   */
  static getPlanetHouse(planetLongitude: number, houseSystem: SwissHouseSystem): number {
    const houses = houseSystem.houses;
    
    // Trouver la maison où se trouve la planète
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i];
      const nextHouse = houses[(i + 1) % houses.length];
      
      // Gérer le cas où on traverse le 0°/360°
      let startLongitude = currentHouse.longitude;
      let endLongitude = nextHouse.longitude;
      
      if (endLongitude < startLongitude) {
        endLongitude += 360;
      }
      
      if (planetLongitude >= startLongitude && planetLongitude < endLongitude) {
        return currentHouse.house;
      }
    }
    
    // Fallback sur la maison I si aucune maison trouvée
    return 1;
  }
}
