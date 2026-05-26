import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';

export default function Collections() {
  const [collections, setCollections] = useState([
    { title: 'Rajasthan Trip', description: 'Forts, palaces, desert sunsets and craft bazaars.' },
    { title: 'Temple Tour', description: 'South Indian temple architecture and festival routes.' }
  ]);
  const [title, setTitle] = useState('');

  function add(e) {
    e.preventDefault();
    if (!title.trim()) return;
    setCollections([{ title, description: 'New personal travel collection.' }, ...collections]);
    setTitle('');
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="Saved Places" title="Travel collections" subtitle="Create collections like Rajasthan Trip, Temple Tour or North India Journey." />
      <form onSubmit={add} className="glass mb-8 flex gap-3 rounded-lg p-4">
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Collection name" />
        <button className="btn-primary">Create</button>
      </form>
      <div className="grid gap-5 md:grid-cols-3">
        {collections.map(item => <div className="card p-6" key={item.title}><h2 className="font-display text-2xl font-bold">{item.title}</h2><p className="mt-2 text-slate-600 dark:text-slate-300">{item.description}</p></div>)}
      </div>
    </section>
  );
}
