import { useParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import SiteCard from '../components/SiteCard.jsx';
import { cultureTiles, featuredSites, states } from '../data/heritageData.js';

export default function StateDetails() {
  const { name } = useParams();
  const state = states.find(item => item.name.toLowerCase() === name.toLowerCase()) || states[0];
  const places = featuredSites.filter(site => site.state === state.name);

  return (
    <div>
      <section className="relative h-[58vh] overflow-hidden bg-slate-950">
        <img src={state.image} alt={state.name} className="absolute inset-0 h-full w-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl items-end px-4 pb-12 text-white">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-orange-200">State Guide</p>
            <h1 className="font-display text-6xl font-black">{state.name}</h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-200">{state.theme}</p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12">
        <SectionHeader title="Popular attractions" subtitle="A premium itinerary starter for iconic stops and nearby routes." />
        <div className="grid gap-6 md:grid-cols-3">
          {(places.length ? places : featuredSites.slice(0, 3)).map(site => <SiteCard key={site._id} site={{ ...site, images: [site.image] }} />)}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 md:grid-cols-4">
        {['Temples', 'Monuments', 'Food', 'Festivals'].map((item, index) => (
          <div className="glass rounded-lg p-5" key={item}>
            <h3 className="font-display text-2xl font-bold">{item}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{cultureTiles[index]?.[1]}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="glass rounded-lg p-6">
          <h2 className="font-display text-3xl font-bold">Suggested itinerary</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {['Arrival and old city walk', 'Major monument and food trail', 'Temple, craft village and sunset viewpoint'].map((day, i) => (
              <div className="rounded-lg bg-white p-4 dark:bg-slate-900" key={day}>Day {i + 1}: {day}</div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
