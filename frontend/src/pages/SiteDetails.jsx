import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { featuredSites } from '../data/heritageData.js';

export default function SiteDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  async function load() {
    try {
      const res = await api.get(`/sites/getbyid/${id}`);
      setData(res.data);
    } catch {
      const site = featuredSites.find(item => item._id === id) || featuredSites[0];
      setData({ site: { ...site, images: [site.image], history: site.description, architecture: 'Layered regional craft, symbolic geometry and climate-aware design define this heritage experience.', timings: 'Sunrise to sunset', bestTimeToVisit: 'October to March' }, reviews: [], averageRating: site.rating });
    }
  }

  useEffect(() => { load(); }, [id]);

  async function submitReview(e) {
    e.preventDefault();
    await api.post('/reviews', { ...review, site: id });
    setReview({ rating: 5, comment: '' });
    load();
  }

  if (!data) return <p className="p-8">Loading...</p>;
  const { site, reviews, averageRating } = data;

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
        <div>
          <img className="h-[420px] w-full rounded-lg object-cover" src={site.images?.[0] || 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'} alt={site.name} />
          <h1 className="mt-6 font-display text-5xl font-bold">{site.name}</h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{site.city ? `${site.city}, ` : ''}{site.state} | {site.category} | Rating {averageRating}/5</p>
          <p className="mt-6 leading-8">{site.description}</p>
          {site.history && <p className="mt-4 leading-8">{site.history}</p>}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="glass rounded-lg p-5"><h2 className="font-display text-2xl font-bold">Architecture</h2><p className="mt-2 text-slate-600 dark:text-slate-300">{site.architecture || 'A layered architectural story shaped by region, material, patronage and ritual.'}</p></div>
            <div className="glass rounded-lg p-5"><h2 className="font-display text-2xl font-bold">Virtual Tour</h2><p className="mt-2 text-slate-600 dark:text-slate-300">Immersive galleries and 360 tour links can be connected here for production content.</p></div>
          </div>
        </div>
        <aside className="space-y-4">
          <div className="glass rounded-lg p-5">
            <h2 className="font-display text-2xl font-bold">Travel Info</h2>
            <p>Best time: {site.bestTimeToVisit || 'Year round'}</p>
            <p>Timings: {site.timings || 'Check locally'}</p>
            <p>Entry fee: {site.entryFee || 'Varies'}</p>
            {site.unescoStatus && <p className="font-semibold text-yellow-600">UNESCO World Heritage Site</p>}
          </div>
          <div className="glass rounded-lg p-5">
            <h2 className="font-display text-2xl font-bold">AI Summary</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{site.aiSummary || 'This place is recommended for travelers interested in culture, architecture, photography and historically rich routes.'}</p>
          </div>
          {user && (
            <form onSubmit={submitReview} className="glass space-y-3 rounded-lg p-5">
              <h2 className="font-display text-2xl font-bold">Add Review</h2>
              <select className="input" value={review.rating} onChange={e => setReview({ ...review, rating: Number(e.target.value) })}>{[5, 4, 3, 2, 1].map(v => <option key={v}>{v}</option>)}</select>
              <textarea className="input" placeholder="Share your experience" value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} />
              <button className="btn-primary w-full">Submit Review</button>
            </form>
          )}
          <div className="space-y-3">
            {reviews.map(item => (
              <div className="card p-4" key={item._id}>
                <p className="font-semibold">{item.user?.name} rated {item.rating}/5</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{item.comment}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
