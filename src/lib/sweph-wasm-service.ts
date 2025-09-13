/**
 * Service Swiss Ephemeris avec sweph-wasm
 * Version simplifiée et fonctionnelle
 */

import { SwissEPH } from 'sweph-wasm';

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

export class SwephWasmService {
  private static swe: any = null;

  /**
   * Initialise le module Swiss Ephemeris
   */
  static async init(): Promise<void> {
    if (!this.swe) {
      console.log('🔧 [SwephWasm] Début initialisation...');
      
      try {
        console.log('📦 [SwephWasm] Initialisation SwissEPH...');
        this.swe = await SwissEPH.init();
        
        console.log('📦 [SwephWasm] Module chargé:', typeof this.swe);
        console.log('📦 [SwephWasm] Méthodes disponibles:', Object.getOwnPropertyNames(this.swe));
        
        // Configurer le chemin des éphémérides (optionnel)
        console.log('📁 [SwephWasm] Configuration des éphémérides...');
        await this.swe.swe_set_ephe_path();
        
        console.log('✅ [SwephWasm] Initialisation terminée avec succès');
        
      } catch (error) {
        console.error('❌ [SwephWasm] Erreur initialisation:', error);
        throw error;
      }
    } else {
      console.log('♻️ [SwephWasm] Déjà initialisé');
    }
  }

  /**
   * Calcule l'Ascendant et le MC pour des données de naissance
   */
  static async calculateAscendant(birthData: BirthData): Promise<AstroResult> {
    try {
      console.log('🧮 [SwephWasm] Début calcul Ascendant...');
      console.log('📅 [SwephWasm] Données:', birthData);
      
      await this.init();
      
      // Convertir la date en Julian Day
      const [year, month, day] = birthData.date.split('-').map(Number);
      const [hours, minutes] = birthData.time.split(':').map(Number);
      
      console.log('📅 [SwephWasm] Date/heure:', { year, month, day, hours, minutes });
      
      // Calculer le Julian Day
      const jd = this.swe.swe_julday(year, month, day, hours + minutes / 60, 1); // 1 = Gregorian
      console.log(`📅 [SwephWasm] Julian Day: ${jd}`);
      
      // Calculer les maisons (Ascendant et MC)
      console.log('🏠 [SwephWasm] Calcul des maisons...');
      const houses = this.swe.swe_houses(jd, birthData.latitude, birthData.longitude, 'P'); // P = Placidus
      
      console.log('🏠 [SwephWasm] Résultat maisons:', houses);
      
      const ascendant = houses.ascendant;
      const mc = houses.mc;
      
      console.log(`🌅 [SwephWasm] Ascendant: ${ascendant.toFixed(6)}°`);
      console.log(`🏔️ [SwephWasm] MC: ${mc.toFixed(6)}°`);
      
      return {
        ascendant,
        mc,
        success: true
      };
      
    } catch (error: any) {
      console.error('❌ [SwephWasm] Erreur calcul:', error);
      return {
        ascendant: 0,
        mc: 0,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Test avec les données de Neuilly-sur-Seine
   */
  static async testNeuilly(): Promise<void> {
    console.log('🧪 [SwephWasm] Test Neuilly-sur-Seine...');
    
    const testData: BirthData = {
      date: '2002-10-03',
      time: '11:00',
      latitude: 48.8844,
      longitude: 2.2667
    };
    
    const result = await this.calculateAscendant(testData);
    
    if (result.success) {
      console.log('✅ [SwephWasm] Test réussi !');
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
      
    } else {
      console.error('❌ [SwephWasm] Test échoué:', result.error);
    }
  }
}

