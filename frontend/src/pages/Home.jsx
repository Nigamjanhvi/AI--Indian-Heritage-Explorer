import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Camera,
  Clock,
  Compass,
  Heart,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Star,
  X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const fallbackImage = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80';

const stats = [
  ['42', 'UNESCO Sites'],
  ['500+', 'Heritage Places'],
  ['28', 'States'],
  ['1000+', 'Cultural Stories']
];

const collections = [
  ['UNESCO Wonders', 'World heritage landmarks shaped by empire, devotion, craft and ecology.', 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80'],
  ['Temple Trails', 'Sacred architecture, pilgrimage towns and carved stone journeys across centuries.', 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80'],
  ['Royal Forts', 'Hill forts, desert citadels and palace complexes built for power and spectacle.', 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80'],
  ['Spiritual India', 'River ghats, monasteries, shrines and rituals that continue every day.', 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&w=900&q=80'],
  ['Hidden Heritage', 'Quiet stepwells, village crafts, old quarters and places beyond the usual route.', 'https://images.unsplash.com/photo-1627894006066-b45797c5b9d3?auto=format&fit=crop&w=900&q=80'],
  ['Festival Routes', 'Seasonal journeys through color, music, food, processions and local memory.', 'https://images.unsplash.com/photo-1601655862666-5b393b95f771?auto=format&fit=crop&w=900&q=80']
];

const regions = [
  ['North India', 'Delhi, Rajasthan, Uttar Pradesh, Himachal', 'Mughal cities, Himalayan shrines and royal forts', '30%', '24%'],
  ['South India', 'Tamil Nadu, Kerala, Karnataka, Telangana', 'Temple towns, coastal culture and classical art', '48%', '70%'],
  ['East India', 'Odisha, Bengal, Bihar, Jharkhand', 'Sun temples, Buddhist routes and river cultures', '68%', '50%'],
  ['West India', 'Gujarat, Maharashtra, Goa, Rajasthan', 'Caves, stepwells, ports and desert kingdoms', '22%', '55%'],
  ['North-East India', 'Assam, Meghalaya, Nagaland, Sikkim', 'Living root bridges, monasteries and forest heritage', '78%', '28%']
];

const highlights = [
  {
    name: 'Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=900&q=80',
    facts: ['Mughal marble mausoleum', 'Best at sunrise', 'UNESCO since 1983'],
    history: 'A 17th-century monument to love, symmetry and luminous marble craftsmanship.',
    architecture: 'Persian charbagh planning, pietra dura inlay, onion dome and balanced minarets.',
    timings: 'Sunrise to sunset, closed Fridays',
    bestTime: 'October to March',
    nearby: 'Agra Fort, Mehtab Bagh, Fatehpur Sikri',
    food: 'Agra petha, Mughlai kebabs, bedai with sabzi'
  },
  {
    name: 'Hampi',
    location: 'Karnataka',
    image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=900&q=80',
    facts: ['Vijayanagara capital', 'Boulder landscape', 'UNESCO since 1986'],
    history: 'A vast ruin field where markets, temples and royal enclosures still map an imperial city.',
    architecture: 'Granite mandapas, musical pillars, chariot shrines and fortified ceremonial axes.',
    timings: 'Most monuments open 6 AM to 6 PM',
    bestTime: 'November to February',
    nearby: 'Virupaksha Temple, Vittala Temple, Lotus Mahal',
    food: 'Jolada rotti, filter coffee, banana leaf meals'
  },
  {
    name: 'Qutub Minar',
    location: 'Delhi',
    image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=80',
    facts: ['72.5 m minaret', 'Delhi Sultanate', 'UNESCO since 1993'],
    history: 'A layered complex marking early Indo-Islamic architecture in Delhi.',
    architecture: 'Red sandstone fluting, Quranic calligraphy and reused temple spolia.',
    timings: '7 AM to 5 PM',
    bestTime: 'October to March',
    nearby: 'Mehrauli Archaeological Park, Alai Darwaza',
    food: 'Parathas, kebabs, chaat in old Delhi'
  },
  {
    name: 'Konark Sun Temple',
    location: 'Odisha',
    image: 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=900&q=80',
    facts: ['Stone chariot temple', '13th century', 'UNESCO since 1984'],
    history: 'A monumental ode to Surya, imagined as a celestial chariot by the sea.',
    architecture: 'Carved wheels, horses, dancers, guardians and Kalinga temple geometry.',
    timings: '6 AM to 8 PM',
    bestTime: 'November to February',
    nearby: 'Puri, Chandrabhaga Beach, Raghurajpur',
    food: 'Dalma, chhena poda, temple mahaprasad'
  },
  {
    name: 'Ajanta Caves',
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1627301517152-11505d049286?auto=format&fit=crop&w=900&q=80',
    facts: ['Buddhist cave art', '2nd c. BCE onward', 'UNESCO since 1983'],
    history: 'Rock-cut monasteries preserving some of India’s most important ancient paintings.',
    architecture: 'Chaitya halls, vihara cells, murals, sculpted Buddhas and horseshoe cave plans.',
    timings: '9 AM to 5:30 PM, closed Mondays',
    bestTime: 'June to March',
    nearby: 'Ellora Caves, Aurangabad, Bibi Ka Maqbara',
    food: 'Maharashtrian thali, bhakri, misal'
  },
  {
    name: 'Ellora Caves',
    location: 'Maharashtra',
    image: 'https://images.unsplash.com/photo-1668865245254-9f4870b6d7d6?auto=format&fit=crop&w=900&q=80',
    facts: ['Buddhist, Hindu, Jain caves', 'Kailasa temple', 'UNESCO since 1983'],
    history: 'A rare complex where multiple faith traditions share a single basalt escarpment.',
    architecture: 'Monolithic excavation, sculptural panels and dramatic court-like cave volumes.',
    timings: '6 AM to 6 PM, closed Tuesdays',
    bestTime: 'October to March',
    nearby: 'Daulatabad Fort, Grishneshwar Temple',
    food: 'Naan qalia, paan, local thali'
  },
  {
    name: 'Kaziranga',
    location: 'Assam',
    image: 'https://images.unsplash.com/photo-1623492701902-47dc207df5dc?auto=format&fit=crop&w=900&q=80',
    facts: ['Rhino habitat', 'Floodplain ecology', 'UNESCO since 1985'],
    history: 'A living natural heritage landscape shaped by the Brahmaputra floodplain.',
    architecture: 'Grasslands, wetlands and forest corridors replace stone with ecological design.',
    timings: 'Safari season usually November to April',
    bestTime: 'February to April',
    nearby: 'Majuli, Tezpur, Kakochang Waterfalls',
    food: 'Assamese thali, tenga, pitha'
  }
];

const categories = ['Temples', 'Monuments', 'Forts', 'Palaces', 'Museums', 'Festivals', 'Food Heritage', 'Art & Crafts'];
const experiences = ['Food Trails', 'Classical Dance', 'Local Markets', 'Handicrafts', 'Traditional Music', 'Pilgrimage Routes'];
const recommendations = [
  ['Because you liked temples...', 'Follow the Chola bronze and granite trail through Thanjavur, Gangaikonda Cholapuram and Darasuram.'],
  ['Because you saved Rajasthan...', 'Pair Jaipur’s planned city with Amer Fort, Abhaneri stepwell and a craft walk in old bazaars.'],
  ['Because you explored UNESCO sites...', 'Try a western loop through Ajanta, Ellora, Elephanta and Mumbai’s Victorian Gothic ensemble.']
];

function ImageWithFallback({ src, alt, className }) {
  const [imgSrc, setImgSrc] = useState(src);
  return <img src={imgSrc} alt={alt} className={className} loading="lazy" onError={() => setImgSrc(fallbackImage)} />;
}

function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-7 max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-700">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-bold text-[#101b33] md:text-5xl dark:text-white">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </div>
  );
}

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeRegion, setActiveRegion] = useState(regions[0]);
  const [selected, setSelected] = useState(null);
  const story = useMemo(() => highlights[Math.floor(Math.random() * highlights.length)], []);

  return (
    <div className="heritage-home bg-[#fbf4e8] text-slate-950 dark:bg-[#07111f]">
      <div className="fixed right-4 top-24 z-30 flex items-center justify-end gap-2">
        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="rounded-full border border-white/50 bg-white/95 px-4 py-3 text-sm shadow-2xl outline-none ring-orange-300 transition focus:ring-4 dark:bg-slate-950"
              placeholder="Search heritage, cities, stories..."
              autoFocus
            />
          )}
        </AnimatePresence>
        <button className="grid h-12 w-12 place-items-center rounded-full bg-[#0b1730] text-white shadow-2xl transition hover:bg-orange-600" onClick={() => setSearchOpen(v => !v)} aria-label="Open compact search">
          {searchOpen ? <X size={19} /> : <Search size={19} />}
        </button>
      </div>

      <section className="relative min-h-[92vh] overflow-hidden bg-[#07111f]">
        <div className="absolute inset-0 bg-cover bg-center will-change-transform heritage-parallax" style={{ backgroundImage: "url('/Images/wallpaper.jpg'), url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06101f]/95 via-[#06101f]/65 to-[#06101f]/30" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#fbf4e8] to-transparent dark:from-[#07111f]" />
        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 pb-20 pt-24 text-white">
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur">
            <Sparkles size={16} /> Explore India&apos;s heritage
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="hero-text max-w-5xl font-display text-5xl font-bold leading-[1.02] md:text-7xl">
            Discover India&apos;s Living Heritage
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-6 max-w-3xl text-lg leading-8 text-slate-100 md:text-xl">
            Explore UNESCO sites, ancient temples, forts, festivals, cultural routes, local stories and hidden gems across India.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mt-8 flex flex-wrap gap-3">
            <Link to="/explore" className="btn-primary rounded-full px-6 py-3">Explore Heritage <ArrowRight size={18} /></Link>
            <Link to="/ai" className="btn-secondary rounded-full border-white/30 bg-white/10 px-6 py-3 text-white hover:bg-white/20"><Bot size={18} /> Start AI Journey</Link>
          </motion.div>
          <div className="mt-12 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map(([value, label]) => (
              <motion.div whileHover={{ y: -6 }} className="rounded-lg border border-white/20 bg-white/10 p-5 text-center backdrop-blur" key={label}>
                <p className="font-display text-4xl font-bold text-[#ffd36b]">{value}</p>
                <p className="text-sm text-slate-100">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionTitle eyebrow="Featured collections" title="Curated routes into culture" subtitle="Start with a mood, a region or a story, then go deeper." />
        <div className="flex gap-5 overflow-x-auto pb-4">
          {collections.map(([title, description, image]) => (
            <motion.article whileHover={{ y: -6 }} className="min-w-[320px] max-w-[320px] overflow-hidden rounded-lg bg-white shadow-lg dark:bg-slate-900" key={title}>
              <ImageWithFallback src={image} alt={title} className="aspect-video w-full object-cover" />
              <div className="p-4">
                <h3 className="font-display text-2xl font-bold">{title}</h3>
                <p className="mt-2 min-h-12 text-sm text-slate-600 dark:text-slate-300">{description}</p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-orange-700">Explore <ArrowRight size={16} /></button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="bg-[#101b33] py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <SectionTitle eyebrow="Explore by region" title="Choose a cultural landscape" subtitle="Hover or tap a region to preview its routes." />
            <div className="relative mx-auto aspect-[4/5] max-w-md rounded-[44%_56%_50%_50%] border border-[#d5a642]/40 bg-[#f4d58d]/10 p-6">
              {regions.map(region => (
                <button
                  key={region[0]}
                  onMouseEnter={() => setActiveRegion(region)}
                  onClick={() => setActiveRegion(region)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2 text-sm font-bold shadow-xl transition ${activeRegion[0] === region[0] ? 'border-[#ffd36b] bg-[#ffd36b] text-[#101b33]' : 'border-white/25 bg-white/10 text-white hover:bg-white/20'}`}
                  style={{ left: region[3], top: region[4] }}
                >
                  {region[0].replace(' India', '')}
                </button>
              ))}
            </div>
          </div>
          <motion.div key={activeRegion[0]} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="self-center rounded-lg border border-white/10 bg-white/10 p-8 backdrop-blur">
            <Compass className="mb-5 text-[#ffd36b]" size={34} />
            <h3 className="font-display text-4xl font-bold">{activeRegion[0]}</h3>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#ffd36b]">{activeRegion[1]}</p>
            <p className="mt-5 text-lg leading-8 text-slate-100">{activeRegion[2]}</p>
            <Link to="/map" className="btn-primary mt-6 rounded-full">Open Map <Navigation size={17} /></Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionTitle eyebrow="UNESCO highlights" title="Small windows into world heritage" subtitle="Compact cards with quick facts. Open one for the full story." />
        <div className="flex snap-x gap-5 overflow-x-auto pb-4">
          {highlights.map(site => (
            <motion.button whileHover={{ y: -6 }} onClick={() => setSelected(site)} className="min-w-[320px] max-w-[320px] snap-start overflow-hidden rounded-lg bg-white text-left shadow-lg dark:bg-slate-900" key={site.name}>
              <ImageWithFallback src={site.image} alt={site.name} className="aspect-video w-full object-cover" />
              <div className="p-4">
                <h3 className="font-display text-2xl font-bold">{site.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300"><MapPin size={15} /> {site.location}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {site.facts.map(fact => <span className="rounded-full bg-[#fff2cf] px-2 py-1 text-xs font-semibold text-[#7c4a03]" key={fact}>{fact}</span>)}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <SectionTitle eyebrow="Heritage categories" title="Explore by what moves you" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div whileHover={{ y: -4 }} className="rounded-lg border border-[#ead7b3] bg-[#fffaf0] p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" key={category}>
              <Star className="mb-4 text-orange-600" size={20 + (index % 3) * 2} />
              <h3 className="font-display text-2xl font-bold">{category}</h3>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 lg:grid-cols-[1.1fr_.9fr]">
        <ImageWithFallback src={story.image} alt={story.name} className="min-h-[360px] w-full rounded-lg object-cover shadow-2xl" />
        <div className="self-center">
          <SectionTitle eyebrow="Today's heritage story" title={story.name} subtitle={story.history} />
          <p className="text-slate-600 dark:text-slate-300">{story.architecture}</p>
          <button onClick={() => setSelected(story)} className="btn-primary mt-6 rounded-full">Read More <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="bg-[#fff8ea] py-14 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4">
          <SectionTitle eyebrow="Cultural experiences" title="Go beyond monuments" subtitle="Food, performance, craft and spiritual routes create the living part of heritage." />
          <div className="grid gap-4 md:grid-cols-3">
            {experiences.map((item, index) => (
              <motion.article whileHover={{ y: -5 }} className="rounded-lg bg-white p-5 shadow-md dark:bg-slate-900" key={item}>
                {[Camera, Sparkles, MapPin, Heart, Star, Compass].map((Icon, i) => i === index && <Icon key={item} className="mb-4 text-orange-600" />)}
                <h3 className="font-display text-2xl font-bold">{item}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Discover local experts, routes and stories connected to {item.toLowerCase()}.</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-lg bg-[#101b33] p-8 text-white shadow-2xl md:p-10">
          <SectionTitle eyebrow="AI recommendations" title="Personal trails, gently suggested" subtitle="Based on user interests and saved places." />
          <div className="grid gap-4 md:grid-cols-3">
            {recommendations.map(([title, text]) => (
              <div className="rounded-lg border border-white/10 bg-white/10 p-5" key={title}>
                <Bot className="mb-4 text-[#ffd36b]" />
                <h3 className="font-display text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-slate-200">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.article initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-lg bg-[#fffaf0] shadow-2xl dark:bg-slate-950">
              <div className="relative">
                <ImageWithFallback src={selected.image} alt={selected.name} className="h-80 w-full object-cover" />
                <button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white" onClick={() => setSelected(null)} aria-label="Close detail modal"><X size={20} /></button>
              </div>
              <div className="grid gap-7 p-6 lg:grid-cols-[1.1fr_.9fr]">
                <div>
                  <h2 className="font-display text-4xl font-bold">{selected.name}</h2>
                  <p className="mt-2 flex items-center gap-2 text-slate-600 dark:text-slate-300"><MapPin size={17} /> {selected.location}</p>
                  <h3 className="mt-6 font-display text-2xl font-bold">History</h3>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">{selected.history}</p>
                  <h3 className="mt-5 font-display text-2xl font-bold">Architecture</h3>
                  <p className="mt-2 text-slate-700 dark:text-slate-300">{selected.architecture}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="btn-primary rounded-full"><Heart size={17} /> Save</button>
                    <Link to="/ai" className="btn-secondary rounded-full"><Bot size={17} /> AI Ask</Link>
                    <a className="btn-secondary rounded-full" href={`https://www.google.com/maps/search/${encodeURIComponent(selected.name + ' ' + selected.location)}`} target="_blank" rel="noreferrer">Google Maps</a>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    ['Timings', selected.timings, Clock],
                    ['Best Time To Visit', selected.bestTime, Sparkles],
                    ['Nearby Attractions', selected.nearby, MapPin],
                    ['Food To Try', selected.food, Star],
                    ['Photo Gallery', 'Curated monument, detail and landscape views.', Camera]
                  ].map(([label, value, Icon]) => (
                    <div className="rounded-lg border border-[#ead7b3] bg-white p-4 dark:border-slate-800 dark:bg-slate-900" key={label}>
                      <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-orange-700"><Icon size={16} /> {label}</p>
                      <p className="mt-2 text-slate-700 dark:text-slate-300">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
