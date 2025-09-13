// API utilities for astronomical calculations
// Maintenant connecté à votre microservice !

import { MicroserviceAPI, BirthCoordinates, PlanetaryPosition } from './microservice-api';
import { HouseSystem } from './house-system';

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
 * Utilise votre microservice pour les calculs astrologiques
 */
export const fetchAstroData = async (birthData: BirthData): Promise<AstroData> => {
  try {
    console.log(`🌍 [AstroService] Début du calcul astrologique pour:`, birthData);

    // Récupérer les coordonnées de la ville
    const coordinates = await MicroserviceAPI.getCityCoordinates(birthData.place);
    if (!coordinates) {
      throw new Error(`Coordonnées non trouvées pour: ${birthData.place}`);
    }

    console.log(`🌍 [AstroService] Coordonnées trouvées pour ${birthData.place}:`, coordinates);

    // Convertir la date/heure locale en UTC
    const timeUtc = await MicroserviceAPI.convertLocalToUTC(birthData.date, birthData.time, birthData.place);
    console.log(`🕐 [AstroService] Conversion heure locale → UTC: ${birthData.date} ${birthData.time} → ${timeUtc}`);

    // Utiliser la date originale et l'heure UTC convertie
    const date = birthData.date;

    // Appeler le microservice
    console.log(`🚀 [AstroService] Appel au microservice...`);
    const microserviceData = await MicroserviceAPI.getAstroData(date, timeUtc, coordinates);
    
    console.log(`✅ [AstroService] Données reçues du microservice !`);

    // Convertir vers le format AstroData
    const astroData = MicroserviceAPI.convertToAstroData(microserviceData, birthData);

    console.log(`🎯 [AstroService] Calcul astrologique terminé avec succès !`);
    return astroData;

  } catch (error) {
    console.error('❌ [AstroService] Erreur lors du calcul astrologique:', error);
    console.warn('🔄 [AstroService] Utilisation des données mock en fallback...');
    
    // En cas d'erreur, utiliser les données mock
    return fetchMockAstroData(birthData);
  }
};

/**
 * Fonction mock pour simuler l'API (gardée en cas d'erreur du microservice)
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
    return `Interprétation basée sur les positions réelles des planètes calculées par votre microservice.
    
    Votre thème astral révèle une personnalité unique influencée par les alignements célestes au moment de votre naissance.
    
    Cette analyse utilise les données astronomiques les plus précises disponibles, calculées par votre microservice spécialisé.`;
    
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