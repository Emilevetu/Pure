#!/bin/bash

# Script de déploiement sur Render pour Astro Alignement
# Usage: ./scripts/deploy-render.sh

set -e

echo "🚀 Déploiement sur Render - Astro Alignement"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    print_info "Vérification des prérequis..."
    
    if ! command -v git &> /dev/null; then
        print_error "Git n'est pas installé"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérification que nous sommes dans un repo Git
    if [ ! -d ".git" ]; then
        print_error "Ce répertoire n'est pas un repository Git"
        exit 1
    fi
    
    print_success "Prérequis vérifiés"
}

# Build de l'application
build_application() {
    print_info "Build de l'application..."
    
    # Nettoyage du build précédent
    if [ -d "dist" ]; then
        rm -rf dist
        print_info "Ancien build supprimé"
    fi
    
    # Installation des dépendances
    if command -v bun &> /dev/null; then
        bun install
    elif command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
    
    # Build de production
    if command -v bun &> /dev/null; then
        bun run build
    elif command -v yarn &> /dev/null; then
        yarn build
    else
        npm run build
    fi
    
    if [ ! -d "dist" ]; then
        print_error "Le build a échoué - dossier dist non créé"
        exit 1
    fi
    
    print_success "Application buildée avec succès"
}

# Vérification de la configuration de production
check_production_config() {
    print_info "Vérification de la configuration de production..."
    
    if [ ! -f "env.production" ]; then
        print_error "Fichier env.production non trouvé"
        exit 1
    fi
    
    print_success "Configuration de production vérifiée"
}

# Création du fichier render.yaml
create_render_yaml() {
    print_info "Création du fichier render.yaml..."
    
    cat > render.yaml << 'EOF'
# Configuration Render pour Astro Alignement
services:
  - type: web
    name: astro-alignement-frontend
    env: node
    buildCommand: npm install && npm run build
    startCommand: npx serve -s dist -l $PORT
    envVars:
      - key: NODE_ENV
        value: production
      - key: VITE_APP_VERSION
        value: 1.0.0
      - key: VITE_BUILD_TIMESTAMP
        generateValue: timestamp
      - key: VITE_API_BASE_URL
        sync: false
      - key: VITE_OPENAI_API_KEY
        sync: false
      - key: VITE_ASTROLOGY_API_KEY
        sync: false
      - key: VITE_DATABASE_URL
        sync: false
      - key: VITE_JWT_SECRET
        sync: false
      - key: VITE_SESSION_SECRET
        sync: false
      - key: VITE_GOOGLE_ANALYTICS_ID
        sync: false
      - key: VITE_SENTRY_DSN
        sync: false
    autoDeploy: true
    healthCheckPath: /
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
EOF
    
    print_success "Fichier render.yaml créé"
}

# Instructions de déploiement
show_deployment_instructions() {
    echo ""
    print_info "📋 Instructions de déploiement sur Render:"
    echo ""
    echo "1. Poussez votre code sur GitHub/GitLab:"
    echo "   git add ."
    echo "   git commit -m 'Prepare for Render deployment'"
    echo "   git push origin main"
    echo ""
    echo "2. Connectez votre repository sur Render:"
    echo "   - Allez sur https://render.com"
    echo "   - Créez un nouveau 'Web Service'"
    echo "   - Connectez votre repository Git"
    echo "   - Render détectera automatiquement le fichier render.yaml"
    echo ""
    echo "3. Configurez les variables d'environnement sur Render:"
    echo "   - OPENAI_API_KEY: Votre clé API OpenAI"
    echo "   - VITE_API_BASE_URL: URL de votre backend"
    echo "   - JWT_SECRET: Secret JWT pour l'authentification"
    echo "   - SESSION_SECRET: Secret de session"
    echo "   - Autres variables selon vos besoins"
    echo ""
    echo "4. Déployez !"
    echo ""
    print_warning "⚠️  IMPORTANT: Assurez-vous que votre backend est déployé avant le frontend"
}

# Vérification du statut Git
check_git_status() {
    print_info "Vérification du statut Git..."
    
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "⚠️  Des modifications non commitées sont présentes:"
        git status --short
        
        read -p "Voulez-vous continuer ? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Déploiement annulé"
            exit 0
        fi
    else
        print_success "Repository Git propre"
    fi
}

# Script principal
main() {
    check_prerequisites
    check_git_status
    check_production_config
    build_application
    create_render_yaml
    
    show_deployment_instructions
    
    print_success "Préparation au déploiement terminée !"
    echo ""
    echo "Fichiers créés:"
    echo "  - dist/ (build de production)"
    echo "  - render.yaml (configuration Render)"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Committez et poussez vos changements"
    echo "2. Suivez les instructions de déploiement ci-dessus"
}

# Exécution du script
main "$@"
