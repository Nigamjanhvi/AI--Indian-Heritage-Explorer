import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Bookmark,
  Building2,
  ChevronDown,
  Compass,
  Crown,
  Heart,
  Home,
  Landmark,
  LogOut,
  Map,
  Menu,
  Moon,
  Settings,
  Shield,
  Sparkles,
  Sun,
  TentTree,
  Theater,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const exploreItems = [
  {
    label: 'UNESCO Sites',
    to: '/unesco',
    icon: Landmark,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=300&q=80',
    text: 'World heritage landmarks'
  },
  {
    label: 'States',
    to: '/states',
    icon: Map,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=300&q=80',
    text: 'Explore by region'
  },
  {
    label: 'Culture',
    to: '/culture',
    icon: Theater,
    image: 'https://images.unsplash.com/photo-1601655862666-5b393b95f771?auto=format&fit=crop&w=300&q=80',
    text: 'Art, rituals and stories'
  },
  {
    label: 'Temples',
    to: '/sites?category=temples',
    icon: Sparkles,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80',
    text: 'Sacred trails'
  },
  {
    label: 'Forts',
    to: '/sites?category=forts',
    icon: Crown,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=300&q=80',
    text: 'Royal citadels'
  },
  {
    label: 'Festivals',
    to: '/culture?type=festivals',
    icon: TentTree,
    image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=300&q=80',
    text: 'Seasonal celebrations'
  },
  {
    label: 'Map',
    to: '/map',
    icon: Compass,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=80',
    text: 'Discover visually'
  },
  {
    label: 'Collections',
    to: '/collections',
    icon: Bookmark,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=300&q=80',
    text: 'Curated journeys'
  }
];

