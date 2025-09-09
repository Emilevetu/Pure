#!/bin/bash

# Script de configuration simplifié pour Astro Alignement
# Utilise un seul fichier .env pour local ET production

set -e

echo "🚀 Configuration simplifiée de l'environnement Astro Alignement"

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

# Configuration de l'environnement
setup_env() {
    print_info "Configuration de l'environnement..."
    
    if [ ! -f ".env" ]; then
        print_error "Fichier .env non trouvé"
        exit 1
    fi
    
    print_success "Fichier .env trouvé"
    print_warning "⚠️  IMPORTANT: Modifiez le fichier .env avec vos vraies clés API"
}

# Vérification de la configuration
verify_config() {
    print_info "Vérification de la configuration..."
    
    if [ -f ".env" ]; then
        print_success "Fichier .env trouvé"
        
        # Vérification des variables critiques
        if grep -q "VITE_OPENAI_API_KEY=sk-your_openai_api_key_here" .env 2>/dev/null; then
            print_warning "⚠️  Clé API OpenAI non configurée"
        fi
        
        if grep -q "VITE_API_BASE_URL=http://localhost:3000/api" .env 2>/dev/null; then
            print_info "ℹ️  URL API backend configurée pour le développement local"
        fi
    else
        print_warning "Fichier .env non trouvé"
    fi
    
    print_success "Configuration vérifiée"
}

# Instructions post-configuration
show_post_setup_instructions() {
    echo ""
    print_info "📋 Prochaines étapes après installation de Node.js:"
    echo ""
    echo "1. Installer Node.js (voir INSTALL.md):"
    echo "   - Option recommandée: brew install node"
    echo "   - Ou via nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo ""
    echo "2. Installer les dépendances:"
    echo "   npm install"
    echo ""
    echo "3. Lancer le serveur de développement:"
    echo "   npm run dev"
    echo ""
    echo "4. Pour le déploiement sur Render:"
    echo "   ./scripts/deploy-render.sh"
}

# Affichage de l'aide
show_help() {
    echo "Usage: $0 [setup|help]"
    echo ""
    echo "Options:"
    echo "  setup       Configure l'environnement"
    echo "  help        Affiche cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 setup        # Configuration de l'environnement"
    echo ""
    echo "Note: Ce script utilise un fichier .env unique pour local ET production"
}

# Script principal
main() {
    case "${1:-setup}" in
        "setup")
            setup_env
            verify_config
            show_post_setup_instructions
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
    echo "📁 Fichier de configuration:"
    echo "  - .env (variables d'environnement unifiées)"
    echo ""
    echo "🔑 Variables à configurer dans .env:"
    echo "  - VITE_OPENAI_API_KEY: Votre clé API OpenAI"
    echo "  - VITE_API_BASE_URL: URL de votre backend (localhost:3000 en local)"
    echo "  - Autres variables selon vos besoins"
    echo ""
    echo "✅ BASCULEMENT AUTOMATIQUE:"
    echo "  - En local: utilise les valeurs du fichier .env"
    echo "  - Sur Render: utilise les variables d'environnement Render"
    echo "  - Aucune modification de code nécessaire !"
}

# Exécution du script
main "$@"
