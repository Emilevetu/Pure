import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Star, Moon, Zap, Heart, Target, Crown, Sparkles, Globe } from 'lucide-react';
import { formatLongitude } from '@/lib/astro';

interface BirthData {
  date: string;
  time: string;
  place: string;
}

interface PlanetPosition {
  longitude: number;
  latitude: number;
  sign: string;
  house: string;
}

interface AstroData {
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
}

interface ResultCardProps {
  birthData: BirthData;
  astroData: AstroData;
}

const ResultCard = ({ birthData, astroData }: ResultCardProps) => {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    // Parser la date en composants pour éviter les problèmes de fuseau horaire
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month - 1 car les mois commencent à 0

    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const copyToClipboard = async () => {
    const resultText = `
Thème Astral - ${formatDate(birthData.date)} à ${formatTime(birthData.time)} à ${birthData.place}

🌞 Soleil: ${formatLongitude(astroData.sun.longitude)} ${astroData.sun.sign} - ${astroData.sun.house}
🌙 Lune: ${formatLongitude(astroData.moon.longitude)} ${astroData.moon.sign} - ${astroData.moon.house}
☿ Mercure: ${formatLongitude(astroData.mercury.longitude)} ${astroData.mercury.sign} - ${astroData.mercury.house}
♀ Vénus: ${formatLongitude(astroData.venus.longitude)} ${astroData.venus.sign} - ${astroData.venus.house}
♂ Mars: ${formatLongitude(astroData.mars.longitude)} ${astroData.mars.sign} - ${astroData.mars.house}
♃ Jupiter: ${formatLongitude(astroData.jupiter.longitude)} ${astroData.jupiter.sign} - ${astroData.jupiter.house}
♄ Saturne: ${formatLongitude(astroData.saturn.longitude)} ${astroData.saturn.sign} - ${astroData.saturn.house}
♅ Uranus: ${formatLongitude(astroData.uranus.longitude)} ${astroData.uranus.sign} - ${astroData.uranus.house}
♆ Neptune: ${formatLongitude(astroData.neptune.longitude)} ${astroData.neptune.sign} - ${astroData.neptune.house}
♇ Pluton: ${formatLongitude(astroData.pluto.longitude)} ${astroData.pluto.sign} - ${astroData.pluto.house}

Calculé avec les données précises de la NASA (JPL Horizons)
    `.trim();

    try {
      await navigator.clipboard.writeText(resultText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  const getPlanetIcon = (planetName: string) => {
    const icons: Record<string, React.ReactNode> = {
      sun: <Star className="w-4 h-4 text-yellow-500" />,
      moon: <Moon className="w-4 h-4 text-gray-400" />,
      mercury: <Zap className="w-4 h-4 text-orange-400" />,
      venus: <Heart className="w-4 h-4 text-pink-400" />,
      mars: <Target className="w-4 h-4 text-red-500" />,
      jupiter: <Crown className="w-4 h-4 text-purple-500" />,
      saturn: <Sparkles className="w-4 h-4 text-blue-500" />,
      uranus: <Globe className="w-4 h-4 text-cyan-400" />,
      neptune: <Globe className="w-4 h-4 text-indigo-500" />,
      pluto: <Globe className="w-4 h-4 text-gray-600" />
    };
    return icons[planetName] || <Star className="w-4 h-4" />;
  };

  const getPlanetName = (planetName: string) => {
    const names: Record<string, string> = {
      sun: 'Soleil',
      moon: 'Lune',
      mercury: 'Mercure',
      venus: 'Vénus',
      mars: 'Mars',
      jupiter: 'Jupiter',
      saturn: 'Saturne',
      uranus: 'Uranus',
      neptune: 'Neptune',
      pluto: 'Pluton'
    };
    return names[planetName] || planetName;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-xl">
      <CardHeader className="text-center pb-6">
        <div className="text-gray-600 mt-2">
          <p className="text-lg">
            Né(e) le <span className="font-semibold">{formatDate(birthData.date)}</span> à{' '}
            <span className="font-semibold">{formatTime(birthData.time)}</span> à{' '}
            <span className="font-semibold">{birthData.place}</span>
          </p>
          <p className="text-sm text-blue-600 mt-1">
            ✨ Positions calculées avec les données précises de la NASA (JPL Horizons)
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Positions planétaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(astroData).map(([planetKey, planetData]) => (
            <div
              key={planetKey}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3 mb-3">
                {getPlanetIcon(planetKey)}
                <h3 className="font-semibold text-gray-800">
                  {getPlanetName(planetKey)}
                </h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Position:</span>
                  <Badge variant="outline" className="font-mono">
                    {formatLongitude(planetData.longitude)}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Signe:</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {planetData.sign}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Maison:</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {planetData.house}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Latitude:</span>
                  <span className="text-sm font-mono text-gray-700">
                    {planetData.latitude.toFixed(2)}°
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de copie */}
        <div className="text-center pt-4">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-600" />
                Copié !
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copier le thème
              </>
            )}
          </Button>
        </div>

        {/* Note sur la précision */}
        <div className="text-center text-sm text-gray-500 bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p>
            🚀 <strong>Précision NASA :</strong> Ce thème astral utilise les positions planétaires 
            calculées par le Jet Propulsion Laboratory de la NASA, garantissant une précision 
            astronomique pour vos coordonnées célestes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultCard;