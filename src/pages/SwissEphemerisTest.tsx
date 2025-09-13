import React, { useState, useEffect } from 'react';
import { swissEphemerisService } from '../lib/swiss-ephemeris-service';

const SwissEphemerisTest: React.FC = () => {
  const [ascendant, setAscendant] = useState<number | null>(null);
  const [mc, setMc] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const runTest = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🚀 [SwissEphTest] Lancement du test...');
        await swissEphemerisService.testNeuilly();
        
        // Récupérer les résultats pour l'affichage
        const result = await swissEphemerisService.calculateAscendantAndMC({
          date: '2002-10-03',
          time: '11:00',
          latitude: 48.8844,
          longitude: 2.2667
        });
        
        if (result.success) {
          setAscendant(result.ascendant);
          setMc(result.mc);
        } else {
          setError(result.error || 'Erreur inconnue');
        }
        
      } catch (err: any) {
        setError(err.message);
        console.error('❌ [SwissEphTest] Erreur globale:', err);
      } finally {
        setLoading(false);
      }
    };

    runTest();
  }, []);

  const getSignFromDegrees = (degrees: number): string => {
    const signs = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 
                  'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];
    const signIndex = Math.floor(degrees / 30);
    const degreesInSign = degrees % 30;
    return `${signs[signIndex]} ${degreesInSign.toFixed(2)}°`;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test Swiss Ephemeris</h1>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Initialisation et calculs en cours...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Erreur :</strong> {error}
        </div>
      )}
      
      {ascendant !== null && mc !== null && !loading && (
        <div className="space-y-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>✅ Test réussi !</strong>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Ascendant</h3>
              <p className="text-2xl font-mono">{ascendant.toFixed(6)}°</p>
              <p className="text-lg text-gray-600">{getSignFromDegrees(ascendant)}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">MC (Medium Coeli)</h3>
              <p className="text-2xl font-mono">{mc.toFixed(6)}°</p>
              <p className="text-lg text-gray-600">{getSignFromDegrees(mc)}</p>
            </div>
          </div>
          
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <p><strong>Résultat attendu :</strong> Scorpion 12°50' (≈ 222.83°)</p>
            <p><strong>Résultat obtenu :</strong> {getSignFromDegrees(ascendant)}</p>
            <p><strong>Différence :</strong> {Math.abs(ascendant - 222.83).toFixed(2)}°</p>
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <p>Vérifiez les logs de la console pour les détails techniques.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwissEphemerisTest;

