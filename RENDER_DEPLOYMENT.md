# 🚀 Guide de Déploiement Render - AstroGuide

## 📋 **Vue d'ensemble**
Ce guide vous accompagne pour déployer votre application **AstroGuide** (analyse astrologique avec IA) sur Render.

## 🔧 **Configuration Render**

### **1. Type de Service**
- **Service Type** : `Web Service`
- **Language** : `Node`
- **Branch** : `main`

### **2. Commandes de Build et Démarrage**
```bash
# Build Command (OBLIGATOIRE)
bun run build

# Start Command (OBLIGATOIRE)
bun run preview
```

### **3. Région Recommandée**
- **🌍 Frankfurt (EU Central)** - Meilleure performance pour l'Europe
- **Alternative** : Oregon (US West) si vos utilisateurs sont aux USA

### **4. Root Directory**
- **Laissez vide** - Votre projet est à la racine du repository

## 📦 **Dépendances du Projet**

### **Dépendances Principales (Production)**
```json
{
  "@hookform/resolvers": "^3.10.0",
  "@radix-ui/react-accordion": "^1.2.11",
  "@radix-ui/react-alert-dialog": "^1.1.14",
  "@radix-ui/react-aspect-ratio": "^1.1.7",
  "@radix-ui/react-avatar": "^1.1.10",
  "@radix-ui/react-checkbox": "^1.3.2",
  "@radix-ui/react-collapsible": "^1.1.11",
  "@radix-ui/react-context-menu": "^2.2.15",
  "@radix-ui/react-dialog": "^1.1.14",
  "@radix-ui/react-dropdown-menu": "^2.1.15",
  "@radix-ui/react-hover-card": "^1.1.14",
  "@radix-ui/react-label": "^2.1.7",
  "@radix-ui/react-menubar": "^1.1.15",
  "@radix-ui/react-navigation-menu": "^1.2.13",
  "@radix-ui/react-popover": "^1.1.14",
  "@radix-ui/react-progress": "^1.1.7",
  "@radix-ui/react-radio-group": "^1.3.7",
  "@radix-ui/react-scroll-area": "^1.2.9",
  "@radix-ui/react-select": "^2.2.5",
  "@radix-ui/react-separator": "^1.1.7",
  "@radix-ui/react-slider": "^1.3.5",
  "@radix-ui/react-slot": "^1.2.3",
  "@radix-ui/react-switch": "^1.2.5",
  "@radix-ui/react-tabs": "^1.1.12",
  "@radix-ui/react-toast": "^1.2.14",
  "@radix-ui/react-toggle": "^1.1.9",
  "@radix-ui/react-toggle-group": "^1.1.10",
  "@radix-ui/react-tooltip": "^1.2.7",
  "@react-three/drei": "^9.122.0",
  "@react-three/fiber": "^8.18.0",
  "@tanstack/react-query": "^5.83.0",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "date-fns": "^3.6.0",
  "embla-carousel-react": "^8.6.0",
  "input-otp": "^1.4.2",
  "lucide-react": "^0.462.0",
  "next-themes": "^0.3.0",
  "react": "^18.3.1",
  "react-day-picker": "^8.10.1",
  "react-dom": "^18.3.1",
  "react-hook-form": "^7.61.1",
  "react-resizable-panels": "^2.1.9",
  "react-router-dom": "^6.30.1",
  "recharts": "^2.15.4",
  "sonner": "^1.7.4",
  "tailwind-merge": "^2.6.0",
  "tailwindcss-animate": "^1.0.7",
  "three": "^0.179.1",
  "vaul": "^0.9.9",
  "zod": "^3.25.76"
}
```

### **Dépendances de Développement**
```json
{
  "@eslint/js": "^9.32.0",
  "@tailwindcss/typography": "^0.5.16",
  "@types/node": "^22.16.5",
  "@types/react": "^18.3.23",
  "@types/react-dom": "^18.3.7",
  "@vitejs/plugin-react-swc": "^3.11.0",
  "autoprefixer": "^10.4.21",
  "eslint": "^9.32.0",
  "eslint-plugin-react-hooks": "^5.2.0",
  "eslint-plugin-react-refresh": "^0.4.20",
  "globals": "^15.15.0",
  "lovable-tagger": "^1.1.9",
  "postcss": "^8.5.6",
  "tailwindcss": "^3.4.17",
  "typescript": "^5.8.3",
  "typescript-eslint": "^8.38.0",
  "vite": "^5.4.19"
}
```

## 🔑 **Variables d'Environnement (OBLIGATOIRES)**

### **1. Clé API OpenAI (CRITIQUE)**
```bash
VITE_OPENAI_API_KEY=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
```

### **2. Variables de Configuration (Recommandées)**
```bash
NODE_ENV=production
VITE_APP_TITLE=AstroGuide - Guide Astrologique
VITE_APP_DESCRIPTION=Analyse astrologique basée sur les données NASA JPL Horizons
```

## 🚨 **Problèmes Courants et Solutions**

### **1. Erreur "vite: not found"**
**Cause** : Conflit entre Bun et npm
**Solution** : Utiliser `bun run build` au lieu de `npm run build`

### **2. Échec de Build (Status 127)**
**Cause** : Commandes incorrectes
**Solution** : Vérifier que les commandes sont exactement :
- Build : `bun run build`
- Start : `bun run preview`

### **3. Erreur 401 OpenAI**
**Cause** : Clé API manquante ou invalide
**Solution** : Vérifier `VITE_OPENAI_API_KEY` dans les variables d'environnement

## 📱 **Configuration Avancée**

### **Instance Type**
- **Plan Gratuit** : 512 MB RAM, 0.1 CPU
- **Suffisant** pour le développement et les tests

### **Auto-Deploy**
- **Activé** : Redéploiement automatique sur push
- **Branch** : `main`

### **Health Check**
- **URL** : `/` (page d'accueil)
- **Interval** : 30 secondes

## 🧪 **Test Post-Déploiement**

### **1. Vérification de Base**
- ✅ Site accessible
- ✅ Formulaire de naissance fonctionnel
- ✅ Calculs planétaires NASA
- ✅ Génération IA ChatGPT

### **2. Tests Fonctionnels**
- ✅ Saisie date/heure/lieu
- ✅ Récupération données NASA
- ✅ Analyse astrologique IA
- ✅ Affichage résultats

## 🔍 **Monitoring et Logs**

### **Logs Render**
- **Build Logs** : Vérifier l'installation des dépendances
- **Runtime Logs** : Surveiller les erreurs en production
- **Health Check** : Vérifier la disponibilité du service

### **Métriques à Surveiller**
- **Temps de réponse** des requêtes NASA
- **Temps de génération** des analyses IA
- **Taux d'erreur** des appels API

## 🚀 **Déploiement Final**

### **Étapes de Validation**
1. **Build réussi** ✅
2. **Service démarré** ✅
3. **Variables d'environnement** configurées ✅
4. **Tests fonctionnels** passés ✅
5. **Monitoring** activé ✅

### **URL de Production**
Votre application sera accessible à :
```
https://votre-service-name.onrender.com
```

## 📞 **Support et Dépannage**

### **En cas de problème :**
1. **Vérifier les logs Render**
2. **Contrôler les variables d'environnement**
3. **Tester localement** avec `bun run build && bun run preview`
4. **Vérifier la clé API OpenAI**

---

**🎯 Votre application AstroGuide sera prête à analyser les thèmes astraux avec l'IA sur Render !**
