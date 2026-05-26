import { Mic, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trendingSearches } from '../data/heritageData.js';

export default function GlobalSearch({ large = false }) {
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(() => JSON.parse(localStorage.getItem('recentSearches') || '[]'));
  const navigate = useNavigate();

  function submit(value = query) {
    if (!value.trim()) return;
    const next = [value, ...recent.filter(item => item !== value)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(next));
    setRecent(next);
    navigate(`/explore?q=${encodeURIComponent(value)}`);
  }

  function voiceSearch() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return alert('Voice search is not supported in this browser.');
    const recognition = new Recognition();
    recognition.onresult = event => setQuery(event.results[0][0].transcript);
    recognition.start();
  }

  return (
    <div className="w-full">
      <form onSubmit={e => { e.preventDefault(); submit(); }} className={`glass flex items-center gap-3 rounded-full p-2 ${large ? 'max-w-4xl' : ''}`}>
        <Search className="ml-3 text-saffron" />
        <input className="w-full bg-transparent px-2 py-3 outline-none" placeholder="Search states, temples, monuments, festivals..." value={query} onChange={e => setQuery(e.target.value)} />
        <button type="button" className="btn-secondary rounded-full px-3" onClick={voiceSearch}><Mic size={18} /></button>
        <button className="btn-primary rounded-full px-6">Search</button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        {[...recent, ...trendingSearches].slice(0, 7).map(item => (
          <button key={item} onClick={() => submit(item)} className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-slate-700 shadow-sm hover:bg-orange-50 dark:bg-slate-900/80 dark:text-slate-200">
            <TrendingUp size={13} /> {item}
          </button>
        ))}
      </div>
    </div>
  );
}
