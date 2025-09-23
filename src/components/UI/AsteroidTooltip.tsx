import { AsteroidData } from '../../services/nasaApi';

interface AsteroidTooltipProps {
  asteroid: AsteroidData | null;
  mousePosition: { x: number; y: number };
}

const AsteroidTooltip = ({ asteroid, mousePosition }: AsteroidTooltipProps) => {
  if (!asteroid) return null;

  const approachData = asteroid.close_approach_data[0];
  const diameterKm = asteroid.estimated_diameter.kilometers.estimated_diameter_max;
  const isHazardous = asteroid.is_potentially_hazardous_asteroid;

  return (
    <div 
      className="fixed z-50 pointer-events-none animate-fade-in-up"
      style={{
        left: mousePosition.x + 20,
        top: mousePosition.y - 50,
      }}
    >
      <div className="glass-panel p-4 rounded-lg max-w-xs space-transition">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                isHazardous ? 'bg-destructive pulse-danger' : 'bg-asteroid-safe'
              }`} 
            />
            <h3 className="font-semibold text-sm text-foreground truncate">
              {asteroid.name}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">Size:</span>
              <p className="text-foreground font-medium">
                {diameterKm.toFixed(2)} km
              </p>
            </div>
            
            {approachData && (
              <>
                <div>
                  <span className="text-muted-foreground">Distance:</span>
                  <p className="text-foreground font-medium">
                    {parseFloat(approachData.miss_distance.lunar).toFixed(1)} LD
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Speed:</span>
                  <p className="text-foreground font-medium">
                    {(parseFloat(approachData.relative_velocity.kilometers_per_second)).toFixed(1)} km/s
                  </p>
                </div>
                
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <p className="text-foreground font-medium">
                    {new Date(approachData.close_approach_date).toLocaleDateString()}
                  </p>
                </div>
              </>
            )}
          </div>
          
          {isHazardous && (
            <div className="mt-2 p-2 bg-destructive/20 rounded border border-destructive/30">
              <p className="text-xs text-destructive font-medium">
                ⚠️ Potentially Hazardous
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AsteroidTooltip;