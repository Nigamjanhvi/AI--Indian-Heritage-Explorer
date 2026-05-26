import { Heart, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SiteCard({ site, onFavorite }) {
  const img = site.images?.[0] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="card overflow-hidden">
      <img className="h-48 w-full object-cover" src={img.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${img}` : img} alt={site.name} />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold">{site.name}</h3>
            <p className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300"><MapPin size={15} /> {site.state}</p>
          </div>
          <button className="btn-secondary px-3" onClick={() => onFavorite?.(site._id)} aria-label="Save favorite">
            <Heart size={16} />
          </button>
        </div>
        <p className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{site.description}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-green-100 px-2 py-1 text-green-800">{site.category}</span>
          {site.unescoStatus && <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800">UNESCO</span>}
        </div>
        <Link to={`/sites/${site._id}`} className="btn-primary w-full"><Star size={16} /> View Details</Link>
      </div>
    </article>
  );
}
