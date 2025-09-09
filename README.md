# 🌟 Astro Alignement

Application d'astrologie moderne utilisant React, TypeScript et l'IA pour analyser et interpréter les thèmes astraux.

## 🚀 Fonctionnalités

- **Calcul de thème astral** : Génération précise des positions planétaires
- **Interprétation IA** : Analyse intelligente avec ChatGPT
- **Interface moderne** : Design responsive avec Shadcn/ui
- **Gestion des utilisateurs** : Sauvegarde et consultation des thèmes
- **Mode développement/production** : Configuration flexible

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Shadcn/ui + Tailwind CSS
- **IA** : OpenAI GPT-4
- **API** : Client REST centralisé
- **Déploiement** : Render

## 📋 Prérequis

- Node.js 18+ 
- npm, yarn ou bun
- Git

## 🚀 Installation et configuration

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd astro-alignement
```

### 2. Configuration automatique (recommandé)

```bash
# Rendre le script exécutable
chmod +x scripts/setup-env.sh

# Configuration de l'environnement local
./scripts/setup-env.sh local

# Ou pour la production
./scripts/setup-env.sh production
```

### 3. Configuration manuelle

#### Variables d'environnement locales

Copiez le fichier d'exemple et configurez vos variables :

```bash
cp env.local .env.local
```

Modifiez `.env.local` avec vos vraies clés :

```env
# Configuration OpenAI/ChatGPT
VITE_OPENAI_API_KEY=sk-votre_vraie_cle_api_ici

# Configuration de l'API backend
VITE_API_BASE_URL=http://localhost:3000/api

# Autres variables selon vos besoins...
```

#### Variables d'environnement de production

Pour le déploiement sur Render, configurez ces variables dans l'interface :

- `OPENAI_API_KEY` : Votre clé API OpenAI
- `VITE_API_BASE_URL` : URL de votre backend
- `JWT_SECRET` : Secret JWT pour l'authentification
- `SESSION_SECRET` : Secret de session

### 4. Installation des dépendances

```bash
npm install
# ou
yarn install
# ou
bun install
```

### 5. Lancement en développement

```bash
npm run dev
# ou
yarn dev
# ou
bun dev
```

L'application sera accessible sur `http://localhost:8080`

## 🏗️ Structure du projet

```
src/
├── components/          # Composants React
│   ├── ui/            # Composants UI Shadcn
│   ├── BirthForm.tsx  # Formulaire de naissance
│   ├── ResultCard.tsx # Affichage des résultats
│   └── ...
├── lib/               # Utilitaires et configuration
│   ├── config.ts      # Configuration centralisée
│   ├── api.ts         # Client API
│   ├── astro.ts       # Logique astrologique
│   └── utils.ts       # Utilitaires généraux
├── hooks/             # Hooks React personnalisés
├── pages/             # Pages de l'application
└── main.tsx           # Point d'entrée
```

## 🔧 Configuration

### Fichiers d'environnement

- `env.example` : Modèle avec toutes les variables
- `env.local` : Configuration locale (développement)
- `env.production` : Configuration production (Render)

### Modes de fonctionnement

- **Développement** : Mode mock activé, debug activé
- **Production** : API réelle, analytics activés, debug désactivé

## 🚀 Déploiement sur Render

### 1. Préparation automatique

```bash
chmod +x scripts/deploy-render.sh
./scripts/deploy-render.sh
```

### 2. Déploiement manuel

1. **Build de production**
   ```bash
   npm run build
   ```

2. **Créer le fichier `render.yaml`**
   ```yaml
   services:
     - type: web
       name: astro-alignement-frontend
       env: node
       buildCommand: npm install && npm run build
       startCommand: npx serve -s dist -l $PORT
   ```

3. **Connecter votre repository sur Render**
   - Créez un nouveau "Web Service"
   - Connectez votre repo Git
   - Configurez les variables d'environnement

### 3. Variables d'environnement Render

Configurez ces variables dans l'interface Render :

```env
NODE_ENV=production
OPENAI_API_KEY=sk-votre_cle_api
VITE_API_BASE_URL=https://votre-backend.onrender.com/api
JWT_SECRET=votre_secret_jwt
SESSION_SECRET=votre_secret_session
```

## 🔍 Débogage

### Mode développement

- Console avec informations de configuration
- Validation des variables d'environnement
- Mode mock activé par défaut
- Logs détaillés des appels API

### Vérification de la configuration

```typescript
import { config, validateConfig } from './lib/config';

// Vérifier la configuration
const validation = validateConfig();
if (!validation.isValid) {
  console.warn('Erreurs de configuration:', validation.errors);
}

// Afficher la configuration
console.log('Configuration:', config);
```

## 📚 API

### Client API centralisé

```typescript
import { astroAPI, openaiAPI, userAPI } from './lib/api';

// Calcul astrologique
const astroData = await astroAPI.getAstroData(birthData);

// Génération IA
const interpretation = await openaiAPI.generateInterpretation(prompt);

// Gestion utilisateur
const user = await userAPI.login(credentials);
```

### Gestion des erreurs

```typescript
import { handleApiError } from './lib/api';

try {
  const result = await apiCall();
} catch (error) {
  handleApiError(error);
}
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Couverture de code
npm run test:coverage
```

## 📦 Scripts disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run build:dev    # Build de développement
npm run preview      # Prévisualisation du build

# Qualité du code
npm run lint         # Vérification ESLint
npm run format       # Formatage du code

# Tests
npm run test         # Tests unitaires
npm run test:watch   # Tests en mode watch
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : Consultez ce README
- **Issues** : Ouvrez une issue sur GitHub
- **Configuration** : Vérifiez vos variables d'environnement

## 🔮 Roadmap

- [ ] Intégration avec d'autres APIs astrologiques
- [ ] Système de notifications push
- [ ] Mode hors ligne
- [ ] Application mobile (React Native)
- [ ] Intégration avec des calendriers
- [ ] Système de recommandations personnalisées

---

**Note** : Assurez-vous de configurer correctement vos clés API et variables d'environnement avant de déployer en production.
