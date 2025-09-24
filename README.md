
# AstroSight

AstroSight is a hackathon prototype for visualizing Near-Earth Objects (NEOs) using NASA's Near Earth Object Web Service (NeoWs) API. It combines a real‑time 3D orbital scene (React Three Fiber + Three.js) with approachable UI panels to explore asteroids, their orbits, and potential impact characteristics.

## 🚀 Hackathon Pitch
Track, visualize, and understand near‑Earth asteroids in an educational, interactive way. AstroSight aims to make raw orbital + approach data intuitive via:
- 3D orbital visualization (procedurally generated orbital paths + asteroid motion)
- Highlighting potentially hazardous asteroids (PHA classification)
- Quick access to size, velocity, miss distance, and approach timing
- Impact energy & basic effect estimation (simulation modal)
- Smooth, modern NASA‑inspired UI (Tailwind + component system)

## 🌌 Key Features
- Real-time 3D scene with:
	- Earth (textured + specular highlights)
	- Sun lighting rig
	- Dynamic asteroid field (orbits derived from approach distance scaling)
	- Orbit ring sampling (performance-conscious)
	- Instanced background asteroid belt for depth
- NASA NeoWs API integration (with graceful mock fallback)
- Impact Simulation modal (phase-based: Approach → Impact → Aftermath)
- Hazard highlighting & minimal clutter (filtered orbit ring rendering)
- Modular UI components (cards, dialogs, tooltips, loading states)

## 🛰️ Data Source: NASA NeoWs
We use the official NASA Near Earth Object Web Service:
https://api.nasa.gov/

Endpoints leveraged:
- `/feed` – Near-earth objects over a date range
- `/neo/browse` – Paged asteroid catalog
- `/neo/:id` – Detailed asteroid info

The service wrapper lives in `src/services/nasaApi.ts` and provides:
- `getCurrentApproachingAsteroids()` – 7‑day look‑ahead aggregation
- `browseAsteroids(page, size)`
- `getAsteroidDetails(id)`
Graceful fallback provides mock objects if the live API fails (rate limits, offline, etc.).

## 🧠 Simplifications & Assumptions
This is a hackathon prototype, so some astrophysical accuracy is sacrificed for clarity & speed:
- Orbits are visually inferred from miss distance scaling, not full Keplerian elements
- Velocity influences simple angular speed; eccentricity not fully modeled
- Impact simulation uses simplified kinetic energy & crater approximation
- Hazard status taken directly from `is_potentially_hazardous_asteroid`
- Atmospheric glow / clouds currently disabled or minimal for performance & clarity

## 🏗️ Tech Stack
| Layer | Tech |
|-------|------|
| UI | React + TypeScript + Tailwind CSS |
| 3D / Rendering | React Three Fiber (R3F), Three.js, @react-three/drei |
| Data Fetch | Native Fetch API |
| Build Tool | Vite |
| Styling System | Utility-first + design tokens (CSS variables) |

## 📂 Project Structure (Core)
```
src/
	components/
		Scene3D/        # 3D scene entities (Earth, Sun, AsteroidField, etc.)
		UI/             # Reusable UI components & modal logic
	services/
		nasaApi.ts      # NASA NeoWs API service + types + fallback
	pages/
		Index.tsx       # Main landing / layout
```

## 🔑 Environment / API Key
The current prototype embeds an API key directly in `nasaApi.ts` for hackathon velocity. For production:
1. Move the key to an environment variable (e.g. `VITE_NASA_API_KEY`).
2. Reference it via `import.meta.env.VITE_NASA_API_KEY`.
3. Regenerate or restrict the key if this repository becomes public.

## 🛠️ Local Development
Prerequisites: Node 18+ (or Bun), npm (or pnpm / bun). (If using Bun, adapt commands.)

Install & run:
```bash
npm install
npm run dev
```
Then visit: http://localhost:5173

Build production bundle:
```bash
npm run build
```
Preview production build:
```bash
npm run preview
```

## 🧪 Future Enhancements (Backlog)
- Real orbital elements ingestion (semi-major axis, eccentricity, inclination) from detailed NEO data
- Night-side city lights & dynamic day/night terminator
- Atmospheric Fresnel rim glow shader
- UI toggles for orbit rings, hazard-only mode, belt density
- Search & filter for specific asteroid designations
- Persistence layer (local history of viewed objects)
- Progressive loading indicators inside 3D scene
- Optional AR or WebXR mode for immersive education

## 🛡️ Performance Considerations
- Orbit rings selectively rendered (subset + hazardous)
- Instanced meshes for dense belt objects
- Texture loading is async with fallback canvas textures
- Low-frequency normal perturbation instead of heavy normal maps

## ⚠️ Disclaimers
This is not an authoritative scientific visualization. Orbital positions, paths, and impact estimates are illustrative. Always consult official NASA/JPL sources for mission or research data.

## 🤝 Team & Contribution
Hackathon-friendly: Feel free to fork, adapt, and iterate. Suggestions:
1. Open an issue for feature ideas
2. Keep visual clarity & educational value in mind
3. Provide screenshots / short clips for visual changes

## 📜 License
Choose a permissive license (e.g. MIT) or add one here. (Currently unspecified.)

## 🙏 Acknowledgments
- NASA Open APIs (NeoWs)
- React Three Fiber & Drei maintainers
- Three.js community

---
If you’d like, I can add badges, a banner image, or a CONTRIBUTING guide—just ask.

