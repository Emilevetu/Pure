#!/usr/bin/env node

/**
 * Script pour récupérer les coordonnées de toutes les villes
 * Utilise l'API GeoNames (gratuite, 1000 req/heure)
 */

import fs from 'fs';
import path from 'path';

// Liste des villes (copiée du fichier cities.ts)
const cities = [
  // France - Villes principales
  'Paris, France',
  'Marseille, France',
  'Lyon, France',
  'Toulouse, France',
  'Nice, France',
  'Nantes, France',
  'Strasbourg, France',
  'Montpellier, France',
  'Bordeaux, France',
  'Lille, France',
  'Rennes, France',
  'Reims, France',
  'Saint-Étienne, France',
  'Toulon, France',
  'Le Havre, France',
  'Grenoble, France',
  'Dijon, France',
  'Angers, France',
  'Villeurbanne, France',
  'Le Mans, France',
  'Aix-en-Provence, France',
  'Brest, France',
  'Nîmes, France',
  'Limoges, France',
  'Clermont-Ferrand, France',
  'Tours, France',
  'Amiens, France',
  'Perpignan, France',
  'Metz, France',
  'Besançon, France',
  'Boulogne-Billancourt, France',
  'Orléans, France',
  'Mulhouse, France',
  'Rouen, France',
  'Saint-Denis, France',
  'Caen, France',
  'Argenteuil, France',
  'Saint-Paul, France',
  'Montreuil, France',
  'Nancy, France',
  'Roubaix, France',
  'Tourcoing, France',
  'Nanterre, France',
  'Vitry-sur-Seine, France',
  'Avignon, France',
  'Créteil, France',
  'Dunkirk, France',
  'Poitiers, France',
  'Asnières-sur-Seine, France',
  'Courbevoie, France',
  'Versailles, France',
  'Colombes, France',
  'Fort-de-France, France',
  'Aulnay-sous-Bois, France',
  'Saint-Pierre, France',
  'Rueil-Malmaison, France',
  'Pau, France',
  'Aubervilliers, France',
  'Levallois-Perret, France',
  'La Rochelle, France',
  'Champigny-sur-Marne, France',
  'Antibes, France',
  'Saint-Maur-des-Fossés, France',
  'Cannes, France',
  'Calais, France',
  'Bezons, France',
  'Colmar, France',
  'Drancy, France',
  'Mérignac, France',
  'Valence, France',
  'Quimper, France',
  'Bourges, France',
  'Béziers, France',
  'Bastia, France',
  'Albi, France',
  'Agen, France',
  'Ajaccio, France',
  'Annecy, France',
  'Arras, France',
  'Auxerre, France',
  'Bayonne, France',
  'Blois, France',
  'Brive-la-Gaillarde, France',
  'Chambéry, France',
  'Charleville-Mézières, France',
  'Chartres, France',
  'Châteauroux, France',
  'Cholet, France',
  'Neuilly-sur-Seine, France',
  'Cognac, France',
  'Dunkerque, France',
  'Épinal, France',
  'Évreux, France',
  'Forbach, France',
  'Fréjus, France',
  'Gap, France',
  'La Roche-sur-Yon, France',
  'Laval, France',
  'Lorient, France',
  'Mâcon, France',
  'Meaux, France',
  'Melun, France',
  'Moulins, France',
  'Nevers, France',
  'Niort, France',
  'Périgueux, France',
  'Saint-Brieuc, France',
  'Saint-Malo, France',
  'Saint-Nazaire, France',
  'Saint-Quentin, France',
  'Sète, France',
  'Tarbes, France',
  'Thionville, France',
  'Troyes, France',
  'Valenciennes, France',
  'Vannes, France',
  'Vienne, France',
  'Villefranche-sur-Saône, France',

  // Europe - Capitales et grandes villes
  'Londres, Royaume-Uni',
  'Berlin, Allemagne',
  'Madrid, Espagne',
  'Rome, Italie',
  'Amsterdam, Pays-Bas',
  'Bruxelles, Belgique',
  'Vienne, Autriche',
  'Prague, République tchèque',
  'Budapest, Hongrie',
  'Varsovie, Pologne',
  'Stockholm, Suède',
  'Oslo, Norvège',
  'Copenhague, Danemark',
  'Helsinki, Finlande',
  'Dublin, Irlande',
  'Lisbonne, Portugal',
  'Athènes, Grèce',
  'Bucarest, Roumanie',
  'Sofia, Bulgarie',
  'Zagreb, Croatie',
  'Ljubljana, Slovénie',
  'Bratislava, Slovaquie',
  'Tallinn, Estonie',
  'Riga, Lettonie',
  'Vilnius, Lituanie',
  'Luxembourg, Luxembourg',
  'Monaco, Monaco',
  'Andorre-la-Vieille, Andorre',
  'San Marino, San Marino',
  'Vatican, Vatican',
  'Malte, Malte',
  'Chypre, Chypre',
  'Islande, Islande',
  'Liechtenstein, Liechtenstein',

  // Villes européennes importantes
  'Manchester, Royaume-Uni',
  'Birmingham, Royaume-Uni',
  'Liverpool, Royaume-Uni',
  'Glasgow, Royaume-Uni',
  'Edimbourg, Royaume-Uni',
  'Hambourg, Allemagne',
  'Munich, Allemagne',
  'Cologne, Allemagne',
  'Francfort, Allemagne',
  'Stuttgart, Allemagne',
  'Düsseldorf, Allemagne',
  'Dortmund, Allemagne',
  'Essen, Allemagne',
  'Leipzig, Allemagne',
  'Barcelone, Espagne',
  'Valence, Espagne',
  'Séville, Espagne',
  'Saragosse, Espagne',
  'Málaga, Espagne',
  'Milan, Italie',
  'Naples, Italie',
  'Turin, Italie',
  'Palerme, Italie',
  'Gênes, Italie',
  'Bologne, Italie',
  'Florence, Italie',
  'Rotterdam, Pays-Bas',
  'La Haye, Pays-Bas',
  'Utrecht, Pays-Bas',
  'Eindhoven, Pays-Bas',
  'Anvers, Belgique',
  'Gand, Belgique',
  'Charleroi, Belgique',
  'Liège, Belgique',
  'Graz, Autriche',
  'Linz, Autriche',
  'Salzbourg, Autriche',
  'Innsbruck, Autriche',
  'Porto, Portugal',
  'Coimbra, Portugal',
  'Braga, Portugal',
  'Thessalonique, Grèce',
  'Patras, Grèce',
  'Larissa, Grèce',
  'Heraklion, Grèce',
  'Cluj-Napoca, Roumanie',
  'Timișoara, Roumanie',
  'Iași, Roumanie',
  'Constanța, Roumanie',
  'Plovdiv, Bulgarie',
  'Varna, Bulgarie',
  'Bourgas, Bulgarie',
  'Split, Croatie',
  'Rijeka, Croatie',
  'Osijek, Croatie',
  'Maribor, Slovénie',
  'Celje, Slovénie',
  'Kranj, Slovénie',
  'Košice, Slovaquie',
  'Žilina, Slovaquie',
  'Nitra, Slovaquie',
  'Tartu, Estonie',
  'Narva, Estonie',
  'Pärnu, Estonie',
  'Daugavpils, Lettonie',
  'Liepāja, Lettonie',
  'Jelgava, Lettonie',
  'Kaunas, Lituanie',
  'Klaipėda, Lituanie',
  'Šiauliai, Lituanie',

  // Villes suisses
  'Zurich, Suisse',
  'Genève, Suisse',
  'Bâle, Suisse',
  'Berne, Suisse',
  'Lausanne, Suisse',
  'Winterthour, Suisse',
  'Saint-Gall, Suisse',
  'Lucerne, Suisse',
  'Lugano, Suisse',
  'Bienne, Suisse',

  // Villes canadiennes (francophones)
  'Montréal, Canada',
  'Québec, Canada',
  'Ottawa, Canada',
  'Toronto, Canada',
  'Vancouver, Canada',
  'Calgary, Canada',
  'Edmonton, Canada',
  'Winnipeg, Canada',
  'Halifax, Canada',

  // Villes belges
  'Bruxelles, Belgique',
  'Anvers, Belgique',
  'Gand, Belgique',
  'Charleroi, Belgique',
  'Liège, Belgique',
  'Bruges, Belgique',
  'Namur, Belgique',
  'Mons, Belgique',
  'Louvain, Belgique',
  'Tournai, Belgique',

  // Villes luxembourgeoises
  'Luxembourg, Luxembourg',
  'Esch-sur-Alzette, Luxembourg',
  'Differdange, Luxembourg',
  'Dudelange, Luxembourg',
  'Ettelbruck, Luxembourg',
  'Diekirch, Luxembourg',
  'Wiltz, Luxembourg',
  'Grevenmacher, Luxembourg',
  'Remich, Luxembourg',
  'Vianden, Luxembourg'
];

