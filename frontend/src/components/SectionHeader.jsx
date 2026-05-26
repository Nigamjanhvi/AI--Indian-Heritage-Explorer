export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8 max-w-3xl">
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-[0.24em] text-saffron">{eyebrow}</p>}
      <h2 className="font-display text-3xl font-bold md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 text-slate-600 dark:text-slate-300">{subtitle}</p>}
    </div>
  );
}
