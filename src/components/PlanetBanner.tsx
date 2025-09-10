import { Suspense, useState, useRef, useEffect } from 'react';

// NASA-style CSS Solar System Viewer
const SolarSystemViewer = () => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const planets = [
    { name: 'MERCURY', distance: 60, size: 4, color: '#8C7853', speed: 15 },
    { name: 'VENUS', distance: 90, size: 6, color: '#FFC649', speed: 25 },
    { name: 'EARTH', distance: 120, size: 7, color: '#6B93D6', speed: 35 },
    { name: 'MARS', distance: 150, size: 5, color: '#CD5C5C', speed: 45 },
    { name: 'JUPITER', distance: 200, size: 16, color: '#D8CA9D', speed: 65 },
    { name: 'SATURN', distance: 250, size: 14, color: '#FAD5A5', speed: 85 },
    { name: 'URANUS', distance: 300, size: 9, color: '#4FD0E7', speed: 105 },
    { name: 'NEPTUNE', distance: 350, size: 8, color: '#4B70DD', speed: 125 }
  ];

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));
    
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Utiliser une approche non-bloquante pour le zoom
    const deltaY = e.deltaY;
    setZoom(prev => Math.max(0.3, Math.min(3, prev - deltaY * 0.001)));
  };

  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - lastMouse.x;
        const deltaY = e.clientY - lastMouse.y;
        
        setRotation(prev => ({
          x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.5)),
          y: prev.y + deltaX * 0.5
        }));
        
        setLastMouse({ x: e.clientX, y: e.clientY });
      };

      const handleGlobalMouseUp = () => {
        setIsDragging(false);
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, lastMouse]);

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onWheelCapture={(e) => {
        // Optionnel : empêcher la propagation si nécessaire
        e.stopPropagation();
      }}
      style={{ perspective: '1000px' }}
    >
      {/* Stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Solar system container */}
      <div 
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100"
        style={{
          transform: `translate(-50%, -50%) scale(${zoom}) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Sun */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="rounded-full bg-yellow-400 relative"
            style={{ 
              width: '24px', 
              height: '24px',
              boxShadow: '0 0 30px rgba(255, 212, 0, 0.8), 0 0 60px rgba(255, 212, 0, 0.4)'
            }}
          />
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-yellow-400 text-xs font-medium tracking-wide">
            SUN
          </div>
        </div>

        {/* Orbital paths and planets */}
        {planets.map((planet, index) => (
          <div key={planet.name} className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {/* Orbital path */}
            <div 
              className="border border-white/15 rounded-full absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                width: `${planet.distance * 2}px`, 
                height: `${planet.distance * 2}px`,
                borderStyle: 'dashed',
                borderWidth: '1px'
              }}
            />
            
            {/* Planet container with orbit animation */}
            <div 
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                animation: `orbit ${planet.speed}s linear infinite`,
                transformOrigin: 'center',
                width: `${planet.distance * 2}px`,
                height: `${planet.distance * 2}px`
              }}
            >
              {/* Planet */}
              <div 
                className="absolute rounded-full"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  backgroundColor: planet.color,
                  left: `${planet.distance}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  boxShadow: `0 0 ${planet.size * 2}px ${planet.color}40, inset -2px -2px 4px rgba(0,0,0,0.3)`
                }}
              />
              
              {/* Planet label */}
              <div 
                className="absolute text-xs font-medium tracking-wide"
                style={{
                  left: `${planet.distance + planet.size + 8}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: planet.color,
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                }}
              >
                {planet.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls info */}
      <div className="absolute bottom-4 right-4 bg-cosmic-dark/80 backdrop-blur-sm rounded-lg p-3 text-cosmic-text/80 text-sm">
        <div className="space-y-1">
          <div>• Clique et glisse pour tourner</div>
          <div>• Molette pour zoomer</div>
          <div>• Vue: {zoom.toFixed(1)}x</div>
        </div>
      </div>
    </div>
  );
};


const PlanetBannerContent = () => {
  return (
    <div className="w-full h-[400px] lg:h-[500px] relative overflow-hidden cosmic-banner">
      {/* Dramatic cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cosmic-dark via-cosmic-midnight to-cosmic-deep">
        {/* Large glowing orb effect */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 lg:w-96 lg:h-96 rounded-full opacity-60 animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(255, 140, 0, 0.8) 0%, rgba(255, 69, 0, 0.6) 30%, rgba(139, 69, 19, 0.4) 60%, transparent 100%)',
               filter: 'blur(40px)'
             }} />
        
        {/* Secondary glow */}
        <div className="absolute bottom-1/3 left-1/5 w-48 h-48 lg:w-72 lg:h-72 rounded-full opacity-40 animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(255, 165, 0, 0.6) 0%, rgba(255, 99, 71, 0.4) 40%, transparent 70%)',
               filter: 'blur(60px)',
               animationDelay: '2s'
             }} />
        
        {/* Particle effects */}
        <div className="absolute inset-0">
           {Array.from({ length: 150 }).map((_, i) => (
             <div
               key={i}
               className="absolute rounded-full animate-pulse"
               style={{
                 left: `${Math.random() * 100}%`,
                 top: `${Math.random() * 100}%`,
                 width: `${Math.random() * 3 + 1}px`,
                 height: `${Math.random() * 3 + 1}px`,
                 backgroundColor: Math.random() > 0.7 ? '#FFA500' : '#FFFFFF',
                 opacity: Math.random() * 0.8 + 0.2,
                 animationDelay: `${Math.random() * 5}s`,
                 animationDuration: `${4 + Math.random() * 6}s`,
               }}
             />
           ))}
        </div>
        
        {/* Shooting stars */}
        <div className="absolute top-1/4 left-0 w-1 h-20 bg-gradient-to-b from-orange-400 to-transparent opacity-60 rotate-45 animate-pulse" 
             style={{ animationDelay: '3s', animationDuration: '4s' }} />
        <div className="absolute top-3/4 right-1/4 w-1 h-16 bg-gradient-to-b from-yellow-400 to-transparent opacity-50 -rotate-12 animate-pulse" 
             style={{ animationDelay: '6s', animationDuration: '5s' }} />
      </div>
      
      <SolarSystemViewer />
      
    </div>
  );
};

// Fallback component for when WebGL is not supported
const Fallback = () => (
  <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center bg-gradient-cosmic">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-cosmic-text/10 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-cosmic-text/20" />
      </div>
      <p className="text-cosmic-text/80 text-lg max-w-2xl">
        Aperçu visuel indisponible
      </p>
    </div>
  </div>
);

const PlanetBanner = () => {
  return (
    <section>
      <Suspense fallback={<Fallback />}>
        <PlanetBannerContent />
      </Suspense>
    </section>
  );
};

export default PlanetBanner;