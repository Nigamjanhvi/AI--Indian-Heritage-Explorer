import SectionHeader from '../components/SectionHeader.jsx';
import { cultureTiles } from '../data/heritageData.js';

export default function Culture() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <SectionHeader eyebrow="Culture" title="India’s living heritage" subtitle="Festivals, textiles, classical dance, music, craft and cuisine as interactive cultural journeys." />
      <div className="grid gap-6 md:grid-cols-2">
        {cultureTiles.map(([title, text]) => <div className="glass rounded-lg p-8" key={title}><h2 className="font-display text-3xl font-bold">{title}</h2><p className="mt-3 text-slate-600 dark:text-slate-300">{text}</p></div>)}
      </div>
      <div className="mt-10 glass rounded-lg p-6">
        <h2 className="font-display text-3xl font-bold">Interactive Timeline</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {['Indus Valley', 'Classical Age', 'Medieval Kingdoms', 'Modern India'].map(item => <div className="rounded-lg bg-white p-4 dark:bg-slate-900" key={item}>{item}</div>)}
        </div>
      </div>
    </section>
  );
}
