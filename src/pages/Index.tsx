import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useUser } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  // Reset scroll vers le haut à chaque ouverture de la page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen pb-20 bg-dark-blue">
        {/* Main Content */}
        <main className="pt-8 px-3">
          <div className="container mx-auto max-w-4xl">
            {/* Message de bienvenue */}
            <div className="mb-2 -ml-6">
              <h2 className="text-lg text-gray-200 font-light">
                Bonjour {user?.user_metadata?.full_name || 'Utilisateur'}
              </h2>
            </div>
            
            {/* Titres principaux */}
            <div className="space-y-8 pt-2 -ml-6">
              <h1 className="text-2xl md:text-3xl font-[450] text-white text-left">
                Découvrir mon être astral
              </h1>
              
              {/* Bouton sous le premier titre */}
              <div className="mt-1 flex justify-center ml-8">
                <div className="relative overflow-hidden rounded-2xl bg-dark-blue border-2 border-[#1B2A49] px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform duration-200 shadow-lg min-w-80">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-normal mb-1">
                        Commencer
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Conseils d'experts
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        5 min
                      </div>
                    </div>
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {/* Illustration abstraite style Headspace - Version 1 */}
                      <div className="absolute inset-0">
                        <div className="absolute top-2 right-2 w-8 h-8 bg-blue-300 rounded-full opacity-80"></div>
                        <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-60"></div>
                        <div className="absolute top-6 left-2 w-6 h-6 bg-white rounded-full opacity-40"></div>
                        <div className="absolute bottom-2 left-4 w-4 h-4 bg-blue-200 rounded-full opacity-70"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-[450] text-white text-left">
                Traverser une période de doute
              </h1>
              
              {/* Bouton sous le deuxième titre */}
              <div className="mt-1 flex justify-center ml-8">
                <div className="relative overflow-hidden rounded-2xl bg-dark-blue border-2 border-[#1B2A49] px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform duration-200 shadow-lg min-w-80">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-normal mb-1">
                        Commencer
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Conseils d'experts
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        5 min
                      </div>
                    </div>
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {/* Illustration abstraite style Headspace - Version 2 */}
                      <div className="absolute inset-0">
                        <div className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-60"></div>
                        <div className="absolute top-4 right-3 w-8 h-8 bg-blue-300 rounded-full opacity-80"></div>
                        <div className="absolute bottom-2 right-1 w-6 h-6 bg-white rounded-full opacity-40"></div>
                        <div className="absolute bottom-4 left-4 w-5 h-5 bg-blue-200 rounded-full opacity-70"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-[450] text-white text-left">
                Découvrir mes forces cachées
              </h1>
              
              {/* Bouton sous le troisième titre */}
              <div className="mt-1 flex justify-center ml-8">
                <div className="relative overflow-hidden rounded-2xl bg-dark-blue border-2 border-[#1B2A49] px-3 py-2 cursor-pointer hover:scale-[1.02] transition-transform duration-200 shadow-lg min-w-80">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-white text-lg font-normal mb-1">
                        Commencer
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm mb-1">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Conseils d'experts
                      </div>
                      <div className="flex items-center text-gray-400 text-sm">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        5 min
                      </div>
                    </div>
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {/* Illustration abstraite style Headspace - Version 3 */}
                      <div className="absolute inset-0">
                        <div className="absolute top-1 left-4 w-7 h-7 bg-blue-300 rounded-full opacity-80"></div>
                        <div className="absolute bottom-3 left-2 w-11 h-11 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-60"></div>
                        <div className="absolute top-8 right-1 w-4 h-4 bg-white rounded-full opacity-40"></div>
                        <div className="absolute bottom-1 right-5 w-5 h-5 bg-blue-200 rounded-full opacity-70"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default Index;

