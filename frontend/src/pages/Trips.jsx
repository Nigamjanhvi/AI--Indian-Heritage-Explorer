import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({ title: '', notes: '' });

  async function load() {
    const { data } = await api.get('/trips');
    setTrips(data.trips);
  }
  useEffect(() => { load(); }, []);

  async function create(e) {
    e.preventDefault();
    await api.post('/trips', { ...form, itinerary: [{ day: 1, title: 'Arrival', notes: form.notes, locations: [] }] });
    setForm({ title: '', notes: '' });
    load();
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Trip Planner</h1>
      <form onSubmit={create} className="glass my-6 grid gap-3 rounded-lg p-4 md:grid-cols-[1fr_2fr_auto]">
        <input className="input" placeholder="Trip title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input className="input" placeholder="Itinerary notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
        <button className="btn-primary">Create Trip</button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {trips.map(trip => (
          <article className="card p-5" key={trip._id}>
            <h2 className="font-display text-2xl font-bold">{trip.title}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{trip.notes}</p>
            <div className="mt-4 space-y-2">
              {trip.itinerary?.map(day => <p key={day.day} className="rounded-md bg-slate-100 p-2 dark:bg-slate-800">Day {day.day}: {day.title} {day.notes}</p>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
