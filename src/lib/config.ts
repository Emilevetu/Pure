/**
 * Configuration centralisée de l'application
 * Détecte automatiquement l'environnement et bascule les fonctionnalités
 */

interface Config {
  // Environnement
  isDevelopment: boolean;
  isProduction: boolean;
  isLocal: boolean;
  isRender: boolean;
  
  // Serveur
  server: {
    port: number;
    host: string;
  };
  
  // API
  api: {
    baseUrl: string;
    timeout: number;
  };
  
  // OpenAI
  openai: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  
  // Astrologie
  astrology: {
    apiKey: string;
    apiUrl: string;
  };
  
  // Base de données
  database: {
    url: string;
  };
  
  // Services tiers
  services: {
    googleAnalyticsId: string;
    sentryDsn: string;
  };
  
  // Sécurité
  security: {
    jwtSecret: string;
    sessionSecret: string;
  };
  
  // Fonctionnalités
  features: {
    enableAnalytics: boolean;
    enableDebugMode: boolean;
    enableMockData: boolean;
  };
  
  // Déploiement
  deployment: {
    version: string;
    buildTimestamp: string;
  };
}

/**
 * Détecte automatiquement l'environnement
 */
function detectEnvironment() {
  // Détection de l'environnement
  const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || 
     window.location.hostname === '127.0.0.1' ||
     window.location.hostname.includes('localhost'));
  
  const isRender = typeof window !== 'undefined' && 
    window.location.hostname.includes('onrender.com');
  
  // Détection basée sur l'URL et les variables d'environnement
  const isDevelopment = isLocal || getEnvVar('NODE_ENV') === 'development';
  const isProduction = isRender || getEnvVar('NODE_ENV') === 'production';
  
  return { isLocal, isRender, isDevelopment, isProduction };
}

/**
 * Récupère une variable d'environnement avec une valeur par défaut
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  return import.meta.env[key] || defaultValue;
}

/**
 * Récupère une variable d'environnement booléenne
 */
function getBoolEnvVar(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value === 'true' || value === '1';
}

/**
 * Récupère une variable d'environnement numérique
 */
function getNumberEnvVar(key: string, defaultValue: number = 0): number {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Configuration de l'application avec détection automatique
 */
export const config: Config = {
  // Environnement (détection automatique)
  ...detectEnvironment(),
  
  // Serveur
  server: {
    port: getNumberEnvVar('VITE_SERVER_PORT', 8080),
    host: getEnvVar('VITE_SERVER_HOST', 'localhost'),
  },
  
  // API
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
    timeout: getNumberEnvVar('VITE_API_TIMEOUT', 10000),
  },
  
  // OpenAI
  openai: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY', ''),
    model: getEnvVar('VITE_OPENAI_MODEL', 'gpt-4'),
    maxTokens: getNumberEnvVar('VITE_OPENAI_MAX_TOKENS', 2000),
    temperature: getNumberEnvVar('VITE_OPENAI_TEMPERATURE', 0.7),
  },
  
  // Astrologie
  astrology: {
    apiKey: getEnvVar('VITE_ASTROLOGY_API_KEY', ''),
    apiUrl: getEnvVar('VITE_ASTROLOGY_API_URL', 'https://api.astrologie.com'),
  },
  
  // Base de données
  database: {
    url: getEnvVar('VITE_DATABASE_URL', ''),
  },
  
  // Services tiers
  services: {
    googleAnalyticsId: getEnvVar('VITE_GOOGLE_ANALYTICS_ID', ''),
    sentryDsn: getEnvVar('VITE_SENTRY_DSN', ''),
  },
  
  // Sécurité
  security: {
    jwtSecret: getEnvVar('VITE_JWT_SECRET', ''),
    sessionSecret: getEnvVar('VITE_SESSION_SECRET', ''),
  },
  
  // Fonctionnalités (basculement automatique selon l'environnement)
  features: {
    enableAnalytics: getBoolEnvVar('VITE_ENABLE_ANALYTICS', false),
    enableDebugMode: getBoolEnvVar('VITE_ENABLE_DEBUG_MODE', true),
    enableMockData: getBoolEnvVar('VITE_ENABLE_MOCK_DATA', true),
  },
  
  // Déploiement
  deployment: {
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    buildTimestamp: getEnvVar('VITE_BUILD_TIMESTAMP', ''),
  },
};

// Mise à jour des fonctionnalités après création de config
config.features.enableAnalytics = config.features.enableAnalytics || config.isProduction;
config.features.enableDebugMode = config.features.enableDebugMode && config.isDevelopment;
config.features.enableMockData = config.features.enableMockData && config.isDevelopment;

/**
 * Vérifie si la configuration est valide
 */
export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Vérifications critiques
  if (!config.openai.apiKey && !config.features.enableMockData) {
    errors.push('Clé API OpenAI manquante et mode mock désactivé');
  }
  
  if (!config.api.baseUrl) {
    errors.push('URL de l\'API backend manquante');
  }
  
  if (config.isProduction && !config.security.jwtSecret) {
    errors.push('Secret JWT manquant en production');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Affiche la configuration actuelle (pour le debug)
 */
export function logConfig(): void {
  if (!config.features.enableDebugMode) return;
  
  console.group('🔧 Configuration de l\'application');
  console.log('🌍 Environnement détecté:', {
    isLocal: config.isLocal ? '✅ Local' : '❌ Non local',
    isRender: config.isRender ? '✅ Render' : '❌ Non Render',
    isDevelopment: config.isDevelopment ? '✅ Développement' : '❌ Production',
    isProduction: config.isProduction ? '✅ Production' : '❌ Développement',
  });
  console.log('📱 URL actuelle:', typeof window !== 'undefined' ? window.location.href : 'SSR');
  console.log('🔗 API Base URL:', config.api.baseUrl);
  console.log('🤖 OpenAI Model:', config.openai.model);
  console.log('🎭 Mock Data:', config.features.enableMockData ? '✅ Activé' : '❌ Désactivé');
  console.log('🐛 Debug Mode:', config.features.enableDebugMode ? '✅ Activé' : '❌ Désactivé');
  console.log('📊 Analytics:', config.features.enableAnalytics ? '✅ Activé' : '❌ Désactivé');
  console.groupEnd();
}

/**
 * Vérifie si l'application tourne sur Render
 */
export function isRunningOnRender(): boolean {
  return config.isRender;
}

/**
 * Vérifie si l'application tourne en local
 */
export function isRunningLocally(): boolean {
  return config.isLocal;
}
