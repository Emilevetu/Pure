/**
 * Démonstration Swiss Ephemeris - Test avec ton cas spécifique
 * 3 octobre 2002, 11h, Neuilly-sur-Seine
 */

import { SwissEphemerisTestService, BirthCoordinates, BirthData } from './swiss-ephemeris-test';

export async function testSwissEphemeris(): Promise<void> {
  console.log('🧪 [DEMO] Test Swiss Ephemeris avec ton cas...');
  
  try {
    // Initialiser Swiss Ephemeris
    await SwissEphemerisTestService.initialize();
    
    // Données de test (ton cas)
    const birthData: BirthData = {
      date: '2002-10-03',
      time: '11:00',
      place: 'Neuilly-sur-Seine, France'
    };
    
    const coordinates: BirthCoordinates = {
      longitude: 2.3483915, // Paris/Neuilly
      latitude: 48.8534951,
      altitude: 35
    };
    
    console.log('📊 [DEMO] Données de test:');
    console.log(`   Date: ${birthData.date}`);
    console.log(`   Heure: ${birthData.time}`);
    console.log(`   Lieu: ${birthData.place}`);
    console.log(`   Coordonnées: ${coordinates.longitude}°, ${coordinates.latitude}°`);
    
    // 1. Conversion UTC
    const utcDateTime = SwissEphemerisTestService.convertLocalToUTC(
      birthData.date, 
      birthData.time, 
      birthData.place
    );
    console.log(`🕐 [DEMO] UTC: ${utcDateTime}`);
    
    // 2. Calcul des positions planétaires
    console.log('🌍 [DEMO] Calcul des positions planétaires...');
    const planetaryPositions = await SwissEphemerisTestService.getAllPlanetaryPositions(
      utcDateTime, 
      coordinates
    );
    
    console.log('📊 [DEMO] Positions calculées:');
    planetaryPositions.forEach(planet => {
      console.log(`   ${planet.planet}: ${planet.longitude.toFixed(6)}°`);
    });
    
    // 3. Calcul du système de maisons
    console.log('🏠 [DEMO] Calcul du système de maisons Placidus...');
    const houseSystem = await SwissEphemerisTestService.calculateHouseSystem(
      utcDateTime,
      coordinates,
      'Placidus'
    );
    
    console.log('🏠 [DEMO] Système de maisons:');
    console.log(`   Ascendant: ${houseSystem.ascendant.sign} ${houseSystem.ascendant.degrees}°${houseSystem.ascendant.minutes}'`);
    console.log(`   MC: ${houseSystem.mc.sign} ${houseSystem.mc.degrees}°${houseSystem.mc.minutes}'`);
    
    // 4. Test avec 13h pour comparaison
    console.log('\n🔄 [DEMO] Test avec 13h pour comparaison...');
    const utcDateTime13 = SwissEphemerisTestService.convertLocalToUTC(
      birthData.date, 
      '13:00', 
      birthData.place
    );
    
    const houseSystem13 = await SwissEphemerisTestService.calculateHouseSystem(
      utcDateTime13,
      coordinates,
      'Placidus'
    );
    
    console.log('🏠 [DEMO] Système de maisons (13h):');
    console.log(`   Ascendant: ${houseSystem13.ascendant.sign} ${houseSystem13.ascendant.degrees}°${houseSystem13.ascendant.minutes}'`);
    console.log(`   MC: ${houseSystem13.mc.sign} ${houseSystem13.mc.degrees}°${houseSystem13.mc.minutes}'`);
    
    // 5. Résumé
    console.log('\n📋 [DEMO] RÉSUMÉ:');
    console.log(`   11h → Ascendant: ${houseSystem.ascendant.sign} ${houseSystem.ascendant.degrees}°${houseSystem.ascendant.minutes}'`);
    console.log(`   13h → Ascendant: ${houseSystem13.ascendant.sign} ${houseSystem13.ascendant.degrees}°${houseSystem13.ascendant.minutes}'`);
    console.log(`   Objectif: Scorpion 12°50'`);
    
    // 6. Analyse
    const targetSign = 'Scorpion';
    const targetDegrees = 12;
    const targetMinutes = 50;
    
    const isCorrectSign = houseSystem.ascendant.sign === targetSign;
    const isCorrectDegrees = houseSystem.ascendant.degrees === targetDegrees;
    const isCorrectMinutes = houseSystem.ascendant.minutes === targetMinutes;
    
    console.log('\n🎯 [DEMO] ANALYSE:');
    console.log(`   Signe correct: ${isCorrectSign ? '✅' : '❌'} (${houseSystem.ascendant.sign} vs ${targetSign})`);
    console.log(`   Degrés corrects: ${isCorrectDegrees ? '✅' : '❌'} (${houseSystem.ascendant.degrees}° vs ${targetDegrees}°)`);
    console.log(`   Minutes correctes: ${isCorrectMinutes ? '✅' : '❌'} (${houseSystem.ascendant.minutes}' vs ${targetMinutes}')`);
    
    if (isCorrectSign && isCorrectDegrees && isCorrectMinutes) {
      console.log('🎉 [DEMO] SUCCÈS ! Swiss Ephemeris donne le bon résultat !');
    } else {
      console.log('⚠️ [DEMO] Résultat différent, mais vérifions la précision...');
    }
    
  } catch (error) {
    console.error('❌ [DEMO] Erreur lors du test:', error);
  }
}