// Fonction pour faire une pause
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour récupérer les coordonnées d'une ville
async function getCityCoordinates(cityName) {
  try {
    // Délai pour respecter les limites de l'API Nominatim (1 req/seconde)
    await sleep(1000); // 1 seconde entre chaque requête
    
    const encodedCity = encodeURIComponent(cityName);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedCity}&format=json&limit=1&countrycodes=fr,be,ch,ca,lu,de,es,it,nl,at,cz,hu,pl,se,no,dk,fi,ie,pt,gr,ro,bg,hr,si,sk,ee,lv,lt,gb,ad,sm,va,mt,cy,is,li&extratags=1`;
    
    console.log(`🔍 Recherche: ${cityName}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data && data.length > 0) {
      const city = data[0];
      const result = {
        name: cityName,
        longitude: parseFloat(city.lon),
        latitude: parseFloat(city.lat),
        altitude: city.elevation ? parseFloat(city.elevation) / 1000 : 0.035 // Convertir mètres en km, défaut 35m
      };
      
      console.log(`✅ Trouvé: ${cityName} → ${result.longitude}, ${result.latitude}, ${result.altitude}km`);
      return result;
    } else {
      console.log(`❌ Non trouvé: ${cityName}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Erreur pour ${cityName}:`, error.message);
    return null;
  }
}

