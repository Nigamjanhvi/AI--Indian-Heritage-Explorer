import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const interests = ['Temple Tourism', 'History', 'Architecture', 'Culture', 'Food', 'Nature'];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', interests: [], avatar: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  function toggleInterest(item) {
    setForm(current => ({
      ...current,
      interests: current.interests.includes(item) ? current.interests.filter(v => v !== item) : [...current.interests, item]
    }));
  }

  async function submit() {
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <div className="glass rounded-xl p-8">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-saffron">Step {step} of 4</p>
        <h1 className="mt-2 font-display text-4xl font-bold">Create your heritage passport</h1>
        {error && <p className="mt-4 rounded-md bg-red-100 p-3 text-red-700">{error}</p>}
        {step === 1 && <div className="mt-6 grid gap-3"><input className="input" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} /><input className="input" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} /><input className="input" type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} /></div>}
        {step === 2 && <div className="mt-6 grid gap-3 md:grid-cols-3">{interests.map(item => <button type="button" className={form.interests.includes(item) ? 'btn-primary' : 'btn-secondary'} key={item} onClick={() => toggleInterest(item)}>{item}</button>)}</div>}
        {step === 3 && <div className="mt-6"><input className="input" placeholder="Profile picture URL" onChange={e => setForm({ ...form, avatar: e.target.value })} /><p className="mt-2 text-sm text-slate-500">Image upload can be connected to cloud storage for production.</p></div>}
        {step === 4 && <div className="mt-6 rounded-lg bg-white p-5 dark:bg-slate-900"><p className="font-semibold">{form.name}</p><p>{form.email}</p><p className="mt-2 text-sm">{form.interests.join(', ')}</p></div>}
        <div className="mt-8 flex justify-between">
          <button className="btn-secondary" disabled={step === 1} onClick={() => setStep(step - 1)}>Back</button>
          {step < 4 ? <button className="btn-primary" onClick={() => setStep(step + 1)}>Continue</button> : <button className="btn-primary" onClick={submit}>Create Account</button>}
        </div>
      </div>
    </section>
  );
}
