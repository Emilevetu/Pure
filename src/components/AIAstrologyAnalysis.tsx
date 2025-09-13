import React, { useState, useEffect } from 'react';
import { PlanetaryPosition } from '../lib/microservice-api';
import { ChatGPTService } from '../lib/chatgpt-service';

interface BirthData {
  date: string;
  time: string;
  place: string;
}

interface AIAstrologyAnalysisProps {
  planetaryData: PlanetaryPosition[];
  birthData: BirthData | null;
}

interface AIResponse {
  analysis: string;
  isLoading: boolean;
  error: string | null;
}

const AIAstrologyAnalysis = ({ planetaryData, birthData }: AIAstrologyAnalysisProps) => {
  const [aiResponse, setAiResponse] = useState<AIResponse>({
    analysis: '',
    isLoading: false,
    error: null
  });

  // Préparer les données pour l'IA
  const prepareDataForAI = () => {
    if (!planetaryData || !birthData) return '';

    const planetInfo = {
      '10': 'Soleil', '301': 'Lune', '199': 'Mercure', '299': 'Vénus',
      '499': 'Mars', '599': 'Jupiter', '699': 'Saturne', '799': 'Uranus',
      '899': 'Neptune', '999': 'Pluton'
    };

    const formattedData = planetaryData.map(planet => {
      const planetName = planetInfo[planet.planetId] || 'Inconnu';
      const sign = getZodiacSign(planet.longitude);
      return `${planetName}: ${sign} (Longitude: ${planet.longitude.toFixed(2)}°, Latitude: ${planet.latitude.toFixed(2)}°)`;
    }).join('\n');

    return `Date de naissance: ${birthData.date} ${birthData.time}
Lieu: ${birthData.place}

Positions planétaires calculées par la NASA JPL Horizons:
${formattedData}

Donne-moi un thème astral complet et détaillé basé sur ces données astronomiques précises.`;
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

  // Générer l'analyse IA avec ChatGPT
  const generateAIAnalysis = async () => {
    if (!planetaryData || !birthData) return;

    setAiResponse(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('🚀 [AI] Starting AI analysis...');
      console.log('📊 [AI] Planetary data available:', planetaryData.length, 'characters');
      console.log('👶 [AI] Birth data available:', birthData ? 'Yes' : 'No');
      
      // Préparer les données pour ChatGPT
      const planetaryDataText = prepareDataForAI();
      const birthDataText = `Date de naissance: ${birthData.date} ${birthData.time}\nLieu: ${birthData.place}`;
      
      console.log('🌍 [AI] Planetary data text length:', planetaryDataText.length);
      console.log('👶 [AI] Birth data text length:', birthDataText.length);
      console.log('🌍 [AI] Planetary data sample (first 300 chars):', planetaryDataText.substring(0, 300));
      console.log('👶 [AI] Birth data sample (first 200 chars):', birthDataText.substring(0, 200));
      
      // Appel à l'API ChatGPT
      console.log('📞 [AI] Calling ChatGPT service...');
      const response = await ChatGPTService.generateAstrologyAnalysis(
        planetaryDataText,
        birthDataText
      );
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setAiResponse({
        analysis: response.content,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setAiResponse({
        analysis: '',
        isLoading: false,
        error: `Error during AI analysis generation: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  // Fonction pour parser le texte Markdown et convertir **texte** en <strong>
  const parseMarkdown = (text: string): JSX.Element[] => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      if (line.trim() === '') {
        // Ligne vide - créer un espacement
        return <div key={index} className="h-4"></div>;
      } else {
        // Ligne avec contenu - parser le markdown
        const parts = line.split(/(\*\*.*?\*\*)/g);
        const lineElements = parts.map((part, partIndex) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            // Texte en gras
            const boldText = part.slice(2, -2);
            return <strong key={partIndex} className="font-bold text-purple-800">{boldText}</strong>;
          } else {
            // Texte normal
            return <span key={partIndex}>{part}</span>;
          }
        });
        
        return (
          <div key={index} className="mb-2">
            {lineElements}
          </div>
        );
      }
    });
  };



  // Déclencher l'analyse automatiquement quand les données sont disponibles
  useEffect(() => {
    if (planetaryData.length > 0 && birthData && !aiResponse.analysis && !aiResponse.isLoading) {
      generateAIAnalysis();
    }
  }, [planetaryData, birthData]);

  if (!planetaryData || !birthData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-lg border border-purple-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-purple-700 mb-2">
          Analyse Bulgare
        </h3>
        <p className="text-gray-600">
          Thème astral généré par intelligence artificielle basé sur les données NASA
        </p>
      </div>

      {aiResponse.isLoading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-purple-600 font-medium">
              Generating your astral chart...
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            AI is analyzing your planetary positions to create a personalized interpretation
          </p>
        </div>
      )}

      {aiResponse.error && (
        <div className="text-center py-6">
          <div className="text-red-600 mb-2">❌ {aiResponse.error}</div>
          <button
            onClick={generateAIAnalysis}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {aiResponse.analysis && !aiResponse.isLoading && (
        <div className="bg-white p-6 rounded-lg border border-purple-200">
          <div className="prose prose-purple max-w-none">
            <div className="text-gray-800 leading-relaxed">
              {parseMarkdown(aiResponse.analysis)}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-purple-200 text-center">
            <button
              onClick={generateAIAnalysis}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔄 Régénérer l'analyse
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAstrologyAnalysis;
