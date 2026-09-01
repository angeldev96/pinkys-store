/**
 * Ambient aurora painted behind the whole page.
 *
 * Pure CSS on purpose: the blobs animate forever, so keeping them off the
 * JS thread (transform/opacity only) means they cost nothing per frame and
 * never compete with scrolling. Sits at z-index -10, so every section above
 * it must stay transparent for it to show through.
 */
const BLOBS = [
  {
    className: 'aurora-a',
    style: {
      top: '-14%',
      left: '-10%',
      width: '58vw',
      height: '58vw',
      background: 'radial-gradient(circle at 35% 35%, hsl(335 95% 72% / 0.42), transparent 68%)',
    },
  },
  {
    className: 'aurora-b',
    style: {
      top: '-6%',
      right: '-16%',
      width: '52vw',
      height: '52vw',
      background: 'radial-gradient(circle at 60% 40%, hsl(275 85% 76% / 0.34), transparent 68%)',
      animationDelay: '-6s',
    },
  },
  {
    className: 'aurora-c',
    style: {
      top: '28%',
      left: '18%',
      width: '46vw',
      height: '46vw',
      background: 'radial-gradient(circle at 50% 50%, hsl(40 95% 70% / 0.28), transparent 68%)',
      animationDelay: '-12s',
    },
  },
  {
    className: 'aurora-b',
    style: {
      bottom: '-18%',
      right: '-8%',
      width: '54vw',
      height: '54vw',
      background: 'radial-gradient(circle at 45% 55%, hsl(350 100% 78% / 0.4), transparent 68%)',
      animationDelay: '-18s',
    },
  },
  {
    className: 'aurora-a',
    style: {
      bottom: '-10%',
      left: '-14%',
      width: '44vw',
      height: '44vw',
      background: 'radial-gradient(circle at 55% 45%, hsl(190 90% 74% / 0.24), transparent 68%)',
      animationDelay: '-9s',
    },
  },
] as const;

export function AuroraBackground() {
  return (
    <div className="aurora-layer" aria-hidden="true">
      {BLOBS.map((blob, i) => (
        <div key={i} className={`aurora-blob ${blob.className}`} style={blob.style} />
      ))}
      <div className="aurora-grid" />
    </div>
  );
}

export default AuroraBackground;
