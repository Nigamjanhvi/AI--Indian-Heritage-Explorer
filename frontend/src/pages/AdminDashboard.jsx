import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../api/axios.js';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [site, setSite] = useState({ name: '', state: '', category: '', description: '', unescoStatus: false });

  useEffect(() => {
    api.get('/users/admin/stats').then(({ data }) => setStats(data));
  }, []);

  async function createSite(e) {
    e.preventDefault();
    await api.post('/sites/create', site, { headers: { 'Content-Type': 'multipart/form-data' } });
    alert('Site created');
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Admin Dashboard</h1>
      <div className="my-6 grid gap-4 md:grid-cols-3">
        <div className="glass rounded-lg p-5"><p>Total Users</p><strong className="text-3xl">{stats?.totalUsers || 0}</strong></div>
        <div className="glass rounded-lg p-5"><p>Total Heritage Sites</p><strong className="text-3xl">{stats?.totalHeritageSites || 0}</strong></div>
        <div className="glass rounded-lg p-5"><p>Total Reviews</p><strong className="text-3xl">{stats?.totalReviews || 0}</strong></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-lg p-5">
          <h2 className="mb-4 font-display text-2xl font-bold">Category Analytics</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categories || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <form onSubmit={createSite} className="glass space-y-3 rounded-lg p-5">
          <h2 className="font-display text-2xl font-bold">Add Heritage Site</h2>
          <input className="input" placeholder="Name" onChange={e => setSite({ ...site, name: e.target.value })} />
          <input className="input" placeholder="State" onChange={e => setSite({ ...site, state: e.target.value })} />
          <input className="input" placeholder="Category" onChange={e => setSite({ ...site, category: e.target.value })} />
          <textarea className="input" placeholder="Description" onChange={e => setSite({ ...site, description: e.target.value })} />
          <label className="flex gap-2"><input type="checkbox" onChange={e => setSite({ ...site, unescoStatus: e.target.checked })} /> UNESCO Status</label>
          <button className="btn-primary w-full">Create Site</button>
        </form>
      </div>
    </section>
  );
}
