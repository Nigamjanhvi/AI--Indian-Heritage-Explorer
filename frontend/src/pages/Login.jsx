import { Eye, Github, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-slate-950 lg:block">
        <img className="absolute inset-0 h-full w-full object-cover opacity-60" src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80" alt="Indian heritage" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="font-display text-4xl font-bold">“Travel is the archive we walk through.”</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-200">
            <span>AI itineraries and hidden gems</span>
            <span>Saved collections and trip planning</span>
            <span>UNESCO, temples, monuments and culture</span>
          </div>
        </div>
      </aside>
      <section className="flex items-center justify-center px-4 py-12">
        <form onSubmit={submit} className="glass w-full max-w-md space-y-4 rounded-xl p-7">
          <h1 className="font-display text-4xl font-bold">Welcome back</h1>
          {error && <p className="rounded-md bg-red-100 p-3 text-red-700">{error}</p>}
          <input className="input" placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="relative">
            <input className="input pr-12" placeholder="Password" type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="absolute right-3 top-2.5" onClick={() => setShow(!show)}><Eye size={18} /></button>
          </div>
          <div className="flex items-center justify-between text-sm"><label><input type="checkbox" /> Remember me</label><button type="button" className="text-saffron">Forgot password?</button></div>
          <button className="btn-primary w-full">Login</button>
          <div className="grid grid-cols-2 gap-3"><button type="button" className="btn-secondary"><Mail size={16} /> Google</button><button type="button" className="btn-secondary"><Github size={16} /> GitHub</button></div>
          <p className="text-sm">New here? <Link className="font-semibold text-saffron" to="/register">Create an account</Link></p>
        </form>
      </section>
    </div>
  );
}
