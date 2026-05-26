import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Check, ChevronLeft, ChevronRight, Loader2, MapPin, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import api from '../api/axios.js';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh'
];

const citySuggestions = ['Jaipur', 'Udaipur', 'Delhi', 'Agra', 'Varanasi', 'Kochi', 'Mysore', 'Hampi', 'Srinagar', 'Goa', 'Madurai', 'Amritsar'];
const companionOptions = ['Solo', 'Friends', 'Family', 'Partner', 'Kids', 'Senior Citizens'];
const budgetOptions = ['Budget', 'Comfort', 'Luxury', 'Premium'];
const occasionOptions = ['Vacation', 'Weekend Getaway', 'Honeymoon', 'Anniversary', 'Pilgrimage', 'Birthday', 'Workation', 'Festival Visit'];
const moodOptions = ['Adventure', 'Relaxation', 'History', 'Culture', 'Nature', 'Food', 'Photography', 'Spiritual', 'Luxury'];
const weatherOptions = ['Pleasant', 'Cold', 'Snow', 'Warm', 'Rainy', 'No Preference'];

function differenceInDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return Number.isFinite(diff) && diff > 0 ? diff : 0;
}

function splitDays(text) {
  if (!text) return [];
  return text.split(/(?=Day\s+\d+|DAY\s+\d+)/g).map(item => item.trim()).filter(Boolean);
}

