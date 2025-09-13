/**
 * Calculs astrologiques simples et fiables
 * Version sans WebAssembly pour éviter les problèmes
 */

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

/**
 * Calcule l'Ascendant et le MC avec des formules astronomiques simples
 */
export function calculateAscendant(birthData: BirthData): AstroResult {
  try {
    console.log('🧮 [SimpleAstro] Début calcul...');
    console.log('📅 [SimpleAstro] Données:', birthData);
    
    // Convertir la date en Julian Day
    const [year, month, day] = birthData.date.split('-').map(Number);
    const [hours, minutes] = birthData.time.split(':').map(Number);
    
    console.log('📅 [SimpleAstro] Date/heure:', { year, month, day, hours, minutes });
    
    // Calculer le Julian Day (formule simplifiée)
    const jd = 367 * year - Math.floor(7 * (year + Math.floor((month + 9) / 12)) / 4) + 
               Math.floor(275 * month / 9) + day + 1721013.5 + (hours + minutes / 60) / 24;
    
    console.log(`📅 [SimpleAstro] Julian Day: ${jd.toFixed(6)}`);
    
    // Calculer le temps sidéral de Greenwich (GMST)
    const T = (jd - 2451545.0) / 36525.0;
    const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 
                 0.000387933 * T * T - T * T * T / 38710000.0;
    
    // Convertir en heures et normaliser
    let gmstHours = (gmst / 15.0) % 24;
    if (gmstHours < 0) gmstHours += 24;
    
    console.log(`⏰ [SimpleAstro] GMST: ${gmstHours.toFixed(6)} heures`);
    
    // Calculer le temps sidéral local (LST)
    let lstHours = (gmstHours + birthData.longitude / 15.0) % 24;
    if (lstHours < 0) lstHours += 24;
    
    console.log(`⏰ [SimpleAstro] LST: ${lstHours.toFixed(6)} heures`);
    
    // Convertir en radians
    const lstRad = (lstHours * 15.0) * Math.PI / 180.0;
    const latRad = birthData.latitude * Math.PI / 180.0;
    
    // Calculer l'obliquité de l'écliptique (approximation)
    const obliquity = 23.4392911 - 0.0130042 * T - 0.00000016 * T * T + 0.000000503 * T * T * T;
    const oblRad = obliquity * Math.PI / 180.0;
    
    console.log(`🌍 [SimpleAstro] Obliquité: ${obliquity.toFixed(6)}°`);
    
    // Calculer l'Ascendant (formule correcte)
    const y = -Math.cos(lstRad);
    const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
    const ascendantRad = Math.atan2(y, x);
    let ascendant = (ascendantRad * 180.0 / Math.PI + 360.0) % 360.0;
    
    console.log(`🌅 [SimpleAstro] Ascendant: ${ascendant.toFixed(6)}°`);
    
    // Calculer le MC (Midheaven)
    const mcRad = Math.atan2(Math.sin(lstRad) / Math.cos(oblRad), Math.cos(lstRad));
    let mc = (mcRad * 180.0 / Math.PI + 360.0) % 360.0;
    
    console.log(`🏔️ [SimpleAstro] MC: ${mc.toFixed(6)}°`);
    
    return {
      ascendant,
      mc,
      success: true
    };
    
  } catch (error: any) {
    console.error('❌ [SimpleAstro] Erreur:', error);
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
export function testNeuilly(): void {
  console.log('🧪 [SimpleAstro] Test Neuilly-sur-Seine...');
  
  const testData: BirthData = {
    date: '2002-10-03',
    time: '11:00',
    latitude: 48.8844,
    longitude: 2.2667
  };
  
  const result = calculateAscendant(testData);
  
  if (result.success) {
    console.log('✅ [SimpleAstro] Test réussi !');
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
      console.log('🎯 [SimpleAstro] Résultat proche de l\'attendu !');
    } else {
      console.log('⚠️ [SimpleAstro] Résultat différent de l\'attendu');
    }
    
  } else {
    console.error('❌ [SimpleAstro] Test échoué:', result.error);
  }
}
