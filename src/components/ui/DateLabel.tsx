interface DateLabelProps {
  children: React.ReactNode;
}

/** Historical date chip — a small gold-ringed label for dates and eras. */
export default function DateLabel({ children }: DateLabelProps) {
  return <span className="date-label">{children}</span>;
}
