import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AutocompleteDark from '../components/ui/autocomplete-dark';
import { cities } from '../lib/cities';
import { X } from 'lucide-react';

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
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
            <div className="w-full max-w-xs mx-auto">
              <AutocompleteDark
                value={data.birthPlace}
                onChange={(value) => handleInputChange('birthPlace', value)}
                placeholder="Rechercher une ville..."
                options={cities}
                className="w-full"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-8 leading-tight">
              À quelle heure <span className="text-gray-300">êtes-vous né(e) ?</span>
            </h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Il est important que l'horaire soit précis.
            </p>
            <input
              type="time"
              value={data.birthTime}
              onChange={(e) => handleInputChange('birthTime', e.target.value)}
              className="w-full max-w-xs mx-auto bg-transparent border-0 border-b-2 border-gray-600 rounded-none px-0 py-4 text-white text-center text-xl focus:outline-none focus:border-white transition-colors"
            />
            <div className="mt-6">
              <button
                onClick={() => setIsPopupOpen(true)}
                className="w-full max-w-xs mx-auto py-3 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white focus:outline-none focus:text-gray-300 focus:border-gray-600"
              >
                {data.birthTime === 'night' && 'La nuit - entre minuit et 8h'}
                {data.birthTime === 'day' && 'La journée - entre 8h et 16h'}
                {data.birthTime === 'evening' && 'La soirée - entre 16h et minuit'}
                {data.birthTime === 'unknown' && 'Je ne sais pas'}
                {!data.birthTime && 'Je ne connais pas l\'heure exacte'}
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-left px-6">
            <h1 className="text-2xl md:text-3xl font-light text-white mb-16 leading-tight">
              À quel moment de la journée <span className="text-gray-300">vous sentez-vous le plus en forme ?</span>
            </h1>
            <div className="space-y-3">
              <button
                onClick={() => handleInputChange('firstName', 'morning')}
                className={`w-full max-w-xs mx-auto py-3 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  data.firstName === 'morning' 
                    ? 'border-white text-white bg-white/10' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white'
                } focus:outline-none`}
              >
                Tôt le matin
              </button>
              
              <button
                onClick={() => handleInputChange('firstName', 'late-morning')}
                className={`w-full max-w-xs mx-auto py-3 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  data.firstName === 'late-morning' 
                    ? 'border-white text-white bg-white/10' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white'
                } focus:outline-none`}
              >
                En fin de matinée
              </button>
              
              <button
                onClick={() => handleInputChange('firstName', 'afternoon')}
                className={`w-full max-w-xs mx-auto py-3 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  data.firstName === 'afternoon' 
                    ? 'border-white text-white bg-white/10' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white'
                } focus:outline-none`}
              >
                Pendant l'après-midi
              </button>
              
              <button
                onClick={() => handleInputChange('firstName', 'evening')}
                className={`w-full max-w-xs mx-auto py-3 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  data.firstName === 'evening' 
                    ? 'border-white text-white bg-white/10' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white'
                } focus:outline-none`}
              >
                Le soir
              </button>
              
              <button
                onClick={() => handleInputChange('firstName', 'night')}
                className={`w-full max-w-xs mx-auto py-3 px-4 rounded-lg text-sm font-medium transition-colors border ${
                  data.firstName === 'night' 
                    ? 'border-white text-white bg-white/10' 
                    : 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 hover:text-white'
                } focus:outline-none`}
              >
                La nuit
              </button>
            </div>
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

      {/* Pop-up pour "Je ne connais pas l'heure exacte" */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-gray-700">
            {/* Header avec bouton fermer */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-medium">Je pense être né(e) pendant</h3>
              <button
                onClick={() => setIsPopupOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Boutons de créneaux horaires */}
            <div className="space-y-3">
              <button
                onClick={() => {
                  handleInputChange('birthTime', 'night');
                  setIsPopupOpen(false);
                }}
                className="w-full py-3 px-4 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-colors"
              >
                La nuit - entre minuit et 8h
              </button>
              
              <button
                onClick={() => {
                  handleInputChange('birthTime', 'day');
                  setIsPopupOpen(false);
                }}
                className="w-full py-3 px-4 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-colors"
              >
                La journée - entre 8h et 16h
              </button>
              
              <button
                onClick={() => {
                  handleInputChange('birthTime', 'evening');
                  setIsPopupOpen(false);
                }}
                className="w-full py-3 px-4 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-colors"
              >
                La soirée - entre 16h et minuit
              </button>
              
              <button
                onClick={() => {
                  handleInputChange('birthTime', 'unknown');
                  setIsPopupOpen(false);
                }}
                className="w-full py-3 px-4 border border-gray-600 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-colors"
              >
                Je ne sais pas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
