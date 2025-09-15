import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { User, Users } from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard';



const Index = () => {
  const navigate = useNavigate();

  // Reset scroll vers le haut à chaque ouverture de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);




  return (
    <AuthGuard>
      <div className="min-h-screen pb-20">
              <Header />
        
        {/* Hero Section */}
      <main id="hero" className="pt-20">
        <section className="py-2 px-6">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto text-center">
              {/* Main title */}
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight mb-16">
                Chaque humain est unique.{' '}
                <span className="text-muted-foreground">Pure vous aide à vous connaître et à connaitre vos proches.</span>
              </h1>
            </div>
          </div>
        </section>
        
        {/* Sections */}
        <section className="px-6 pb-20">
          <div className="container mx-auto max-w-4xl">
            
            {/* Section 1 - Moi */}
            <div className="mb-20">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-light text-gray-900">Moi</h2>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Apprenez à vous connaître
              </p>
              
              <div className="text-center">
                <button 
                  className="bg-black text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors"
                  onClick={() => navigate('/onboarding')}
                >
                  Découvrir mon profil
                </button>
              </div>
            </div>
            
            {/* Section 2 - Mes proches */}
            <div>
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-2xl font-light text-gray-900">Mes proches</h2>
              </div>
              
              <p className="text-center text-gray-600 mb-8 text-lg">
                Découvrez vos proches sous un nouvel angle
              </p>
              
              <div className="text-center">
                <button 
                  className="bg-gray-100 text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/friends')}
                >
                  Voir mes amis
                </button>
              </div>
            </div>
            
          </div>
        </section>
        
      </main>
      
      </div>
    </AuthGuard>
  );
};

export default Index;

