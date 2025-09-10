const MethodSection = () => {
  return (
    <section id="methode" className="cosmic-banner py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-3xl lg:text-4xl font-light text-cosmic-text mb-8">
            Notre méthode
          </h2>
          
          {/* Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <p className="text-cosmic-text/90 leading-relaxed">
                Pure propose une approche <strong>pédagogique et scientifique</strong> 
                de l'astronomie positionnelle. Nous nous concentrons sur les données 
                factuelles et observables.
              </p>
              
              <p className="text-cosmic-text/90 leading-relaxed">
                Aucune prédiction, aucune interprétation mystique. 
                Simplement les <strong>positions planétaires précises</strong> 
                à un moment donné, calculées selon les éphémérides astronomiques.
              </p>
              
              <p className="text-cosmic-text/90 leading-relaxed">
                Un outil pour comprendre et visualiser notre place 
                dans le système solaire.
              </p>
            </div>
            
            {/* Constellation illustration */}
            <div className="relative">
              <div className="w-64 h-64 mx-auto relative">
                {/* Simple constellation pattern */}
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full opacity-60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Constellation lines */}
                  <g stroke="currentColor" strokeWidth="1" className="text-cosmic-text/40">
                    <line x1="50" y1="60" x2="80" y2="40" />
                    <line x1="80" y1="40" x2="120" y2="50" />
                    <line x1="120" y1="50" x2="150" y2="30" />
                    <line x1="80" y1="40" x2="90" y2="80" />
                    <line x1="90" y1="80" x2="130" y2="90" />
                    <line x1="130" y1="90" x2="120" y2="50" />
                    <line x1="90" y1="80" x2="70" y2="120" />
                    <line x1="130" y1="90" x2="160" y2="120" />
                    <line x1="70" y1="120" x2="100" y2="140" />
                    <line x1="100" y1="140" x2="160" y2="120" />
                    <line x1="100" y1="140" x2="120" y2="170" />
                  </g>
                  
                  {/* Stars */}
                  <g fill="currentColor" className="text-cosmic-text">
                    <circle cx="50" cy="60" r="2" />
                    <circle cx="80" cy="40" r="3" />
                    <circle cx="120" cy="50" r="2.5" />
                    <circle cx="150" cy="30" r="2" />
                    <circle cx="90" cy="80" r="3.5" />
                    <circle cx="130" cy="90" r="2.5" />
                    <circle cx="70" cy="120" r="2" />
                    <circle cx="160" cy="120" r="2.5" />
                    <circle cx="100" cy="140" r="3" />
                    <circle cx="120" cy="170" r="2" />
                  </g>
                </svg>
                
                {/* Orbital rings */}
                <div className="absolute inset-0 border border-cosmic-text/20 rounded-full animate-orbit-slow" />
                <div className="absolute inset-4 border border-cosmic-text/15 rounded-full animate-orbit-medium" />
                <div className="absolute inset-8 border border-cosmic-text/10 rounded-full animate-orbit-fast" />
              </div>
            </div>
          </div>
          
          {/* Bottom note */}
          <div className="mt-12 p-6 rounded-lg bg-cosmic-text/5 border border-cosmic-text/20">
            <p className="text-cosmic-text/80 text-sm">
              <strong>Transparence :</strong> Toutes nos méthodes de calcul sont basées 
              sur les standards astronomiques internationaux (JPL, VSOP87).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodSection;