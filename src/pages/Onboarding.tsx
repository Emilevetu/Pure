import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  birthDate: string;
  birthPlace: string;
  birthTime: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    birthDate: '',
    birthPlace: '',
    birthTime: '',
    firstName: '',
    lastName: '',
    email: ''
  });

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Fin de l'onboarding
      console.log('Onboarding terminé:', data);
      navigate('/');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return data.birthDate !== '';
      case 2: return data.birthPlace !== '';
      case 3: return data.birthTime !== '';
      case 4: return data.firstName !== '';
      case 5: return data.lastName !== '';
      case 6: return data.email !== '' && data.email.includes('@');
      case 7: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              Quelle est votre <span className="text-gray-300">date de naissance ?</span>
            </h1>
            <input
              type="date"
              value={data.birthDate}
              onChange={(e) => handleInputChange('birthDate', e.target.value)}
              className="w-full max-w-xs mx-auto bg-transparent border-0 border-b-2 border-gray-600 rounded-none px-0 py-4 text-white text-center text-xl focus:outline-none focus:border-white transition-colors"
            />
          </div>
        );

      case 2:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              Où êtes-vous <span className="text-gray-300">né(e) ?</span>
            </h1>
            <input
              type="text"
              placeholder="Ville, Pays"
              value={data.birthPlace}
              onChange={(e) => handleInputChange('birthPlace', e.target.value)}
              className="w-full max-w-xs mx-auto bg-transparent border-0 border-b-2 border-gray-600 rounded-none px-0 py-4 text-white text-center text-xl focus:outline-none focus:border-white transition-colors placeholder-gray-500"
            />
          </div>
        );

      case 3:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              À quelle heure <span className="text-gray-300">êtes-vous né(e) ?</span>
            </h1>
            <input
              type="time"
              value={data.birthTime}
              onChange={(e) => handleInputChange('birthTime', e.target.value)}
              className="w-full max-w-xs mx-auto bg-transparent border-0 border-b-2 border-gray-600 rounded-none px-0 py-4 text-white text-center text-xl focus:outline-none focus:border-white transition-colors"
            />
          </div>
        );

      case 4:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              Quel est votre <span className="text-gray-300">prénom ?</span>
            </h1>
            <input
              type="text"
              placeholder="Votre prénom"
              value={data.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full max-w-xs mx-auto bg-transparent border-0 border-b-2 border-gray-600 rounded-none px-0 py-4 text-white text-center text-xl focus:outline-none focus:border-white transition-colors placeholder-gray-500"
            />
          </div>
        );

      case 5:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              Quel est votre <span className="text-gray-300">nom de famille ?</span>
            </h1>
            <input
              type="text"
              placeholder="Votre nom"
              value={data.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full max-w-xs mx-auto bg-transparent border-0 border-b-2 border-gray-600 rounded-none px-0 py-4 text-white text-center text-xl focus:outline-none focus:border-white transition-colors placeholder-gray-500"
            />
          </div>
        );

      case 6:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              Quelle est votre <span className="text-gray-300">adresse email ?</span>
            </h1>
            <input
              type="email"
              placeholder="votre@email.com"
              value={data.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full max-w-xs mx-auto bg-transparent border-0 border-b-2 border-gray-600 rounded-none px-0 py-4 text-white text-center text-xl focus:outline-none focus:border-white transition-colors placeholder-gray-500"
            />
          </div>
        );

      case 7:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              Parfait ! Votre <span className="text-gray-300">profil est créé</span>
            </h1>
            <div className="bg-gray-900/50 rounded-2xl p-8 max-w-sm mx-auto backdrop-blur-sm">
              <p className="text-gray-300 mb-3 text-lg"><strong className="text-white">Nom:</strong> {data.firstName} {data.lastName}</p>
              <p className="text-gray-300 mb-3 text-lg"><strong className="text-white">Email:</strong> {data.email}</p>
              <p className="text-gray-300 mb-3 text-lg"><strong className="text-white">Né(e) le:</strong> {data.birthDate}</p>
              <p className="text-gray-300 mb-3 text-lg"><strong className="text-white">À:</strong> {data.birthTime}</p>
              <p className="text-gray-300 text-lg"><strong className="text-white">Lieu:</strong> {data.birthPlace}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header avec indicateur de progression */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black">
        <div className="flex items-center justify-between px-6 py-4">
          <button
            onClick={handleBack}
            className="text-white text-2xl hover:text-gray-300 transition-colors"
          >
            ←
          </button>
          
          {/* Indicateur de progression */}
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index + 1 <= currentStep ? 'bg-white' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <div className="w-6" /> {/* Spacer pour centrer */}
        </div>
      </div>

      {/* Contenu principal */}
      <main className="pt-20">
        <div className="min-h-screen flex items-start justify-center px-6 pt-2">
          <div className="w-full max-w-lg">
            {renderStep()}
          </div>
        </div>
      </main>

      {/* Bouton Suivant */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 p-6">
        <button
          onClick={handleNext}
          disabled={!isStepValid()}
          className={`w-full py-4 rounded-lg text-lg font-medium transition-colors ${
            isStepValid()
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentStep === totalSteps ? 'Terminer' : 'Suivant'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
