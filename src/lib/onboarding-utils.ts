/**
 * Utilitaires pour la conversion des données d'onboarding
 */

export interface OnboardingData {
  birthDate: string;
  birthPlace: string;
  birthTime: string;
  firstName: string;
  lastName: string;
  email: string;
  groupRole: string;
  priority: string;
}

export interface BirthData {
  date: string;
  time: string;
  place: string;
}

/**
 * Extrait l'heure des métadonnées de l'onboarding
 */
export const extractTimeFromMetadata = (timeMetadata: string): string => {
  console.log('🕐 [OnboardingUtils] Conversion de l\'heure:', timeMetadata);
  
  if (timeMetadata.includes('environ 04:00')) {
    console.log('🌙 [OnboardingUtils] Heure nocturne détectée → 04:00');
    return '04:00';
  }
  if (timeMetadata.includes('environ 12:00')) {
    console.log('☀️ [OnboardingUtils] Heure diurne détectée → 12:00');
    return '12:00';
  }
  if (timeMetadata.includes('environ 20:00')) {
    console.log('🌅 [OnboardingUtils] Heure vespérale détectée → 20:00');
    return '20:00';
  }
  if (timeMetadata.includes('par défaut 12:00')) {
    console.log('❓ [OnboardingUtils] Heure par défaut détectée → 12:00');
    return '12:00';
  }
  
  // Si c'est déjà au format HH:MM (heure précise)
  console.log('⏰ [OnboardingUtils] Heure précise détectée:', timeMetadata);
  return timeMetadata;
};

/**
 * Convertit les données d'onboarding en format BirthData pour l'API
 */
export const convertOnboardingToBirthData = (onboardingData: OnboardingData): BirthData => {
  console.log('🔄 [OnboardingUtils] Conversion des données d\'onboarding...');
  console.log('📝 [OnboardingUtils] Données d\'entrée:', {
    birthDate: onboardingData.birthDate,
    birthTime: onboardingData.birthTime,
    birthPlace: onboardingData.birthPlace
  });
  
  const convertedTime = extractTimeFromMetadata(onboardingData.birthTime);
  
  const birthData: BirthData = {
    date: onboardingData.birthDate,
    time: convertedTime,
    place: onboardingData.birthPlace
  };
  
  console.log('✅ [OnboardingUtils] Données converties:', birthData);
  
  return birthData;
};
