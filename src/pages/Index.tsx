import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';

const Index = () => {
  const navigate = useNavigate();

  // Reset scroll vers le haut à chaque ouverture de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen pb-20 bg-gray-50">
        <Header />
        
        {/* Main Content */}
        <main className="pt-20 px-3">
          <div className="container mx-auto max-w-4xl">
            
            {/* Section 1 - Découvrir mon être astral */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900">
                Découvrir mon être astral
              </h2>
              <button 
                className="w-full bg-white border-2 border-black text-black py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
                onClick={() => navigate('/onboarding')}
              >
                Commencer
              </button>
            </div>
            
            {/* Section 2 - Traverser une période de doute */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900">
                Traverser une période de doute
              </h2>
              <button 
                className="w-full bg-white border-2 border-black text-black py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
                onClick={() => navigate('/friends')}
              >
                Explorer
              </button>
            </div>
            
            {/* Section 3 - Découvrir mes forces cachées */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-900">
                Découvrir mes forces cachées
              </h2>
              <button 
                className="w-full bg-white border-2 border-black text-black py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm"
                onClick={() => navigate('/profile')}
              >
                Découvrir
              </button>
            </div>
            
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Index;

