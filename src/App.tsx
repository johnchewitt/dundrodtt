import { Routes, Route, Navigate } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import ScrollAndTitle from './components/ScrollAndTitle';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import Story from './pages/Story';
import Seasons from './pages/Seasons';
import Circuit from './pages/Circuit';
import Archive from './pages/Archive';
import Drivers from './pages/Drivers';
import Today from './pages/Today';
import Credits from './pages/Credits';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollAndTitle />
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story" element={<Story />} />
          <Route path="/seasons" element={<Seasons />} />
          <Route path="/circuit" element={<Circuit />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/today" element={<Today />} />
          <Route path="/credits" element={<Credits />} />
          {/* Old Stage 1 route, kept working */}
          <Route path="/films" element={<Navigate to="/archive?section=film" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
