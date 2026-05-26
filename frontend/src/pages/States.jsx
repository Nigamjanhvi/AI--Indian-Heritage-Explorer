import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import { states } from '../data/heritageData.js';

export default function States() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="States" title="Explore heritage by state" subtitle="State guides combine attractions, temples, monuments, food, festivals, routes and suggested itineraries." />
      <div className="grid gap-6 md:grid-cols-2">
        {states.map(state => (
          <Link to={`/states/${state.name}`} className="group card overflow-hidden" key={state.name}>
            <img src={state.image} alt={state.name} className="h-72 w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="p-6">
              <h2 className="font-display text-3xl font-bold">{state.name}</h2>
              <p className="mt-2 text-slate-600 dark:text-slate-300">{state.theme}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
