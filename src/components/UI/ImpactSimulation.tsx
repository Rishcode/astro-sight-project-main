import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { AsteroidData } from '../../services/nasaApi';

interface ImpactSimulationProps {
  asteroid: AsteroidData;
  onClose: () => void;
}

const ImpactSimulation = ({ asteroid, onClose }: ImpactSimulationProps) => {
  const [phase, setPhase] = useState<'approach' | 'impact' | 'aftermath'>('approach');
  const [timer, setTimer] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          if (phase === 'approach') {
            setPhase('impact');
            return 3;
          } else if (phase === 'impact') {
            setPhase('aftermath');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

  // Calculate impact effects based on asteroid properties
  const diameterKm = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
  const velocity = asteroid.close_approach_data[0] 
    ? parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_second)
    : 15;

  // Simplified impact calculations
  const kineticEnergy = 0.5 * Math.pow(diameterKm, 3) * Math.pow(velocity, 2) / 1000; // Simplified
  const craterDiameter = diameterKm * 20; // Rough estimate
  const tsunamiHeight = diameterKm > 1 ? Math.min(100, diameterKm * 50) : 0;

  const getPhaseContent = () => {
    switch (phase) {
      case 'approach':
        return {
          title: 'Asteroid Approaching',
          content: (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-2">🌌</div>
                <div className="text-2xl font-bold text-destructive">T-{timer}</div>
                <p className="text-sm text-muted-foreground">Seconds to impact</p>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Object:</strong> {asteroid.name}</p>
                <p><strong>Diameter:</strong> {diameterKm.toFixed(2)} km</p>
                <p><strong>Velocity:</strong> {velocity.toFixed(1)} km/s</p>
                <p><strong>Impact Energy:</strong> ~{kineticEnergy.toExponential(2)} joules</p>
              </div>
            </div>
          )
        };
      
      case 'impact':
        return {
          title: 'IMPACT!',
          content: (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-6xl mb-2 animate-pulse">💥</div>
                <div className="text-2xl font-bold text-destructive">IMPACT!</div>
                <p className="text-sm text-muted-foreground">Calculating damage...</p>
              </div>
              <div className="bg-destructive/20 p-3 rounded border border-destructive/30">
                <p className="text-destructive font-medium text-center">
                  Massive explosion detected!
                </p>
              </div>
            </div>
          )
        };
      
      case 'aftermath':
        return {
          title: 'Impact Assessment',
          content: (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🌍💔</div>
                <p className="text-destructive font-bold">Catastrophic Impact</p>
              </div>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Crater Diameter</div>
                    <div className="font-bold text-destructive">{craterDiameter.toFixed(1)} km</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Impact Energy</div>
                    <div className="font-bold text-destructive">{kineticEnergy.toExponential(1)} J</div>
                  </div>
                  {tsunamiHeight > 0 && (
                    <>
                      <div>
                        <div className="text-muted-foreground">Tsunami Height</div>
                        <div className="font-bold text-destructive">{tsunamiHeight.toFixed(0)} m</div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="bg-destructive/20 p-3 rounded border border-destructive/30">
                  <h4 className="font-medium text-destructive mb-2">Potential Effects:</h4>
                  <ul className="text-xs text-destructive space-y-1">
                    {diameterKm > 0.1 && <li>• Local destruction</li>}
                    {diameterKm > 1 && <li>• Regional devastation</li>}
                    {diameterKm > 10 && <li>• Global climate impact</li>}
                    {tsunamiHeight > 0 && <li>• Massive tsunamis</li>}
                    {diameterKm > 5 && <li>• Mass extinction event</li>}
                  </ul>
                </div>
                
                <div className="bg-primary/20 p-3 rounded border border-primary/30">
                  <h4 className="font-medium text-primary mb-1">NASA's Planetary Defense</h4>
                  <p className="text-xs text-muted-foreground">
                    This is why NASA monitors Near-Earth Objects and develops deflection technologies.
                  </p>
                </div>
              </div>
            </div>
          )
        };
    }
  };

  const phaseContent = getPhaseContent();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="glass-panel p-6 max-w-md w-full mx-4 animate-scale-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-foreground">{phaseContent.title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>
        
        {phaseContent.content}
        
        {phase === 'aftermath' && (
          <div className="mt-6 space-y-2">
            <Button 
              onClick={onClose} 
              className="w-full"
              variant="default"
            >
              Return to Monitor
            </Button>
            <Button 
              onClick={() => window.open('https://www.nasa.gov/planetary-defense/', '_blank')} 
              variant="outline" 
              className="w-full"
            >
              Learn About Planetary Defense
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ImpactSimulation;