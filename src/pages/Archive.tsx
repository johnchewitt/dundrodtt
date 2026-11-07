import { Link } from 'react-router-dom';
import PhotoPlate from '../components/PhotoPlate';
import { archivePhotos } from '../model/content';

export default function Archive() {
  const special = archivePhotos.filter((p) => p.special1950);
  return (
    <div className="page">
      <h1>The Photographic Archive</h1>
      <p className="standfirst">
        Forty-four photographs from the Dundrod years, kindly contributed by
        Neville Armstrong.
      </p>
      <p className="muted">
        The full searchable archive — browsing by year, event, driver, team,
        car and location, with large-format viewing — arrives with the
        archive build stage. The rare 1950 photographs open it here first.
      </p>
      <h2>The 1950 photographs</h2>
      <p>
        Previously unseen images from the circuit&apos;s opening season: the
        August Ulster Trophy meeting and the September Tourist Trophy that
        made twenty-year-old Stirling Moss&apos;s name.{' '}
        <Link to="/seasons#y1950">Read the 1950 story</Link>.
      </p>
      {special.map((p) => (
        <PhotoPlate key={p.id} photo={p} contained />
      ))}
    </div>
  );
}
