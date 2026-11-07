interface UnavailableProps {
  title?: string;
  children: React.ReactNode;
}

/**
 * Honest state for content that is not available yet (awaiting supply,
 * permission or a later build stage). Direction, never a dead end.
 */
export default function Unavailable({ title, children }: UnavailableProps) {
  return (
    <div className="unavailable" role="status">
      {title && <h4>{title}</h4>}
      <p>{children}</p>
    </div>
  );
}
