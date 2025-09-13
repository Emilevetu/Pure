import { cities, getCityCoordinates } from './cities';
import { convertLocalToUTCSimple } from './timezone-utils';

// Test de conversion timezone
export function testTimezoneConversion() {
  console.log('🧪 Test de conversion timezone...\n');

  // Test avec Neuilly-sur-Seine (3 oct 2002, 11h00)
  const city = getCityCoordinates('Neuilly-sur-Seine, France');
  if (!city) {
    console.error('❌ Ville non trouvée');
    return;
  }

  console.log(`📍 Ville: ${city.name}`);
  console.log(`🌍 Timezone: ${city.timezone}`);
  console.log(`📅 Date: 2002-10-03`);
  console.log(`🕐 Heure locale: 11:00\n`);

  // Conversion
  const result = convertLocalToUTCSimple('11:00', '2002-10-03', city);
  
  console.log('🔄 Résultat de la conversion:');
  console.log(`   Heure UTC: ${result.utcTime}`);
  console.log(`   Offset: ${result.offsetHours}h`);
  console.log(`   Timezone: ${result.timezone}\n`);

  // Test avec d'autres villes
  const testCities = [
    { name: 'Londres, Royaume-Uni', time: '11:00' },
    { name: 'Berlin, Allemagne', time: '11:00' },
    { name: 'Madrid, Espagne', time: '11:00' }
  ];

  console.log('🌍 Tests avec d\'autres villes:');
  testCities.forEach(({ name, time }) => {
    const testCity = getCityCoordinates(name);
    if (testCity) {
      const testResult = convertLocalToUTCSimple(time, '2002-10-03', testCity);
      console.log(`   ${name}: ${time} → ${testResult.utcTime} UTC (${testResult.offsetHours}h)`);
    }
  });
}

// Exemple d'utilisation pour ton microservice
export function prepareDataForMicroservice(
  localTime: string,
  date: string,
  cityName: string
) {
  const city = getCityCoordinates(cityName);
  if (!city) {
    throw new Error(`Ville non trouvée: ${cityName}`);
  }

  const utcResult = convertLocalToUTCSimple(localTime, date, city);
  
  return {
    // Données originales
    localTime,
    date,
    city: city.name,
    timezone: city.timezone,
    
    // Données converties pour le microservice
    utcTime: utcResult.utcTime,
    utcDateTime: `${date}T${utcResult.utcTime}:00Z`,
    latitude: city.latitude,
    longitude: city.longitude,
    altitude: city.altitude,
    
    // Métadonnées
    offsetHours: utcResult.offsetHours
  };
}
