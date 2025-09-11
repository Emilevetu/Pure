/**
 * Service de calcul des maisons astrologiques
 * Implémente le système Placidus pour un thème astral complet
 */

import { BirthCoordinates } from './jpl-horizons';

// Interfaces pour les maisons astrologiques
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

export interface BirthData {
  date: string;
  time: string;
  place: string;
}

export class HouseSystemService {
  // Constantes astronomiques
  private static readonly OBLIQUITY_2000 = 23.4392911; // Obliquité de l'écliptique en 2000
  private static readonly SIDEREAL_DAY = 23.9344696; // Jour sidéral en heures
  private static readonly TROPICAL_YEAR = 365.24219; // Année tropique en jours

  /**
   * Calcule l'heure sidérale locale (LST)
   * LST = GST + longitude_est
   */
  private static calculateLocalSiderealTime(
    date: string,
    time: string,
    longitude: number
  ): number {
    console.log(`🕐 [HouseSystem] Calcul de l'heure sidérale locale...`);
    console.log(`📅 Date: ${date}, Heure: ${time}, Longitude: ${longitude}°`);

    // 1. Convertir la date/heure en Julian Day Number
    const jd = this.dateToJulianDay(date, time);
    console.log(`📊 Julian Day: ${jd}`);

    // 2. Calculer le temps sidéral de Greenwich (GST)
    const gst = this.calculateGreenwichSiderealTime(jd);
    console.log(`🌍 GST: ${gst.toFixed(6)} heures`);

    // 3. Convertir la longitude en heures (1° = 4 minutes)
    const longitudeHours = longitude / 15;
    console.log(`📍 Longitude en heures: ${longitudeHours.toFixed(6)}`);

    // 4. Calculer l'heure sidérale locale
    const lst = gst + longitudeHours;
    const normalizedLst = ((lst % 24) + 24) % 24; // Normaliser entre 0-24h
    console.log(`⭐ LST: ${normalizedLst.toFixed(6)} heures`);

    return normalizedLst;
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
   * Calcule le temps sidéral de Greenwich (GST)
   * Formule simplifiée pour les dates récentes
   */
  private static calculateGreenwichSiderealTime(jd: number): number {
    // Époque de référence : J2000.0 (2451545.0)
    const j2000 = 2451545.0;
    const daysSinceJ2000 = jd - j2000;

    // Temps sidéral de Greenwich à J2000.0 (en heures)
    const gstJ2000 = 18.697374558;

    // Taux de rotation sidérale (heures par jour)
    const siderealRate = 1.00273790935;

    // Calculer le GST
    const gst = gstJ2000 + siderealRate * daysSinceJ2000 * 24;
    
    return ((gst % 24) + 24) % 24; // Normaliser entre 0-24h
  }

  /**
   * Calcule l'Ascendant
   * Ascendant = arctan(cos(LST) / (sin(LST) * cos(obliquité) + tan(latitude) * sin(obliquité)))
   */
  private static calculateAscendant(
    lst: number,
    latitude: number,
    obliquity: number = this.OBLIQUITY_2000
  ): number {
    console.log(`🌅 [HouseSystem] Calcul de l'Ascendant...`);
    console.log(`⭐ LST: ${lst.toFixed(6)}h, Latitude: ${latitude}°`);

    // Convertir LST en degrés (1 heure = 15°)
    const lstDegrees = lst * 15;
    console.log(`⭐ LST en degrés: ${lstDegrees.toFixed(6)}°`);

    // Convertir en radians
    const lstRad = (lstDegrees * Math.PI) / 180;
    const latRad = (latitude * Math.PI) / 180;
    const oblRad = (obliquity * Math.PI) / 180;

    // Formule de l'Ascendant
    const numerator = Math.cos(lstRad);
    const denominator = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);

    let ascendantRad = Math.atan2(numerator, denominator);
    
    // Convertir en degrés et normaliser
    let ascendantDegrees = (ascendantRad * 180) / Math.PI;
    ascendantDegrees = ((ascendantDegrees % 360) + 360) % 360;

    console.log(`🌅 Ascendant calculé: ${ascendantDegrees.toFixed(6)}°`);
    return ascendantDegrees;
  }