const profileItems = [
  ['Profile', '/login', User],
  ['My Trips', '/trips', Compass],
  ['Saved Places', '/favorites', Heart],
  ['Settings', '/profile/settings', Settings]
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    setExploreOpen(false);
    setProfileOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const isExploreActive = ['/sites', '/explore', '/unesco', '/states', '/culture', '/map', '/collections'].some(path => location.pathname.startsWith(path));
  const isSavedActive = location.pathname.startsWith('/favorites') || location.pathname.startsWith('/collections');
  const avatarLabel = user?.name || user?.email || 'Guest';
  const avatarInitial = avatarLabel.charAt(0).toUpperCase();

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-[#fff2cf] text-[#8a5208] shadow-sm dark:bg-orange-400/15 dark:text-orange-100' : 'text-slate-700 hover:bg-white/70 hover:text-orange-700 dark:text-slate-200 dark:hover:bg-white/10'}`;

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/75 shadow-sm shadow-slate-900/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/75">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex min-w-fit items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#101b33] text-[#ffd36b] shadow-lg shadow-slate-900/15">
            <Map size={20} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-xl font-bold text-[#101b33] dark:text-white">Indian Heritage</span>
            <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-orange-700 dark:text-orange-200">Explorer</span>
          </span>
        </Link>

        <div className="hidden items-center rounded-full border border-white/50 bg-white/55 p-1 shadow-inner shadow-white/40 backdrop-blur xl:flex dark:border-white/10 dark:bg-white/5">
          <NavLink className={navLinkClass} to="/">Home</NavLink>
          <div className="relative" onMouseEnter={() => setExploreOpen(true)} onMouseLeave={() => setExploreOpen(false)}>
            <button
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${isExploreActive ? 'bg-[#fff2cf] text-[#8a5208] shadow-sm dark:bg-orange-400/15 dark:text-orange-100' : 'text-slate-700 hover:bg-white/70 hover:text-orange-700 dark:text-slate-200 dark:hover:bg-white/10'}`}
              onClick={() => setExploreOpen(v => !v)}
            >
              Explore <ChevronDown size={15} className={`transition ${exploreOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute left-1/2 top-12 w-[720px] -translate-x-1/2 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95"
                >
                  <div className="mb-3 px-2">
                    <p className="font-display text-2xl font-bold text-[#101b33] dark:text-white">Explore India&apos;s heritage</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">UNESCO places, living culture, routes and maps in one calm menu.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {exploreItems.map(item => (
                      <Link key={item.label} to={item.to} className="group flex gap-3 rounded-xl p-2 transition hover:bg-[#fff6df] dark:hover:bg-white/10">
                        <img src={item.image} alt="" className="h-16 w-20 rounded-lg object-cover" loading="lazy" />
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#101b33] text-[#ffd36b] transition group-hover:bg-orange-600 group-hover:text-white">
                            <item.icon size={17} />
                          </span>
                          <span>
                            <span className="block font-semibold text-slate-900 dark:text-white">{item.label}</span>
                            <span className="block text-sm text-slate-500 dark:text-slate-300">{item.text}</span>
                          </span>
                        </span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <NavLink className={navLinkClass} to="/ai">AI Planner</NavLink>
          <NavLink className={() => `${navLinkClass({ isActive: isSavedActive })}`} to={user ? '/favorites' : '/login'}>Saved</NavLink>
          <div className="relative" onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
            <button
              className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition ${profileOpen || location.pathname.startsWith('/trips') ? 'bg-[#fff2cf] text-[#8a5208] shadow-sm dark:bg-orange-400/15 dark:text-orange-100' : 'text-slate-700 hover:bg-white/70 hover:text-orange-700 dark:text-slate-200 dark:hover:bg-white/10'}`}
              onClick={() => setProfileOpen(v => !v)}
            >
              Profile <ChevronDown size={15} className={`transition ${profileOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute right-0 top-12 w-64 rounded-2xl border border-white/60 bg-white/95 p-2 shadow-2xl shadow-slate-900/15 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/95">
                  <div className="mb-2 rounded-xl bg-[#fff6df] p-3 dark:bg-white/10">
                    <p className="font-semibold">{avatarLabel}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-300">{user ? 'Heritage traveler' : 'Sign in to save journeys'}</p>
                  </div>
                  {profileItems.map(([label, to, Icon]) => (
                    <Link key={label} to={user ? to : '/login'} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fff6df] dark:text-slate-200 dark:hover:bg-white/10">
                      <Icon size={17} /> {label}
                    </Link>
                  ))}
                  {isAdmin && <Link to="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#fff6df] dark:text-slate-200 dark:hover:bg-white/10"><Shield size={17} /> Admin</Link>}
                  {user ? (
                    <button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:hover:bg-red-500/10">
                      <LogOut size={17} /> Logout
                    </button>
                  ) : (
                    <Link to="/login" className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-orange-700 transition hover:bg-[#fff6df] dark:hover:bg-white/10"><User size={17} /> Login</Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/70 text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white" onClick={() => setDark(v => !v)} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button className="hidden h-10 items-center gap-2 rounded-full border border-white/60 bg-white/70 px-2 pr-3 shadow-sm transition hover:-translate-y-0.5 hover:bg-white xl:flex dark:border-white/10 dark:bg-white/10" onClick={() => setProfileOpen(v => !v)} aria-label="Open profile menu">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-[#101b33] text-sm font-bold text-white">{avatarInitial}</span>
            <ChevronDown size={15} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/80 text-slate-900 xl:hidden dark:border-white/10 dark:bg-white/10 dark:text-white" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu size={21} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 bg-black/45 xl:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }} className="absolute inset-x-0 bottom-0 max-h-[86vh] overflow-y-auto rounded-t-3xl bg-[#fffaf0] p-4 shadow-2xl dark:bg-slate-950">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-2xl font-bold">Indian Heritage</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">Explore with fewer taps.</p>
                </div>
                <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 text-white" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
              </div>

              <div className="grid gap-2">
                {[
                  ['Home', '/', Home],
                  ['AI Planner', '/ai', Bot],
                  ['Saved', user ? '/favorites' : '/login', Heart],
                  ['Profile', user ? '/trips' : '/login', User]
                ].map(([label, to, Icon]) => (
                  <Link key={label} to={to} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-semibold shadow-sm dark:bg-white/10">
                    <Icon size={19} /> {label}
                  </Link>
                ))}
              </div>

              <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">Explore</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {exploreItems.map(item => (
                  <Link key={item.label} to={item.to} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm dark:bg-white/10">
                    <img src={item.image} alt="" className="h-12 w-14 rounded-lg object-cover" loading="lazy" />
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-[#101b33] text-[#ffd36b]"><item.icon size={17} /></span>
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-white p-3 shadow-sm dark:bg-white/10">
                {user ? (
                  <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 font-semibold text-red-600"><LogOut size={18} /> Logout</button>
                ) : (
                  <Link to="/login" className="flex items-center gap-3 rounded-xl px-3 py-2 font-semibold text-orange-700"><User size={18} /> Login</Link>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
