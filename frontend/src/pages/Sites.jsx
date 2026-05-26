import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import GlobalSearch from '../components/GlobalSearch.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SiteCard from '../components/SiteCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { featuredSites } from '../data/heritageData.js';

export default function Sites() {
  const [sites, setSites] = useState([]);
  const [filters, setFilters] = useState({ name: '', state: '', category: '', unescoStatus: '' });
  const [suggestions, setSuggestions] = useState([]);
  const { user } = useAuth();

  async function loadSites() {
    try {
      const { data } = await api.get('/sites/getall', { params: filters });
      setSites(data.sites.length ? data.sites : featuredSites);
    } catch {
      setSites(featuredSites);
    }
  }

  useEffect(() => { loadSites(); }, []);

  async function search(e) {
    e.preventDefault();
    await loadSites();
  }

  async function updateName(value) {
    setFilters({ ...filters, name: value });
    if (value.length > 1) {
      const { data } = await api.get('/sites/suggestions', { params: { q: value } });
      setSuggestions(data.suggestions);
    } else {
      setSuggestions([]);
    }
  }

  async function saveFavorite(site) {
    if (!user) return alert('Login to save favorites');
    await api.post('/favorites', { site });
    alert('Saved to favorites');
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <SectionHeader eyebrow="Explore" title="Find monuments, temples, festivals and UNESCO places" subtitle="Advanced filters meet a tourism-grade card layout with saved places and smart suggestions." />
      <div className="mb-6"><GlobalSearch /></div>
      <form onSubmit={search} className="glass mb-8 grid gap-3 rounded-lg p-4 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <input className="input" placeholder="Search site name" value={filters.name} onChange={e => updateName(e.target.value)} />
          {suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full rounded-md border bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900">
              {suggestions.map(item => <button type="button" className="block w-full rounded px-2 py-1 text-left hover:bg-slate-100 dark:hover:bg-slate-800" key={item._id} onClick={() => { setFilters({ ...filters, name: item.name }); setSuggestions([]); }}>{item.name}, {item.state}</button>)}
            </div>
          )}
        </div>
        <input className="input" placeholder="State" value={filters.state} onChange={e => setFilters({ ...filters, state: e.target.value })} />
        <input className="input" placeholder="Category" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} />
        <select className="input" value={filters.unescoStatus} onChange={e => setFilters({ ...filters, unescoStatus: e.target.value })}>
          <option value="">UNESCO: Any</option>
          <option value="true">UNESCO only</option>
          <option value="false">Non-UNESCO</option>
        </select>
        <button className="btn-primary md:col-span-5">Search</button>
      </form>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sites.map(site => <SiteCard key={site._id} site={{ ...site, images: site.images || [site.image] }} onFavorite={saveFavorite} />)}
      </div>
    </section>
  );
}