// Fonction principale
async function main() {
  console.log(`🚀 Début de la récupération des coordonnées pour ${cities.length} villes...`);
  console.log(`⏱️  Temps estimé: ${Math.ceil(cities.length * 1 / 60)} minutes`);
  
  const results = [];
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    console.log(`\n📊 Progression: ${i + 1}/${cities.length} (${Math.round((i + 1) / cities.length * 100)}%)`);
    
    const coordinates = await getCityCoordinates(city);
    
    if (coordinates) {
      results.push(coordinates);
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  console.log(`\n🎯 Résultats:`);
  console.log(`✅ Succès: ${successCount}`);
  console.log(`❌ Échecs: ${errorCount}`);
  
  // Générer le nouveau fichier cities.ts
  const newFileContent = `// Liste des villes avec coordonnées pour l'autocomplétion et les calculs astrologiques
export interface CityData {
  name: string;
  longitude: number;
  latitude: number;
  altitude: number;
}

export const cities: CityData[] = [
${results.map(city => `  {
    name: "${city.name}",
    longitude: ${city.longitude},
    latitude: ${city.latitude},
    altitude: ${city.altitude}
  }`).join(',\n')}
];

// Fonction utilitaire pour filtrer les villes
export const filterCities = (query: string): CityData[] => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  return cities
    .filter(city => city.name.toLowerCase().includes(lowerQuery))
    .slice(0, 10); // Limiter à 10 résultats
};

// Fonction pour récupérer les coordonnées d'une ville
export const getCityCoordinates = (cityName: string): CityData | null => {
  return cities.find(city => city.name === cityName) || null;
};
`;

  // Écrire le nouveau fichier
  const outputPath = path.join(process.cwd(), 'src/lib/cities-with-coordinates.ts');
  fs.writeFileSync(outputPath, newFileContent);
  
  console.log(`\n📁 Fichier généré: ${outputPath}`);
  console.log(`🎉 Terminé ! ${successCount} villes avec coordonnées récupérées.`);
}

// Lancer le script
main().catch(console.error);
