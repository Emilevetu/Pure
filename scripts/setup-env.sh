#!/bin/bash

# Script de configuration de l'environnement pour Astro Alignement
# Usage: ./scripts/setup-env.sh [local|production]

set -e

echo "🚀 Configuration de l'environnement Astro Alignement"

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
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null && ! command -v yarn &> /dev/null && ! command -v bun &> /dev/null; then
        print_error "Aucun gestionnaire de paquets trouvé (npm, yarn, ou bun)"
        exit 1
    fi
    
    print_success "Prérequis vérifiés"
}

# Configuration de l'environnement local
setup_local() {
    print_info "Configuration de l'environnement local..."
    
    if [ ! -f "env.local" ]; then
        print_error "Fichier env.local non trouvé"
        exit 1
    fi
    
    # Copie du fichier d'environnement local
    cp env.local .env.local
    
    print_warning "⚠️  IMPORTANT: Modifiez le fichier .env.local avec vos vraies clés API"
    print_info "Variables à configurer:"
    echo "  - VITE_OPENAI_API_KEY: Votre clé API OpenAI"
    echo "  - VITE_API_BASE_URL: URL de votre backend local"
    echo "  - Autres variables selon vos besoins"
    
    print_success "Environnement local configuré"
}

# Configuration de l'environnement de production
setup_production() {
    print_info "Configuration de l'environnement de production..."
    
    if [ ! -f "env.production" ]; then
        print_error "Fichier env.production non trouvé"
        exit 1
    fi
    
    print_info "Variables d'environnement à configurer sur Render:"
    echo "  - OPENAI_API_KEY: Votre clé API OpenAI"
    echo "  - ASTROLOGY_API_KEY: Clé API astrologie (optionnel)"
    echo "  - DATABASE_URL: URL de votre base de données"
    echo "  - JWT_SECRET: Secret JWT pour l'authentification"
    echo "  - SESSION_SECRET: Secret de session"
    echo "  - GOOGLE_ANALYTICS_ID: ID Google Analytics (optionnel)"
    echo "  - SENTRY_DSN: DSN Sentry pour le monitoring (optionnel)"
    
    print_success "Environnement de production configuré"
}

# Installation des dépendances
install_dependencies() {
    print_info "Installation des dépendances..."
    
    if command -v bun &> /dev/null; then
        bun install
    elif command -v yarn &> /dev/null; then
        yarn install
    else
        npm install
    fi
    
    print_success "Dépendances installées"
}

# Vérification de la configuration
verify_config() {
    print_info "Vérification de la configuration..."
    
    if [ -f ".env.local" ]; then
        print_success "Fichier .env.local trouvé"
    else
        print_warning "Fichier .env.local non trouvé"
    fi
    
    # Vérification des variables critiques
    if grep -q "VITE_OPENAI_API_KEY=sk-your_openai_api_key_here" .env.local 2>/dev/null; then
        print_warning "⚠️  Clé API OpenAI non configurée"
    fi
    
    print_success "Configuration vérifiée"
}

# Affichage de l'aide
show_help() {
    echo "Usage: $0 [local|production|help]"
    echo ""
    echo "Options:"
    echo "  local       Configure l'environnement local"
    echo "  production  Configure l'environnement de production"
    echo "  help        Affiche cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 local        # Configuration locale"
    echo "  $0 production   # Configuration production"
}

# Script principal
main() {
    case "${1:-local}" in
        "local")
            check_prerequisites
            setup_local
            install_dependencies
            verify_config
            ;;
        "production")
            check_prerequisites
            setup_production
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Option invalide: $1"
            show_help
            exit 1
            ;;
    esac
    
    echo ""
    print_success "Configuration terminée !"
    echo ""
    echo "Prochaines étapes:"
    echo "1. Modifiez le fichier .env.local avec vos vraies clés API"
    echo "2. Lancez le serveur de développement: npm run dev"
    echo "3. Pour le déploiement, configurez les variables sur Render"
}

# Exécution du script
main "$@"
