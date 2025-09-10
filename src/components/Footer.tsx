const Footer = () => {
  return (
    <footer id="contact" className="bg-muted/30 border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Bottom section */}
          <div className="pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-muted-foreground">
                © 2024 Pure. Conçu avec attention aux détails.
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