import { Routes, Route } from 'react-router-dom';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Story from './pages/Story';
import Seasons from './pages/Seasons';
import Circuit from './pages/Circuit';
import Archive from './pages/Archive';
import Drivers from './pages/Drivers';
import Films from './pages/Films';
import Today from './pages/Today';
import Credits from './pages/Credits';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Routes>
          <Route path="/" element={<Story />} />
          <Route path="/seasons" element={<Seasons />} />
          <Route path="/circuit" element={<Circuit />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/films" element={<Films />} />
          <Route path="/today" element={<Today />} />
          <Route path="/credits" element={<Credits />} />
        </Routes>
      </main>
      <SiteFooter />
    </>
  );
}