function OptionButton({ selected, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-5 py-4 text-left font-semibold transition ${selected ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm dark:bg-orange-500/10 dark:text-orange-200' : 'border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800'}`}
    >
      {children}
    </button>
  );
}

const destinationMapping = {
  jaipur: {
    title: 'Jaipur',
    image: 'https://images.unsplash.com/photo-1541074694107-0c6f7d1f134b?auto=format&fit=crop&w=1200&q=80',
    summary: 'Jaipur is Rajasthan’s iconic Pink City, rich in royal forts, palaces, lively bazaars and heritage hotels.',
    bestTime: 'October to March',
    topAttractions: ['Amber Fort', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort', 'Hawa Mahal'],
    foods: ['Dal Baati Churma', 'Ghewar', 'Laal Maas'],
    markets: ['Johari Bazaar', 'Bapu Bazaar']
  },
  rajasthan: {
    title: 'Rajasthan',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    summary: 'Rajasthan is a royal heritage route of forts, palaces, desert camps and ornate bazaars.',
    bestTime: 'October to March',
    topAttractions: ['Amber Fort', 'Mehrangarh Fort', 'Udaipur City Palace', 'Jaisalmer Fort', 'Chittorgarh Fort'],
    foods: ['Dal Baati Churma', 'Ghewar', 'Laal Maas'],
    markets: ['Johari Bazaar', 'Sadar Bazaar']
  }
};

function getDestinationDetails(destination, city, state) {
  const key = (city || state || destination || '').toLowerCase();
  return destinationMapping[key] || {
    title: destination || 'India',
    image: 'https://images.unsplash.com/photo-1562158070-7ef389ea01a1?auto=format&fit=crop&w=1200&q=80',
    summary: `A premium India travel route with real heritage stops, local food and seasonal planning.`,
    bestTime: 'Depends on the season and region',
    topAttractions: ['Iconic monuments', 'Local markets', 'Cultural experiences'],
    foods: ['Regional specialties', 'Street snacks', 'Desserts'],
    markets: ['Local bazaar', 'Artisan market']
  };
}

function parseKeyLine(text, patterns) {
  if (!text) return '';
  const lines = text.replace(/\r/g, '').split('\n');
  for (const line of lines) {
    const normalized = line.trim();
    for (const pattern of patterns) {
      const regex = new RegExp(`${pattern}[:\\-]\\s*(.*)`, 'i');
      const match = normalized.match(regex);
      if (match?.[1]) return match[1].trim();
    }
  }
  return '';
}

function pullHighlights(text, limit = 3) {
  if (!text) return [];
  const chunks = text.split(/\n|·|•|\-|—/).map(item => item.trim()).filter(item => item && item.length > 20);
  return chunks.slice(0, limit);
}

export default function AiPlanner() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [showItinerary, setShowItinerary] = useState(false);
  const [form, setForm] = useState({
    destinationType: '',
    state: '',
    city: '',
    startDate: '',
    endDate: '',
    companion: '',
    budget: '',
    occasion: '',
    moods: [],
    weather: '',
    requirements: ''
  });

  const duration = differenceInDays(form.startDate, form.endDate);
  const destination = form.destinationType === 'Specific State'
    ? form.state
    : form.destinationType === 'Specific City'
      ? form.city
      : 'Anywhere in India';

  const steps = useMemo(() => [
    'Destination',
    'Dates',
    'Travel Style',
    'Extra Preferences'
  ], []);

  const canContinue = [
    form.destinationType && (form.destinationType === 'Anywhere in India' || form.state || form.city),
    form.startDate && form.endDate && duration > 0,
    form.companion && form.budget && form.moods.length > 0,
    form.weather !== ''
  ][step];

  function toggleMood(mood) {
    setForm(current => ({
      ...current,
      moods: current.moods.includes(mood) ? current.moods.filter(item => item !== mood) : [...current.moods, mood]
    }));
  }

  async function generateTrip() {
    setLoading(true);
    setResult('');
    setShowItinerary(false);

    try {
      const { data } = await api.post('/ai/itinerary', {
        destination,
        destinationType: form.destinationType,
        state: form.state,
        city: form.city,
        days: duration || 3,
        budget: form.budget.toLowerCase(),
        interests: form.moods.map(item => item.toLowerCase()),
        companion: form.companion,
        occasion: form.occasion,
        season: `${form.startDate} to ${form.endDate}`,
        weather: form.weather,
        specialRequirements: form.requirements
      });
      setResult(data.response || data.reply || data.answer || 'Unable to generate a trip right now. Please try again.');
    } catch {
      setResult('Unable to connect to AI service. Please check the backend and try again.');
    } finally {
      setLoading(false);
    }
  }

  const destinationInfo = getDestinationDetails(destination, form.city, form.state);
  const whySelected = parseKeyLine(result, ['Why', 'Why choose', 'Why AI selected', 'Recommended because']);
  const bestTime = parseKeyLine(result, ['Best time', 'Best Time', 'When to visit', 'Ideal time']);
  const quickFacts = [
    `Duration: ${duration || 3} days`,
    `Budget: ${form.budget || 'Comfort'} style`,
    `Weather: ${form.weather || 'Flexible'}`,
    `Travelers: ${form.companion || 'Mixed group'}`
  ];
  const topHighlights = pullHighlights(result, 3);
  const itineraryDays = splitDays(result);
  const insightText = parseKeyLine(result, ['Travel Tips', 'Tip', 'Suggestions', 'Safety', 'Packing']) || `Open the insights accordion for packing notes, local cues and practical travel advice for ${destinationInfo.title}.`;

  return (
    <div className="bg-[#f8f3ea] pb-20 dark:bg-slate-950">
      <section className="relative overflow-hidden bg-slate-950">
        <img className="absolute inset-0 h-full w-full object-cover opacity-60" src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1800&q=80" alt="India travel" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60" />
        <div className="relative mx-auto max-w-5xl px-4 py-12 text-white md:py-16">
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            <Sparkles size={16} /> AI Trip Planner
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="font-display text-4xl font-black leading-tight md:text-5xl">
            Plan Your Perfect India Journey
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mt-4 max-w-2xl text-base leading-8 text-slate-200 md:text-lg">
            Fill in just four quick planning moments and get a compact premium itinerary designed for real monuments, authentic food and better local guidance.
          </motion.p>
          <button
            type="button"
            onClick={() => document.getElementById('ai-planner-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary mt-8 rounded-full px-8 py-3 text-base"
          >
            Start planning
          </button>
        </div>
      </section>

      <section id="ai-planner-section" className="mx-auto mt-8 max-w-[1100px] px-4">
        <div className="relative z-10 rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900 md:p-8">
          <div className="mb-6 grid gap-3 md:grid-cols-4">
            {steps.map((label, index) => (
              <button
                key={label}
                type="button"
                className={`rounded-2xl px-4 py-3 text-left text-sm transition ${index === step ? 'bg-saffron text-white' : index < step ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                onClick={() => index <= step && setStep(index)}
              >
                <span className="mb-2 inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-white/20 text-xs font-semibold">{index + 1}</span>
                <div className="font-semibold">{label}</div>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
              className="min-h-[300px]"
            >
              {step === 0 && (
                <div>
                  <h2 className="font-display text-3xl font-bold">Where do you want to travel?</h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">Choose anywhere in India or lock in a state or city.</p>
                  <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {['Anywhere in India', 'Specific State', 'Specific City'].map(option => (
                      <OptionButton
                        key={option}
                        selected={form.destinationType === option}
                        onClick={() => setForm({ ...form, destinationType: option, state: option !== 'Specific State' ? '' : form.state, city: option !== 'Specific City' ? '' : form.city })}
                      >
                        {option}
                      </OptionButton>
                    ))}
                  </div>
                  {form.destinationType === 'Specific State' && (
                    <select className="input mt-5 w-full" value={form.state} onChange={event => setForm({ ...form, state: event.target.value })}>
                      <option value="">Select State</option>
                      {indianStates.map(state => <option value={state} key={state}>{state}</option>)}
                    </select>
                  )}
                  {form.destinationType === 'Specific City' && (
                    <div className="mt-5 space-y-4">
                      <input className="input w-full" value={form.city} onChange={event => setForm({ ...form, city: event.target.value })} placeholder="Enter city" />
                      <div className="flex flex-wrap gap-2">
                        {citySuggestions.slice(0, 8).map(city => (
                          <button
                            type="button"
                            key={city}
                            onClick={() => setForm({ ...form, city })}
                            className="rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-3xl font-bold">Travel Dates</h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-300">Pick the starting and ending travel days.</p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <label className="space-y-2">
                      <span className="font-semibold">Start Date</span>
                      <input className="input w-full" type="date" value={form.startDate} onChange={event => setForm({ ...form, startDate: event.target.value })} />
                    </label>
                    <label className="space-y-2">
                      <span className="font-semibold">End Date</span>
                      <input className="input w-full" type="date" value={form.endDate} onChange={event => setForm({ ...form, endDate: event.target.value })} />
                    </label>
                  </div>
                  {duration > 0 && (
                    <div className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
                      <CalendarDays size={18} /> Trip duration: {duration} {duration === 1 ? 'day' : 'days'}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-3xl font-bold">Travel Style</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Who you are traveling with, your budget and the mood you want.</p>
                  </div>
                  <StepOptions title="Traveling with" options={companionOptions} value={form.companion} onPick={value => setForm({ ...form, companion: value })} />
                  <StepOptions title="Budget" options={budgetOptions} value={form.budget} onPick={value => setForm({ ...form, budget: value })} />
                  <div>
                    <h2 className="font-display text-2xl font-bold">Mood</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Pick the main tone for your journey.</p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {moodOptions.map(mood => (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => toggleMood(mood)}
                          className={`${form.moods.includes(mood) ? 'btn-primary rounded-full' : 'btn-secondary rounded-full'} text-sm px-4 py-2`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="font-display text-3xl font-bold">Extra Preferences</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Choose weather and add anything special.</p>
                  </div>
                  <StepOptions title="Weather preference" options={weatherOptions} value={form.weather} onPick={value => setForm({ ...form, weather: value })} />
                  <div>
                    <h2 className="font-display text-2xl font-bold">Special requirements</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-300">Examples: wheelchair access, kid friendly, vegetarian food, avoid crowded places.</p>
                    <textarea className="input mt-4 min-h-[140px] w-full" value={form.requirements} onChange={event => setForm({ ...form, requirements: event.target.value })} placeholder="Tell AI anything important..." />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-orange-100 pt-5 dark:border-slate-800">
            <button className="btn-secondary rounded-full" disabled={step === 0} onClick={() => setStep(step - 1)}><ChevronLeft size={18} /> Back</button>
            {step < steps.length - 1 ? (
              <button className="btn-primary rounded-full" disabled={!canContinue} onClick={() => setStep(step + 1)}>Continue <ChevronRight size={18} /></button>
            ) : (
              <button className="btn-primary rounded-full px-8 py-3 text-base" onClick={generateTrip} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />} Create My Perfect Journey
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 py-12">
        {loading && (
          <div className="rounded-3xl bg-white p-8 shadow-sm dark:bg-slate-900">
            <div className="h-8 w-64 animate-pulse rounded bg-orange-100" />
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map(item => <div key={item} className="h-48 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />)}
            </div>
          </div>
        )}

        {!loading && result && (
          <div className="space-y-8">
            <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900">
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-orange-600 font-semibold">Recommended Destination</p>
                  <h2 className="mt-3 text-4xl font-display font-black">{destinationInfo.title}</h2>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{destinationInfo.summary}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {quickFacts.map(item => (
                      <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item}</div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">3 main highlights</p>
                    <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-300">
                      {topHighlights.length > 0 ? topHighlights.map((highlight, index) => (
                        <div key={`${highlight}-${index}`} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">{highlight}</div>
                      )) : (
                        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">{`A premium itinerary with heritage sites, local food and seasonal timing.`}</div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Top attractions</p>
                    <ul className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-300">
                      {destinationInfo.topAttractions.map(attraction => (
                        <li key={attraction} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950">{attraction}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-100 dark:border-slate-800 dark:bg-slate-800">
                  <img src={destinationInfo.image} alt={`${destinationInfo.title} travel`} className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Why the AI selected it</p>
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">{whySelected || `A tailored heritage route for ${destinationInfo.title} with history, local food and seasonal timing.`}</p>
                  <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">Best time: {bestTime || destinationInfo.bestTime}</p>
                </div>
                <button type="button" className="btn-primary rounded-full px-6 py-3 text-sm" onClick={() => setShowItinerary(true)}>
                  Open detailed itinerary
                </button>
              </div>
            </div>

            {showItinerary && (
              <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h3 className="font-display text-3xl font-bold">Detailed itinerary</h3>
                <div className="mt-6 space-y-4">
                  {(itineraryDays.length > 1 ? itineraryDays : [result]).map((day, index) => (
                    <div key={`${index}-${day}`} className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Day {index + 1}</p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700 dark:text-slate-300">{day.replace(/^Day\s+\d+[:\-\s]*/i, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <details className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer text-sm font-semibold text-slate-800 dark:text-slate-200">More Travel Insights</summary>
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>{insightText}</p>
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Local food to try</p>
                  <ul className="list-disc space-y-2 pl-5">
                    {destinationInfo.foods.map(food => <li key={food}>{food}</li>)}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Market recommendations</p>
                  <ul className="list-disc space-y-2 pl-5">
                    {destinationInfo.markets.map(market => <li key={market}>{market}</li>)}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        )}
      </section>
    </div>
  );
}

function StepOptions({ title, options, value, onPick }) {
  return (
    <div>
      <h2 className="font-display text-4xl font-bold">{title}</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {options.map(option => <OptionButton selected={value === option} onClick={() => onPick(option)} key={option}>{option}</OptionButton>)}
      </div>
    </div>
  );
}

