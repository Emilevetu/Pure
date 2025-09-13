import React, { useState } from 'react';
import { testNeuilly } from '../lib/simple-astro';

const SimpleAstroTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const runTest = async () => {
    setIsLoading(true);
    setResult('');
    
    try {
      console.log('🚀 Début du test SimpleAstro...');
      testNeuilly();
      setResult('Test terminé ! Vérifiez la console pour les résultats.');
    } catch (error: any) {
      console.error('❌ Erreur test:', error);
      setResult(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Test Calculs Astrologiques Simples
        </h1>
        
        <div className="bg-gray-900 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Test de calcul Ascendant</h2>
          <p className="text-gray-300 mb-4">
            Test avec les données : 3 octobre 2002 à 11h00, Neuilly-sur-Seine
          </p>
          <p className="text-gray-300 mb-6">
            Résultat attendu : Ascendant en Scorpion 12°50'
          </p>
          
          <button
            onClick={runTest}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-medium ${
              isLoading
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Test en cours...' : 'Lancer le test'}
          </button>
        </div>
        
        {result && (
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Résultat :</h3>
            <p className="text-gray-300">{result}</p>
          </div>
        )}
        
        <div className="mt-8 text-sm text-gray-400">
          <p>📝 Vérifiez la console du navigateur pour les logs détaillés</p>
          <p>🔍 Le test calcule l'Ascendant et le MC avec des formules astronomiques</p>
          <p>⚡ Version sans WebAssembly pour éviter les problèmes de chargement</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleAstroTest;

