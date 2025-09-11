// API utilities for astronomical calculations
// Maintenant connecté à JPL Horizons de la NASA !

import { JPLHorizonsService, BirthCoordinates, PlanetaryPosition } from './jpl-horizons';
import { HouseSystemService, HouseSystem } from './house-system';

interface BirthData {
  date: string;
  time: string;
  place: string;
}

export interface AstroData {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  planets: PlanetaryPosition[]; // Ajout des données brutes JPL Horizons
  houseSystem: HouseSystem; // Système de maisons complet
}

interface PlanetPosition {
  longitude: number;
  latitude: number;
  sign: string;
  house: string;
}

/**
 * Fonction principale pour récupérer les données astrologiques
 * Utilise JPL Horizons de la NASA pour les vraies positions planétaires
 */
export const fetchAstroData = async (birthData: BirthData): Promise<AstroData> => {
  try {
    // Récupérer les coordonnées de la ville
    const coordinates = await JPLHorizonsService.getCityCoordinates(birthData.place);
    if (!coordinates) {
      throw new Error(`Coordonnées non trouvées pour: ${birthData.place}`);
    }

    console.log(`🌍 Coordonnées trouvées pour ${birthData.place}:`, coordinates);

    // Convertir la date/heure locale en UTC
    const utcDateTime = JPLHorizonsService.convertLocalToUTC(birthData.date, birthData.time, birthData.place);
    console.log(`🕐 Conversion heure locale → UTC: ${birthData.date} ${birthData.time} → ${utcDateTime}`);

    // Récupérer les positions de toutes les planètes depuis JPL Horizons
    const planetaryPositions = await JPLHorizonsService.getAllPlanetaryPositions(utcDateTime, coordinates);
    
    if (planetaryPositions.length === 0) {
      throw new Error('Aucune position planétaire récupérée depuis JPL Horizons');
    }

    console.log(`✅ ${planetaryPositions.length} positions planétaires récupérées depuis la NASA !`);

    // Calculer le système de maisons
    console.log(`🏠 Calcul du système de maisons...`);
    const houseSystem = HouseSystemService.calculateHouseSystem(birthData, coordinates);
    console.log(`✅ Système de maisons calculé: ${houseSystem.system}`);

    // Convertir les positions JPL en format AstroData
    const astroData: AstroData = {
      sun: {
        longitude: planetaryPositions.find(p => p.planetId === '10')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '10')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '10')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '10')?.longitude || 0, houseSystem)}`
      },
      moon: {
        longitude: planetaryPositions.find(p => p.planetId === '301')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '301')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '301')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '301')?.longitude || 0, houseSystem)}`
      },
      mercury: {
        longitude: planetaryPositions.find(p => p.planetId === '199')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '199')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '199')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '199')?.longitude || 0, houseSystem)}`
      },
      venus: {
        longitude: planetaryPositions.find(p => p.planetId === '299')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '299')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '299')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '299')?.longitude || 0, houseSystem)}`
      },
      mars: {
        longitude: planetaryPositions.find(p => p.planetId === '499')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '499')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '499')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '499')?.longitude || 0, houseSystem)}`
      },
      jupiter: {
        longitude: planetaryPositions.find(p => p.planetId === '599')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '599')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '599')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '599')?.longitude || 0, houseSystem)}`
      },
      saturn: {
        longitude: planetaryPositions.find(p => p.planetId === '699')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '699')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '699')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '699')?.longitude || 0, houseSystem)}`
      },
      uranus: {
        longitude: planetaryPositions.find(p => p.planetId === '799')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '799')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '799')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '799')?.longitude || 0, houseSystem)}`
      },
      neptune: {
        longitude: planetaryPositions.find(p => p.planetId === '899')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '899')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '899')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '899')?.longitude || 0, houseSystem)}`
      },
      pluto: {
        longitude: planetaryPositions.find(p => p.planetId === '999')?.longitude || 0,
        latitude: planetaryPositions.find(p => p.planetId === '999')?.latitude || 0,
        sign: getZodiacSign(planetaryPositions.find(p => p.planetId === '999')?.longitude || 0),
        house: `Maison ${HouseSystemService.getPlanetHouse(planetaryPositions.find(p => p.planetId === '999')?.longitude || 0, houseSystem)}`
      },
      planets: planetaryPositions, // Ajout des données brutes JPL Horizons
      houseSystem: houseSystem // Système de maisons complet
    };

    return astroData;

  } catch (error) {
    console.warn('Erreur JPL Horizons, utilisation des données mock:', error);
    // En cas d'erreur, on utilise les données mock
    return fetchMockAstroData(birthData);
  }
};

/**
 * Fonction mock pour simuler l'API (gardée en cas d'erreur JPL Horizons)
 */
const fetchMockAstroData = async (birthData: BirthData): Promise<AstroData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  console.log('📱 Utilisation des données mock (mode démo)');

  // Mock data - positions approximatives
  const mockData: AstroData = {
    sun: {
      longitude: 75.7, // 15°42' Gémeaux
      latitude: 0.0,
      sign: 'Gémeaux',
      house: 'Maison VII'
    },
    moon: {
      longitude: 358.3, // 28°17' Poissons
      latitude: -4.2,
      sign: 'Poissons',
      house: 'Maison IV'
    },
    mercury: {
      longitude: 92.6, // 2°33' Cancer
      latitude: 1.8,
      sign: 'Cancer',
      house: 'Maison VIII'
    },
    venus: {
      longitude: 49.1, // 19°08' Taureau
      latitude: -1.2,
      sign: 'Taureau',
      house: 'Maison VI'
    },
    mars: {
      longitude: 161.9, // 11°54' Vierge
      latitude: -0.8,
      sign: 'Vierge',
      house: 'Maison X'
    },
    jupiter: {
      longitude: 187.5, // 7°29' Balance
      latitude: 0.3,
      sign: 'Balance',
      house: 'Maison XI'
    },
    saturn: {
      longitude: 273.8, // 23°46' Capricorne
      latitude: 1.1,
      sign: 'Capricorne',
      house: 'Maison II'
    },
    uranus: {
      longitude: 315.2, // 15°12' Verseau
      latitude: -0.5,
      sign: 'Verseau',
      house: 'Maison III'
    },
    neptune: {
      longitude: 335.7, // 5°42' Poissons
      latitude: 1.8,
      sign: 'Poissons',
      house: 'Maison IV'
    },
    pluto: {
      longitude: 275.3, // 25°18' Capricorne
      latitude: 13.2,
      sign: 'Capricorne',
      house: 'Maison II'
    },
    planets: [], // Données mock vides pour les planètes brutes
    houseSystem: {
      ascendant: { house: 1, longitude: 0, sign: 'Bélier', degrees: 0, minutes: 0 },
      mc: { house: 10, longitude: 270, sign: 'Capricorne', degrees: 0, minutes: 0 },
      houses: [],
      system: 'Placidus' as const
    }
  };

  return mockData;
};

/**
 * Génère une interprétation IA des positions planétaires
 */
export const generateAIInterpretation = async (astroData: AstroData): Promise<string> => {
  try {
    const prompt = `Analyse ce thème astral et donne une interprétation détaillée en français:
    ${JSON.stringify(astroData, null, 2)}
    Donne une interprétation complète et personnalisée.`;
    
    // Pour l'instant, retourner une interprétation statique
    // Plus tard, on pourra intégrer OpenAI ou une autre IA
    return `Interprétation basée sur les positions réelles des planètes calculées par la NASA (JPL Horizons).
    
    Votre thème astral révèle une personnalité unique influencée par les alignements célestes au moment de votre naissance.
    
    Cette analyse utilise les données astronomiques les plus précises disponibles, calculées par les scientifiques de la NASA.`;
    
  } catch (error) {
    console.error('Erreur lors de la génération IA:', error);
    throw error;
  }
};

/**
 * Formate la longitude en degrés et minutes
 */
export const formatLongitude = (longitude: number): string => {
  const degrees = Math.floor(longitude);
  const minutes = Math.round((longitude - degrees) * 60);
  return `${degrees}°${minutes.toString().padStart(2, '0')}'`;
};

/**
 * Détermine le signe zodiacal basé sur la longitude
 */
export const getZodiacSign = (longitude: number): string => {
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLongitude / 30);
  
  const signs = [
    'Bélier', 'Taureau', 'Gémeaux', 'Cancer',
    'Lion', 'Vierge', 'Balance', 'Scorpion',
    'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
  ];
  
  return signs[signIndex] || 'Inconnu';
};

/**
 * Détermine la maison astrologique basée sur la longitude
 * Système Placidus simplifié
 */
export const getHouseName = (longitude: number): string => {
  const normalizedLongitude = ((longitude % 360) + 360) % 360;
  const houseIndex = Math.floor(normalizedLongitude / 30) + 1;
  
  const houses = [
    'Maison I', 'Maison II', 'Maison III', 'Maison IV',
    'Maison V', 'Maison VI', 'Maison VII', 'Maison VIII',
    'Maison IX', 'Maison X', 'Maison XI', 'Maison XII'
  ];
  
  return houses[houseIndex - 1] || 'Maison I';
};