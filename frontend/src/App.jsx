import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Sites from './pages/Sites.jsx';
import SiteDetails from './pages/SiteDetails.jsx';
import Favorites from './pages/Favorites.jsx';
import Trips from './pages/Trips.jsx';
import AiPlanner from './pages/AiPlanner.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import States from './pages/States.jsx';
import StateDetails from './pages/StateDetails.jsx';
import Unesco from './pages/Unesco.jsx';
import Culture from './pages/Culture.jsx';
import MapExplorer from './pages/MapExplorer.jsx';
import Collections from './pages/Collections.jsx';
import AITravelCompanion from './components/AITravelCompanion.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sites" element={<Sites />} />
          <Route path="/explore" element={<Sites />} />
          <Route path="/sites/:id" element={<SiteDetails />} />
          <Route path="/unesco" element={<Unesco />} />
          <Route path="/states" element={<States />} />
          <Route path="/states/:name" element={<StateDetails />} />
          <Route path="/culture" element={<Culture />} />
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/ai" element={<AiPlanner />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/trips" element={<Trips />} />
          </Route>
          <Route element={<ProtectedRoute admin />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>
      <AITravelCompanion />
    </>
  );
}
