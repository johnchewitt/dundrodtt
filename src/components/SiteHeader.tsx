import { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export const experiences = [
  { path: '/', label: 'The Story' },
  { path: '/seasons', label: 'Six Seasons' },
  { path: '/circuit', label: 'The Circuit' },
  { path: '/archive', label: 'Photo Archive' },
  { path: '/drivers', label: 'Drivers & Teams' },
  { path: '/films', label: 'Film Archive' },
  { path: '/today', label: 'Dundrod Today' },
  { path: '/credits', label: 'Acknowledgements' },
];

function NavList() {
  return (
    <ul>
      {experiences.map((s) => (
        <li key={s.path}>
          <NavLink to={s.path} end={s.path === '/'}>
            {s.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default function SiteHeader() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const location = useLocation();

  useEffect(() => {
    dialogRef.current?.close();
  }, [location]);

  return (
    <header className="masthead">
      <div className="masthead-inner">
        <NavLink to="/" className="wordmark">
          Dundrod<em>The Forgotten Racing Years</em>
        </NavLink>
        <button
          type="button"
          className="menu-button"
          aria-haspopup="dialog"
          onClick={() => dialogRef.current?.showModal()}
        >
          Menu
        </button>
      </div>

      <nav className="nav-rail" aria-label="Experiences">
        <NavList />
      </nav>

      <dialog ref={dialogRef} className="nav-dialog" aria-label="Experiences">
        <div className="nav-dialog-inner">
          <div className="nav-dialog-head">
            <span className="wordmark" aria-hidden="true">
              Dundrod
            </span>
            <button
              type="button"
              className="menu-button"
              onClick={() => dialogRef.current?.close()}
            >
              Close
            </button>
          </div>
          <nav aria-label="Experiences">
            <NavList />
          </nav>
        </div>
      </dialog>
    </header>
  );
}
