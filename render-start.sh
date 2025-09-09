#!/bin/bash

# 🚀 Script de démarrage optimisé pour Render
# Ce script démarre l'application en mode production

echo "🚀 Démarrage de l'application AstroGuide..."
echo "=========================================="

# 1. Vérifier que le build existe
if [ ! -d "dist" ]; then
    echo "❌ Erreur: Dossier dist non trouvé. Lancement du build..."
    bun run build
fi

# 2. Vérifier les variables d'environnement
echo "🔑 Vérification des variables d'environnement..."
if [ -z "$VITE_OPENAI_API_KEY" ]; then
    echo "⚠️  Attention: VITE_OPENAI_API_KEY non définie"
else
    echo "✅ VITE_OPENAI_API_KEY configurée"
fi

# 3. Démarrer l'application
echo "🌐 Démarrage du serveur de production..."
echo "📍 Port: $PORT (défini par Render)"
echo "🌍 URL: http://localhost:$PORT"

# 4. Démarrer avec Vite preview
exec bun run preview --host 0.0.0.0 --port $PORT
