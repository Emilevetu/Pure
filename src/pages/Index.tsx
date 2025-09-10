import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BirthForm from '../components/BirthForm';
import ResultCard from '../components/ResultCard';
import Footer from '../components/Footer';
import TableauPlanetes from '../components/TableauPlanetes';
import AIAstrologyAnalysis from '../components/AIAstrologyAnalysis';
import { SaveChartButton } from '../components/SaveChartButton';
import { PlanetaryPosition } from '../lib/jpl-horizons';
import { GeocodingService } from '../lib/geocoding';


interface BirthData {
  date: string;
  time: string;
  place: string;
}

interface AstroData {
  sun: any;
  moon: any;
  mercury: any;
  venus: any;
  mars: any;
  jupiter: any;
  saturn: any;
  uranus: any;
  neptune: any;
  pluto: any;
}

const Index = () => {
  const navigate = useNavigate();
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [astroData, setAstroData] = useState<AstroData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [planetaryData, setPlanetaryData] = useState<PlanetaryPosition[]>([]);

  // Convertir les données planétaires en format astroData pour ResultCard
  const createAstroData = (planets: PlanetaryPosition[]) => {
    const astroData: any = {};
    
    planets.forEach(planet => {
      const planetKey = planet.planetId === '10' ? 'sun' :
                       planet.planetId === '301' ? 'moon' :
                       planet.planetId === '199' ? 'mercury' :
                       planet.planetId === '299' ? 'venus' :
                       planet.planetId === '499' ? 'mars' :
                       planet.planetId === '599' ? 'jupiter' :
                       planet.planetId === '699' ? 'saturn' :
                       planet.planetId === '799' ? 'uranus' :
                       planet.planetId === '899' ? 'neptune' :
                       planet.planetId === '999' ? 'pluto' : 'unknown';
      
      if (planetKey !== 'unknown') {
        astroData[planetKey] = {
          longitude: planet.longitude,
          latitude: planet.latitude,
          sign: getZodiacSign(planet.longitude),
          house: Math.floor(planet.longitude / 30) + 1
        };
      }
    });
    
    return astroData;
  };

  // Fonction pour obtenir le signe astrologique
  const getZodiacSign = (longitude: number): string => {
    const signs = [
      'Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge',
      'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'
    ];
    
    const normalizedLongitude = ((longitude % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedLongitude / 30);
    const degreesInSign = Math.floor(normalizedLongitude % 30);
    const minutesInSign = Math.floor((normalizedLongitude % 30 - degreesInSign) * 60);
    
    const sign = signs[signIndex] || 'Inconnu';
    return `${degreesInSign + 1}° ${minutesInSign}' ${sign}`;
  };

  // Gérer la soumission du formulaire de naissance
  const handleFormSubmit = async (data: BirthData) => {
    setIsLoading(true);
    
    try {
      console.log('📝 Données de naissance reçues:', data);
      
      // 1. Convertir le lieu en coordonnées géographiques
      const coordinates = await GeocodingService.getCoordinates(data.place);
      if (!coordinates) {
        throw new Error('Impossible de trouver les coordonnées pour cette ville');
      }
      
      console.log('📍 Coordonnées trouvées:', coordinates);
      
      // 2. Préparer les données pour l'API JPL Horizons
      const birthDateTime = `${data.date} ${data.time}`;
      console.log('🕐 Date/heure de naissance:', birthDateTime);
      
      // 3. Appeler l'API JPL Horizons via le service existant
      const { JPLHorizonsService } = await import('../lib/jpl-horizons');
      const planetaryPositions = await JPLHorizonsService.getAllPlanetaryPositions(
        birthDateTime,
        coordinates
      );
      
      console.log('🌍 Positions planétaires récupérées:', planetaryPositions);
      
      // 4. Mettre à jour l'état
      setBirthData(data);
      setPlanetaryData(planetaryPositions);
      
      // 5. Créer astroData pour ResultCard
      const calculatedAstroData = createAstroData(planetaryPositions);
      setAstroData(calculatedAstroData);
      setShowResults(true);
      
      // Smooth scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Erreur lors de la récupération des données astro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
              <Header />
        
        {/* Hero Section */}
      <main id="hero" className="pt-20">
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              {/* Main title */}
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-6">
                Chaque humain est unique.{' '}
                <span className="text-muted-foreground">Pure vous aide à vous connaître et à connaitre vos proches.</span>
              </h1>
              
              {/* Onboarding Button */}
              <div className="mb-12">
                <button 
                  className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => navigate('/onboarding')}
                >
                  Commencer mon onboarding
                </button>
              </div>
              
              {/* Birth Form */}
              <div className="mb-16">
                <BirthForm onSubmit={handleFormSubmit} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </section>
        
        
        {/* Results Section */}
        {showResults && birthData && astroData && (
          <section id="results" className="py-20 px-6">
            <div className="container mx-auto">
              <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-light mb-4">
                  🌟 Votre carte céleste calculée par la NASA
                </h2>
                <p className="text-muted-foreground text-lg">
                  Positions planétaires précises calculées par JPL Horizons
                </p>
                <div className="mt-6">
                  <SaveChartButton
                    birthData={birthData}
                    astroData={astroData}
                    planetaryData={planetaryData}
                  />
                </div>
              </div>
              
              <ResultCard birthData={birthData} astroData={astroData} />
            </div>
          </section>
        )}
        
        {/* Tableau des Planètes - Affiché seulement après réception des données */}
        {planetaryData.length > 0 && (
          <section className="py-20 px-6 bg-gray-50">
            <div className="container mx-auto">
              <TableauPlanetes planetaryData={planetaryData} birthData={birthData} />
            </div>
          </section>
        )}
        
        {/* Analyse Astrologique IA - Entre le tableau et la carte céleste */}
        {planetaryData.length > 0 && birthData && (
          <section className="py-20 px-6">
            <div className="container mx-auto">
              <AIAstrologyAnalysis planetaryData={planetaryData} birthData={birthData} />
            </div>
          </section>
        )}
        
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

