#!/bin/bash

# 🚀 Script de configuration automatique pour Render
# Ce script installe et configure tout l'environnement nécessaire

echo "🔧 Configuration automatique pour Render..."
echo "=========================================="

# 1. Vérifier l'environnement
echo "📋 Vérification de l'environnement..."
echo "Node.js version: $(node --version)"
echo "Bun version: $(bun --version)"
echo "NPM version: $(npm --version)"

# 2. Nettoyer l'environnement
echo "🧹 Nettoyage de l'environnement..."
rm -rf node_modules
rm -rf dist
rm -f package-lock.json
rm -f bun.lockb

# 3. Installation des dépendances avec Bun
echo "📦 Installation des dépendances avec Bun..."
bun install

# 4. Vérification de Vite
echo "🔍 Vérification de Vite..."
if ! command -v vite &> /dev/null; then
    echo "⚠️  Vite non trouvé globalement, installation..."
    bun add -g vite
fi

# 5. Test de build
echo "🏗️  Test de build..."
bun run build

# 6. Vérification des fichiers générés
echo "✅ Vérification des fichiers générés..."
if [ -d "dist" ]; then
    echo "📁 Dossier dist créé avec succès"
    ls -la dist/
else
    echo "❌ Erreur: Dossier dist non créé"
    exit 1
fi

echo "🎉 Configuration Render terminée avec succès!"
echo "🚀 Votre application est prête pour le déploiement!"
