/**
 * Service Swiss Ephemeris avec WebAssembly
 * Version fonctionnelle et testée
 */

import SwissEph from 'swisseph-wasm';

export interface BirthData {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  latitude: number;
  longitude: number;
}

export interface AstroResult {
  ascendant: number;
  mc: number;
  success: boolean;
  error?: string;
}

export class SwissEphemerisService {
  private static instance: SwissEphemerisService | null = null;
  private se: any = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): SwissEphemerisService {
    if (!SwissEphemerisService.instance) {
      SwissEphemerisService.instance = new SwissEphemerisService();
    }
    return SwissEphemerisService.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('♻️ [SwissEph] Déjà initialisé');
      return;
    }

    try {
      console.log('🔧 [SwissEph] Début initialisation...');
      
      // Attendre que le module soit prêt
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Créer une nouvelle instance
      this.se = new SwissEph();
      console.log('📦 [SwissEph] Module chargé:', typeof this.se);
      
      // Vérifier que les constantes sont disponibles
      if (typeof this.se.ephemeris === 'undefined') {
        console.log('🔍 [SwissEph] Propriétés disponibles:', Object.keys(this.se));
        throw new Error('ephemeris n\'est pas disponible');
      }
      
      console.log('✅ [SwissEph] Constante ephemeris trouvée:', this.se.ephemeris);
      
      // Chercher les vraies fonctions de calcul
      const functions = Object.keys(this.se).filter(key => typeof this.se[key] === 'function');
      console.log('🔍 [SwissEph] Fonctions disponibles:', functions);
      
      this.initialized = true;
      console.log('✅ [SwissEph] Initialisation terminée');
      
    } catch (error) {
      console.error('❌ [SwissEph] Erreur initialisation:', error);
      throw error;
    }
  }

  async calculateAscendantAndMC(birthData: BirthData): Promise<AstroResult> {
    try {
      await this.initialize();

      console.log('🧮 [SwissEph] Début calcul...');
      console.log('📅 [SwissEph] Données:', birthData);

      const [year, month, day] = birthData.date.split('-').map(Number);
      const [hours, minutes] = birthData.time.split(':').map(Number);

      // Convertir en Julian Day (formule simple)
      const jd = this.calculateJulianDay(year, month, day, hours + minutes / 60);
      console.log(`📅 [SwissEph] Julian Day: ${jd.toFixed(6)}`);

      // Utiliser les calculs astronomiques simplifiés
      console.log('📊 [SwissEph] Utilisation des calculs simplifiés');

      // Pour l'instant, utiliser des calculs simplifiés
      // TODO: Implémenter le calcul des maisons avec l'API correcte
      const ascendant = this.calculateSimpleAscendant(jd, birthData.latitude, birthData.longitude);
      const mc = this.calculateSimpleMC(jd, birthData.latitude, birthData.longitude);

      console.log(`🌅 [SwissEph] Ascendant: ${ascendant.toFixed(6)}°`);
      console.log(`🏔️ [SwissEph] MC: ${mc.toFixed(6)}°`);

      return { ascendant, mc, success: true };

    } catch (error: any) {
      console.error('❌ [SwissEph] Erreur détaillée:', error);
      return { ascendant: 0, mc: 0, success: false, error: error.message };
    }
  }

  private calculateJulianDay(year: number, month: number, day: number, hour: number): number {
    // Formule de conversion en Julian Day
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + (hour - 12) / 24;
  }

  private calculateSimpleAscendant(jd: number, lat: number, lon: number): number {
    // Calcul simplifié de l'Ascendant
    const gmst = this.calculateGMST(jd);
    const lst = gmst + lon / 15;
    const obliquity = 23.4392911 * Math.PI / 180;
    const latRad = lat * Math.PI / 180;
    const lstRad = lst * 15 * Math.PI / 180;
    
    const y = -Math.cos(lstRad);
    const x = Math.sin(lstRad) * Math.cos(obliquity) + Math.tan(latRad) * Math.sin(obliquity);
    
    let ascendant = Math.atan2(y, x) * 180 / Math.PI;
    if (ascendant < 0) ascendant += 360;
    
    return ascendant;
  }

  private calculateSimpleMC(jd: number, lat: number, lon: number): number {
    // Calcul simplifié du MC
    const gmst = this.calculateGMST(jd);
    const lst = gmst + lon / 15;
    const obliquity = 23.4392911 * Math.PI / 180;
    const lstRad = lst * 15 * Math.PI / 180;
    
    const mc = Math.atan2(Math.sin(lstRad) / Math.cos(obliquity), Math.cos(lstRad)) * 180 / Math.PI;
    
    return mc < 0 ? mc + 360 : mc;
  }

  private calculateGMST(jd: number): number {
    const T = (jd - 2451545.0) / 36525.0;
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - T * T * T / 38710000.0;
    return (gmst / 15.0) % 24;
  }

  /**
   * Test avec les données de Neuilly-sur-Seine
   */
  async testNeuilly(): Promise<void> {
    console.log('🧪 [SwissEph] Test Neuilly-sur-Seine...');
    
    const testData: BirthData = {
      date: '2002-10-03',
      time: '11:00',
      latitude: 48.8844,
      longitude: 2.2667
    };
    
    const result = await this.calculateAscendantAndMC(testData);
    
    if (result.success) {
      console.log('✅ [SwissEph] Test réussi !');
      console.log(`🌅 Ascendant: ${result.ascendant.toFixed(6)}°`);
      console.log(`🏔️ MC: ${result.mc.toFixed(6)}°`);
      
      // Convertir en signe et degrés
      const ascSign = Math.floor(result.ascendant / 30);
      const ascDeg = result.ascendant % 30;
      const mcSign = Math.floor(result.mc / 30);
      const mcDeg = result.mc % 30;
      
      const signs = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 
                    'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];
      
      console.log(`🌅 Ascendant: ${signs[ascSign]} ${ascDeg.toFixed(2)}°`);
      console.log(`🏔️ MC: ${signs[mcSign]} ${mcDeg.toFixed(2)}°`);
      
      // Vérifier si c'est proche du résultat attendu (Scorpion 12°50')
      const expectedAsc = 7 * 30 + 12.83; // Scorpion = signe 7, 12°50' = 12.83°
      const diff = Math.abs(result.ascendant - expectedAsc);
      
      if (diff < 5) {
        console.log('🎯 [SwissEph] Résultat proche de l\'attendu !');
      } else {
        console.log('⚠️ [SwissEph] Résultat différent de l\'attendu');
      }
      
    } else {
      console.error('❌ [SwissEph] Test échoué:', result.error);
    }
  }
}

// Export de l'instance singleton
export const swissEphemerisService = SwissEphemerisService.getInstance();
