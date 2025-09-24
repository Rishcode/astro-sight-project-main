import { useState, useEffect } from 'react';
import Scene3D from '../components/Scene3D/Scene3D';
import AsteroidTooltip from '../components/UI/AsteroidTooltip';
import InfoPanel from '../components/UI/InfoPanel';
import ImpactSimulation from '../components/UI/ImpactSimulation';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { nasaApiService, AsteroidData } from '../services/nasaApi';
import { useToast } from '../hooks/use-toast';

const Index = () => {
  const [asteroids, setAsteroids] = useState<AsteroidData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredAsteroid, setHoveredAsteroid] = useState<AsteroidData | null>(null);
  const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null);
  const [simulatingAsteroid, setSimulatingAsteroid] = useState<AsteroidData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { toast } = useToast();

  // Load asteroid data on component mount
  useEffect(() => {
    const loadAsteroidData = async () => {
      try {
        setLoading(true);
        const asteroidData = await nasaApiService.getCurrentApproachingAsteroids();
        setAsteroids(asteroidData);
        
        toast({
          title: "Universe Loaded",
          description: `Found ${asteroidData.length} approaching asteroids`,
        });
      } catch (error) {
        console.error('Failed to load asteroid data:', error);
        toast({
          title: "Connection Error",
          description: "Using demo data. Check your connection to NASA APIs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadAsteroidData();
  }, [toast]);

  // Track mouse position for tooltip
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAsteroidHover = (asteroid: AsteroidData | null) => {
    setHoveredAsteroid(asteroid);
  };

  const handleAsteroidClick = (asteroid: AsteroidData) => {
    setSelectedAsteroid(asteroid);
    toast({
      title: "Asteroid Selected",
      description: `Now viewing: ${asteroid.name}`,
    });
  };

  const handleSimulateImpact = (asteroid: AsteroidData) => {
    setSimulatingAsteroid(asteroid);
    toast({
      title: "Impact Simulation Started",
      description: `Simulating impact of ${asteroid.name}`,
      variant: asteroid.is_potentially_hazardous_asteroid ? "destructive" : "default",
    });
  };

  const handleCloseSimulation = () => {
    setSimulatingAsteroid(null);
  };

  const handleCloseInfo = () => {
    setSelectedAsteroid(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-background">
      {/* NASA Header */}
      <div className="absolute top-4 left-4 z-40 animate-fade-in-up">
        <div className="glass-panel p-4 rounded-lg">
          <h1 className="text-xl font-bold text-foreground">
            FOR NASA HACKATHON
          </h1>
          <p className="text-sm text-muted-foreground">
            Real-time Near-Earth Object monitoring
          </p>
        </div>
      </div>

      {/* 3D Scene */}
      <Scene3D
        asteroids={asteroids}
        onAsteroidHover={handleAsteroidHover}
        onAsteroidClick={handleAsteroidClick}
        hoveredAsteroid={hoveredAsteroid}
      />

      {/* Asteroid Tooltip */}
      <AsteroidTooltip 
        asteroid={hoveredAsteroid} 
        mousePosition={mousePosition}
      />

      {/* Info Panel */}
      <InfoPanel
        asteroids={asteroids}
        selectedAsteroid={selectedAsteroid}
        onSimulateImpact={handleSimulateImpact}
        onClose={handleCloseInfo}
      />

      {/* Impact Simulation Modal */}
      {simulatingAsteroid && (
        <ImpactSimulation
          asteroid={simulatingAsteroid}
          onClose={handleCloseSimulation}
        />
      )}

      {/* Footer Credits */}
      <div className="absolute bottom-4 left-4 z-40">
        <div className="glass-panel p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            USING NASA NEO API
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
