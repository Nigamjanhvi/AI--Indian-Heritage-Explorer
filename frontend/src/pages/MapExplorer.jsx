import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import { featuredSites } from '../data/heritageData.js';

export default function MapExplorer() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="Map Explorer" title="Interactive India heritage map" subtitle="UNESCO pins, temple pins, monument pins and state routes in one map-first experience." />
      <div className="overflow-hidden rounded-xl border border-slate-200 shadow-xl dark:border-slate-800">
        <MapContainer center={[22.9734, 78.6569]} zoom={5} scrollWheelZoom className="h-[680px]">
          <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {featuredSites.map(site => (
            <Marker key={site._id} position={[site.latitude, site.longitude]}>
              <Popup>
                <strong>{site.name}</strong>
                <p>{site.category}, {site.state}</p>
                <Link to={`/sites/${site._id}`}>Open details</Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
