const NASA_API_KEY = '5rWyLxjeX3aIXuxPGgjJxC2ncuQqdo4YsUor1fiz';
const NASA_BASE_URL = 'https://api.nasa.gov/neo/rest/v1';

export interface AsteroidData {
  id: string;
  name: string;
  nasa_jpl_url: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    relative_velocity: {
      kilometers_per_hour: string;
      kilometers_per_second: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
    };
    orbiting_body: string;
  }>;
  absolute_magnitude_h: number;
  orbital_data?: {
    orbit_id: string;
    orbit_determination_date: string;
    first_observation_date: string;
    last_observation_date: string;
    data_arc_in_days: number;
    observations_used: number;
    orbit_uncertainty: string;
    minimum_orbit_intersection: string;
    jupiter_tisserand_invariant: string;
    epoch_osculation: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    ascending_node_longitude: string;
    orbital_period: string;
    perihelion_distance: string;
    perihelion_argument: string;
    aphelion_distance: string;
    perihelion_time: string;
    mean_anomaly: string;
    mean_motion: string;
  };
}

export interface NeoFeedResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: {
    [date: string]: AsteroidData[];
  };
}

export interface NeoBrowseResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  page: {
    size: number;
    total_elements: number;
    total_pages: number;
    number: number;
  };
  near_earth_objects: AsteroidData[];
}

class NasaApiService {
  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${NASA_BASE_URL}${endpoint}`);
    
    // Add API key and other parameters
    url.searchParams.append('api_key', NASA_API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`NASA API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('NASA API request failed:', error);
      throw error;
    }
  }

  /**
   * Get asteroid feed data for a specific date range
   */
  async getAsteroidFeed(startDate?: string, endDate?: string): Promise<NeoFeedResponse> {
    const params: Record<string, string> = {};
    
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return this.makeRequest<NeoFeedResponse>('/feed', params);
  }

  /**
   * Browse all known Near Earth Objects
   */
  async browseAsteroids(page = 0, size = 20): Promise<NeoBrowseResponse> {
    return this.makeRequest<NeoBrowseResponse>('/neo/browse', {
      page: page.toString(),
      size: size.toString()
    });
  }

  /**
   * Get detailed information about a specific asteroid
   */
  async getAsteroidDetails(asteroidId: string): Promise<AsteroidData> {
    return this.makeRequest<AsteroidData>(`/neo/${asteroidId}`);
  }

  /**
   * Get current approaching asteroids for the next week
   */
  async getCurrentApproachingAsteroids(): Promise<AsteroidData[]> {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = nextWeek.toISOString().split('T')[0];
    
    try {
      const response = await this.getAsteroidFeed(startDate, endDate);
      
      // Flatten the asteroid data from all dates
      const allAsteroids: AsteroidData[] = [];
      Object.values(response.near_earth_objects).forEach(dateAsteroids => {
        allAsteroids.push(...dateAsteroids);
      });
      
      // Sort by approach date
      return allAsteroids.sort((a, b) => {
        const dateA = new Date(a.close_approach_data[0]?.close_approach_date_full || '');
        const dateB = new Date(b.close_approach_data[0]?.close_approach_date_full || '');
        return dateA.getTime() - dateB.getTime();
      });
    } catch (error) {
      console.error('Failed to fetch current approaching asteroids:', error);
      // Return mock data for demo purposes
      return this.getMockAsteroidData();
    }
  }

  /**
   * Mock data for development/demo purposes
   */
  private getMockAsteroidData(): AsteroidData[] {
    return [
      {
        id: '2000719',
        name: '719 Albert (1911 MT)',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2000719',
        is_potentially_hazardous_asteroid: true,
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 2.347,
            estimated_diameter_max: 5.249
          }
        },
        close_approach_data: [{
          close_approach_date: '2024-01-01',
          close_approach_date_full: '2024-Jan-01 12:00',
          relative_velocity: {
            kilometers_per_hour: '54000.5',
            kilometers_per_second: '15.0'
          },
          miss_distance: {
            astronomical: '0.0521',
            lunar: '20.27',
            kilometers: '7794533'
          },
          orbiting_body: 'Earth'
        }],
        absolute_magnitude_h: 15.92
      },
      {
        id: '3426410',
        name: '(2008 QV11)',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=3426410',
        is_potentially_hazardous_asteroid: false,
        estimated_diameter: {
          kilometers: {
            estimated_diameter_min: 0.134,
            estimated_diameter_max: 0.300
          }
        },
        close_approach_data: [{
          close_approach_date: '2024-01-02',
          close_approach_date_full: '2024-Jan-02 08:30',
          relative_velocity: {
            kilometers_per_hour: '31420.2',
            kilometers_per_second: '8.73'
          },
          miss_distance: {
            astronomical: '0.1234',
            lunar: '48.01',
            kilometers: '18456782'
          },
          orbiting_body: 'Earth'
        }],
        absolute_magnitude_h: 22.1
      }
    ];
  }
}

export const nasaApiService = new NasaApiService();