  /**
   * Calcule le Milieu du Ciel (MC)
   * MC = LST (en degrés)
   */
  private static calculateMidheaven(lst: number): number {
    const mc = (lst * 15) % 360;
    console.log(`🏔️ MC calculé: ${mc.toFixed(6)}°`);
    return mc;
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
    const degrees = Math.floor(degreesInSign);
    const minutes = Math.round((degreesInSign - degrees) * 60);
    
    return { degrees, minutes };
  }

  /**
   * Crée un objet HouseCusp
   */
  private static createHouseCusp(house: number, longitude: number): HouseCusp {
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
   * Calcule les maisons selon le système Placidus
   * Version simplifiée pour le MVP
   */
  private static calculatePlacidusHouses(
    ascendant: number,
    mc: number,
    latitude: number
  ): HouseCusp[] {
    console.log(`🏠 [HouseSystem] Calcul des maisons Placidus...`);
    console.log(`🌅 Ascendant: ${ascendant.toFixed(6)}°, MC: ${mc.toFixed(6)}°`);

    const houses: HouseCusp[] = [];

    // Pour le MVP, on utilise une approximation du système Placidus
    // Les vraies cuspides Placidus nécessitent des calculs itératifs complexes
    
    // Maison I (Ascendant)
    houses.push(this.createHouseCusp(1, ascendant));
    
    // Maison X (MC)
    houses.push(this.createHouseCusp(10, mc));
    
    // Calculer les autres maisons par interpolation
    // Pour le MVP, on utilise une approximation basée sur l'Ascendant et le MC
    
    // Maisons II, III, IV, V, VI, VII, VIII, IX, XI, XII
    const houseOffsets = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    
    for (let i = 0; i < houseOffsets.length; i++) {
      const houseNumber = i < 5 ? i + 2 : i + 3; // Sauter la maison X (déjà calculée)
      const longitude = (ascendant + houseOffsets[i]) % 360;
      houses.push(this.createHouseCusp(houseNumber, longitude));
    }

    // Trier par numéro de maison
    houses.sort((a, b) => a.house - b.house);
    
    console.log(`✅ ${houses.length} maisons calculées`);
    return houses;
  }

  /**
   * Fonction principale pour calculer le système de maisons complet
   */
  static calculateHouseSystem(
    birthData: BirthData,
    coordinates: BirthCoordinates
  ): HouseSystem {
    console.log(`🏠 [HouseSystem] Calcul du système de maisons...`);
    console.log(`📍 Coordonnées: ${coordinates.longitude}°, ${coordinates.latitude}°`);

    try {
      // 1. Calculer l'heure sidérale locale
      const lst = this.calculateLocalSiderealTime(
        birthData.date,
        birthData.time,
        coordinates.longitude
      );

      // 2. Calculer l'Ascendant
      const ascendantLongitude = this.calculateAscendant(
        lst,
        coordinates.latitude
      );

      // 3. Calculer le MC
      const mcLongitude = this.calculateMidheaven(lst);

      // 4. Calculer les 12 maisons
      const houses = this.calculatePlacidusHouses(
        ascendantLongitude,
        mcLongitude,
        coordinates.latitude
      );

      // 5. Créer le système de maisons
      const houseSystem: HouseSystem = {
        ascendant: this.createHouseCusp(1, ascendantLongitude),
        mc: this.createHouseCusp(10, mcLongitude),
        houses,
        system: 'Placidus'
      };

      console.log(`✅ Système de maisons calculé avec succès`);
      console.log(`🌅 Ascendant: ${houseSystem.ascendant.sign} ${houseSystem.ascendant.degrees}°${houseSystem.ascendant.minutes}'`);
      console.log(`🏔️ MC: ${houseSystem.mc.sign} ${houseSystem.mc.degrees}°${houseSystem.mc.minutes}'`);

      return houseSystem;

    } catch (error) {
      console.error(`❌ [HouseSystem] Erreur lors du calcul:`, error);
      throw new Error(`Erreur lors du calcul du système de maisons: ${error}`);
    }
  }

  /**
   * Détermine dans quelle maison se trouve une planète
   */
  static getPlanetHouse(planetLongitude: number, houseSystem: HouseSystem): number {
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
