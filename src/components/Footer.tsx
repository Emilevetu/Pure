const Footer = () => {
  return (
    <footer id="contact" className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main content */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-semibold mb-4">AstroGuide</h3>
              <p className="text-muted-foreground leading-relaxed">
                Une approche moderne et pédagogique de l'astronomie positionnelle. 
                Découvrez les positions planétaires avec précision et simplicité.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  Questions ou suggestions ?
                </p>
                <a
                  href="mailto:contact@astroguide.fr"
                  className="text-primary hover:text-primary-hover transition-smooth underline hover:no-underline"
                >
                  contact@astroguide.fr
                </a>
              </div>
            </div>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-border/30">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2024 AstroGuide. Conçu avec attention aux détails.
              </p>
              <div className="flex space-x-6 text-sm">
                <span className="text-muted-foreground hover:text-foreground transition-smooth cursor-pointer">
                  Mentions légales
                </span>
                <span className="text-muted-foreground hover:text-foreground transition-smooth cursor-pointer">
                  Confidentialité
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;