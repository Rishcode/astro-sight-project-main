import { AsteroidData } from '../../services/nasaApi';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface InfoPanelProps {
  asteroids: AsteroidData[];
  selectedAsteroid: AsteroidData | null;
  onSimulateImpact: (asteroid: AsteroidData) => void;
  onClose: () => void;
}

const InfoPanel = ({ asteroids, selectedAsteroid, onSimulateImpact, onClose }: InfoPanelProps) => {
  const hazardousCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;
  
  return (
    <div className="absolute top-4 right-4 w-80 z-40 space-y-4 animate-scale-in">
      {/* Stats Panel */}
      <Card className="glass-panel p-4">
        <h2 className="text-lg font-bold text-foreground mb-3">
          Asteroid Monitor
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{asteroids.length}</div>
            <div className="text-xs text-muted-foreground">Total Objects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{hazardousCount}</div>
            <div className="text-xs text-muted-foreground">Potentially Hazardous</div>
          </div>
        </div>
      </Card>

      {/* Selected Asteroid Details */}
      {selectedAsteroid && (
        <Card className="glass-panel p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-foreground">
              {selectedAsteroid.name}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  selectedAsteroid.is_potentially_hazardous_asteroid 
                    ? 'bg-destructive pulse-danger' 
                    : 'bg-asteroid-safe'
                }`} 
              />
              <span className="text-sm text-muted-foreground">
                {selectedAsteroid.is_potentially_hazardous_asteroid 
                  ? 'Potentially Hazardous' 
                  : 'Non-Hazardous'
                }
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-muted-foreground">Diameter</div>
                <div className="font-medium text-foreground">
                  {selectedAsteroid.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                </div>
              </div>
              
              {selectedAsteroid.close_approach_data[0] && (
                <>
                  <div>
                    <div className="text-muted-foreground">Miss Distance</div>
                    <div className="font-medium text-foreground">
                      {parseFloat(selectedAsteroid.close_approach_data[0].miss_distance.lunar).toFixed(1)} LD
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Velocity</div>
                    <div className="font-medium text-foreground">
                      {parseFloat(selectedAsteroid.close_approach_data[0].relative_velocity.kilometers_per_second).toFixed(1)} km/s
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-muted-foreground">Approach Date</div>
                    <div className="font-medium text-foreground">
                      {new Date(selectedAsteroid.close_approach_data[0].close_approach_date).toLocaleDateString()}
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <div className="text-muted-foreground">Magnitude</div>
                <div className="font-medium text-foreground">
                  {selectedAsteroid.absolute_magnitude_h.toFixed(1)} H
                </div>
              </div>
            </div>
            
            <Button 
              onClick={() => onSimulateImpact(selectedAsteroid)}
              variant={selectedAsteroid.is_potentially_hazardous_asteroid ? "destructive" : "default"}
              className="w-full mt-4"
            >
              🎯 Simulate Impact
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(selectedAsteroid.nasa_jpl_url, '_blank')}
            >
              📋 NASA Details
            </Button>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="glass-panel p-4">
        <h4 className="font-medium text-foreground mb-2">Controls</h4>
        <div className="text-xs text-muted-foreground space-y-1">
          <p> Drag to rotate view</p>
          <p> Scroll to zoom in or zoom out</p>
          <p> Hover asteroids for info</p>
          <p> Click asteroids for details</p>
        </div>
      </Card>
    </div>
  );
};

export default InfoPanel;