import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import SiteCard from '../components/SiteCard.jsx';
import { featuredSites } from '../data/heritageData.js';

export default function Unesco() {
  const [view, setView] = useState('grid');
  const unesco = featuredSites.filter(site => site.unescoStatus);
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="UNESCO Collection" title="World Heritage, explored beautifully" subtitle="Switch between grid, timeline, gallery and map-inspired views." />
      <div className="mb-6 flex flex-wrap gap-2">
        {['grid', 'timeline', 'gallery'].map(item => <button className={view === item ? 'btn-primary' : 'btn-secondary'} onClick={() => setView(item)} key={item}>{item}</button>)}
      </div>
      {view === 'grid' && <div className="grid gap-6 md:grid-cols-3">{unesco.map(site => <SiteCard key={site._id} site={{ ...site, images: [site.image] }} />)}</div>}
      {view === 'timeline' && <div className="space-y-4">{unesco.map((site, i) => <div className="glass rounded-lg p-5" key={site._id}><p className="text-saffron">Era {i + 1}</p><h3 className="font-display text-2xl font-bold">{site.name}</h3><p>{site.description}</p></div>)}</div>}
      {view === 'gallery' && <div className="masonry">{unesco.map(site => <img className="rounded-lg" src={site.image} alt={site.name} key={site._id} />)}</div>}
    </section>
  );
}
