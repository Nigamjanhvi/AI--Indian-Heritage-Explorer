import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import SiteCard from '../components/SiteCard.jsx';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load() {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get('/favorites');
      setFavorites(Array.isArray(data.favorites) ? data.favorites.filter(f => f?.site) : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load saved places. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(siteId) {
    try {
      await api.delete(`/favorites/${siteId}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove this saved place.');
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-6 font-display text-4xl font-bold">Saved Places</h1>
      {error && <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">{error}</p>}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(item => <div key={item} className="h-80 animate-pulse rounded-lg bg-white/70 dark:bg-slate-900" />)}
        </div>
      ) : favorites.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map(f => <SiteCard key={f._id || f.site?._id} site={f.site} onFavorite={remove} />)}
        </div>
      ) : (
        <div className="rounded-xl border border-orange-100 bg-white/80 p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900">
          <h2 className="font-display text-3xl font-bold">No saved places yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600 dark:text-slate-300">Start exploring heritage sites and save the places you want to revisit later.</p>
          <Link to="/explore" className="btn-primary mt-6 rounded-full">Explore Heritage</Link>
        </div>
      )}
    </section>
  );
}
