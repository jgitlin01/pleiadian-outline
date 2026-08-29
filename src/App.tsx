import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Starfield — sticky background plate                                */
/* ------------------------------------------------------------------ */

function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    type Star = { x: number; y: number; r: number; a: number; tw: number; ph: number }
    let stars: Star[] = []

    const seed = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round((w * h) / 5200)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.9 ? Math.random() * 0.85 + 0.25 : Math.random() * 1.5 + 0.9,
        a: Math.random() * 0.5 + 0.18,
        tw: Math.random() * 0.0016 + 0.0004,
        ph: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const s of stars) {
        const flicker = 0.72 + 0.28 * Math.sin(t * s.tw + s.ph)
        ctx.globalAlpha = s.a * flicker
        ctx.fillStyle = s.r > 1.1 ? '#F3E9D4' : '#CFC6B2'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    seed()
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', seed)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', seed)
    }
  }, [])

  return (
    <div className="absolute inset-0">
      <div
        className="nebula absolute inset-[-10%]"
        style={{
          background:
            'radial-gradient(58% 44% at 22% 28%, rgba(78,127,114,0.13) 0%, transparent 62%),' +
            'radial-gradient(48% 40% at 78% 18%, rgba(140,59,43,0.11) 0%, transparent 60%),' +
            'radial-gradient(70% 52% at 55% 82%, rgba(192,138,62,0.07) 0%, transparent 66%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Engraved plate of the cluster                                      */
/* ------------------------------------------------------------------ */

const CLUSTER = [
  { n: 'Taygeta', x: 104, y: 92, m: 2.2 },
  { n: 'Maia', x: 152, y: 108, m: 2.6 },
  { n: 'Asterope', x: 138, y: 62, m: 1.3 },
  { n: 'Electra', x: 118, y: 154, m: 2.6 },
  { n: 'Alcyone', x: 200, y: 160, m: 3.4 },
  { n: 'Merope', x: 168, y: 198, m: 2.3 },
  { n: 'Atlas', x: 268, y: 150, m: 2.5 },
  { n: 'Pleione', x: 284, y: 128, m: 1.6 },
]

const LINKS: [number, number][] = [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [4, 6], [6, 7]]

function ClusterPlate() {
  return (
    <svg viewBox="0 0 340 250" className="w-full h-auto" role="img" aria-label="Engraved star chart of the Pleiades cluster">
      <g stroke="rgba(192,138,62,0.28)" strokeWidth="0.6">
        {LINKS.map(([a, b], i) => (
          <line key={i} x1={CLUSTER[a].x} y1={CLUSTER[a].y} x2={CLUSTER[b].x} y2={CLUSTER[b].y} strokeDasharray="2 4" />
        ))}
      </g>
      {CLUSTER.map((s) => (
        <g key={s.n}>
          <circle cx={s.x} cy={s.y} r={s.m * 3.6} fill="rgba(237,228,208,0.05)" />
          <circle cx={s.x} cy={s.y} r={s.m} fill="#EDE4D0" />
          <text
            x={s.x + s.m + 7}
            y={s.y + 3}
            className="mono"
            fontSize="7.5"
            letterSpacing="0.14em"
            fill="rgba(192,138,62,0.85)"
          >
            {s.n.toUpperCase()}
          </text>
        </g>
      ))}
      <g stroke="rgba(192,138,62,0.22)" strokeWidth="0.6" fill="none">
        <rect x="10" y="10" width="320" height="230" />
      </g>
      <text x="20" y="232" className="mono" fontSize="7" letterSpacing="0.2em" fill="rgba(185,174,151,0.55)">
        M45 · TAURUS · ≈444 LY
      </text>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Corner brackets                                                    */
/* ------------------------------------------------------------------ */

function Brackets() {
  const path = 'M 2 18 L 2 7 Q 2 2 7 2 L 18 2'
  const s = { stroke: 'rgba(192,138,62,0.5)', strokeWidth: 1.6, strokeLinecap: 'round' as const, fill: 'none' }
  return (
    <>
      <svg width="20" height="20" className="absolute left-0 top-0"><path d={path} {...s} /></svg>
      <svg width="20" height="20" className="absolute right-0 top-0 rotate-90"><path d={path} {...s} /></svg>
      <svg width="20" height="20" className="absolute right-0 bottom-0 rotate-180"><path d={path} {...s} /></svg>
      <svg width="20" height="20" className="absolute left-0 bottom-0 -rotate-90"><path d={path} {...s} /></svg>
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Ink-fill paragraph                                                 */
/* ------------------------------------------------------------------ */

function InkFill({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })

  const words = text.split(' ')
  const total = text.length
  let cursor = 0

  return (
    <p ref={ref} className={className}>
      {words.map((word, wi) => {
        const node = (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.split('').map((ch, ci) => {
              const delay = (cursor / total) * 1.5
              cursor += 1
              return (
                <span key={ci} className="relative inline-block">
                  <span className="invisible">{ch}</span>
                  <motion.span
                    className="absolute inset-0"
                    style={{ color: 'var(--paper)' }}
                    initial={{ opacity: 0.22 }}
                    animate={inView ? { opacity: 1 } : { opacity: 0.22 }}
                    transition={{ duration: 0.05, delay }}
                  >
                    {ch}
                  </motion.span>
                </span>
              )
            })}
          </span>
        )
        cursor += 1
        return (
          <span key={`w${wi}`}>
            {node}
            {wi < words.length - 1 ? '\u00A0' : ''}
          </span>
        )
      })}
    </p>
  )
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: 'Contents', href: '#contents' },
  { label: 'Method', href: '#method' },
  { label: 'Sources', href: '#sources' },
  { label: 'FAQ', href: '#faq' },
]

const PILLARS = [
  {
    mark: '§ B',
    title: 'The origin story',
    body:
      'Where the movement says humanity came from — Anunnaki, Reptilians, Pleiadians, the Galactic Federation of Light, the Moon base, the Greys and Mantids, the hollow Earth. Each thread followed back to the book, author and year it entered the culture.',
  },
  {
    mark: '§ C',
    title: 'The spiritual frame',
    body:
      'The Source, starseeds, soul contracts, the Karmic Council, reincarnation, Gaia, the 144,000, vortexes, crystals, the seven dimensions, and the frequency system. Stated as adherents hold it, then set against the record.',
  },
  {
    mark: '§ D',
    title: 'The Gnostic substrate',
    body:
      'The 2nd-century cosmology the whole structure is grafted onto: Monad, Pleroma, the Aeons, Sophia’s fall, the Demiurge and the Archons — and how a Platonic craftsman-god became a devil.',
  },
]

const CONTENTS = [
  ['§ A', 'Introduction', 'New Age theology; the movement’s unnamed status', '2'],
  ['§ B', 'Alien-race origin story', 'Ten subsections, Anunnaki through hollow Earth', '6'],
  ['§ C', 'Merging origin with theology', 'Eleven subsections, the Source through the Matrix', '7'],
  ['§ D', 'Gnostic theology', 'Cosmology, terminology, biblical borrowings', '4'],
  ['§ E', 'Additional concepts', 'Ancient pantheons, cryptids, secret societies', '1'],
]

const STATS = [
  { n: '01', v: '19', l: 'Pages, fully cited and cross-referenced' },
  { n: '02', v: '40+', l: 'Terms and concepts individually defined' },
  { n: '03', v: '1864→', l: 'Source range, from Verne to current journals' },
]

const FAQ = [
  {
    q: 'Is this written by a believer?',
    a: 'No. It is written from the outside, in a neutral register. Beliefs are reported accurately and without mockery, then followed by a plain note on what the historical and scientific record actually supports. If you are looking for confirmation, this is the wrong document.',
  },
  {
    q: 'Will it tell me whether I am a starseed?',
    a: 'No. It makes no claims about you, offers no reading, diagnosis or identification, and predicts nothing. It describes what the movement teaches about starseeds and where that teaching came from.',
  },
  {
    q: 'Why does the movement have no name?',
    a: 'Because it has no central text, founder or organisation. It is a loose synthesis assembled from several unrelated authors across sixty years. “Pleiadian New Age movement” is the descriptive label this document adopts for the sake of discussion.',
  },
  {
    q: 'What do I actually receive?',
    a: 'Immediate access to the current edition as a digital reference document, plus every future revision at no additional cost. One payment. No subscription, no recurring charge.',
  },
]

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative" style={{ backgroundColor: 'var(--ink)' }}>
      <div className="grain" />

      {/* ============ NAV ============ */}
      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 sm:px-8 md:px-12 md:py-6">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="display text-[17px] font-normal tracking-[0.02em]" style={{ color: 'var(--paper)' }}>
            The Pleiadian
          </span>
          <span className="mono text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--brass)' }}>
            Outline
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="mono rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors duration-300"
              style={{ color: 'var(--paper-dim)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--paper)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--paper-dim)')}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#get"
            className="mono ml-4 rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.18em] transition-all duration-300"
            style={{ background: 'var(--brass)', color: '#0A0A0A' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#D89C4C')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--brass)')}
          >
            Get the document
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="relative z-[60] flex h-10 w-10 items-center justify-center md:hidden"
          style={{ color: 'var(--paper)' }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="x" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
                <X size={24} strokeWidth={1.4} />
              </motion.span>
            ) : (
              <motion.span key="m" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}>
                <Menu size={24} strokeWidth={1.4} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[55] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ background: 'rgba(6,8,15,0.97)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-7">
              {NAV.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="display text-3xl font-light"
                  style={{ color: 'var(--paper)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 + i * 0.05 }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="#get"
                onClick={() => setOpen(false)}
                className="mono mt-4 rounded-full px-8 py-3 text-xs uppercase tracking-[0.2em]"
                style={{ background: 'var(--brass)', color: '#0A0A0A' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Get the document
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ STICKY BACKGROUND ============ */}
      <div id="top" className="relative z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Starfield />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--ink))' }}
          />
        </div>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        {/* ============ HERO ============ */}
        <header className="px-6 pb-20 pt-32 sm:px-8 md:px-12 md:pb-40 md:pt-40">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-14 md:grid-cols-2">
            <div>
              <div className="mono mb-8 text-[10px] uppercase tracking-[0.34em]" style={{ color: 'var(--brass)' }}>
                Independent reference · Ed. VI
              </div>
              <h1
                className="display text-[2.6rem] font-light leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-[4.1rem] lg:text-[4.9rem]"
                style={{ color: 'var(--paper)' }}
              >
                A field guide
                <br />
                to a belief system
                <br />
                <em className="font-light italic" style={{ color: 'var(--brass)' }}>that has no name.</em>
              </h1>
              <div className="rule mt-10 max-w-md" />
              <p className="mt-6 max-w-md text-[15px] font-light leading-relaxed" style={{ color: 'var(--paper-dim)' }}>
                Nineteen pages mapping the Pleiadian New Age movement — its origin story, its theology, and the
                2nd-century Gnostic cosmology underneath it. Every concept traced to the person, book and year it
                came from.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <div className="w-full max-w-sm">
                <ClusterPlate />
              </div>
              <div className="plate mt-6 w-full max-w-sm rounded-2xl p-6">
                <div className="mono mb-3 text-[9px] uppercase tracking-[0.3em]" style={{ color: 'var(--brass)' }}>
                  Editorial note
                </div>
                <p className="text-[14px] font-light italic leading-relaxed" style={{ color: 'var(--paper)' }}>
                  “This document describes the movement from the outside. It reports each belief faithfully, names
                  its source, and then states what the historical and scientific record supports. It is a study of
                  the movement — not an instrument of it.”
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* ============ WHAT'S INSIDE ============ */}
        <section id="contents" className="flex min-h-screen items-center px-6 pb-24 sm:px-8 md:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="plate rounded-3xl">
              <div className="flex flex-col items-start justify-between gap-10 p-8 pb-0 md:flex-row md:p-12 md:pb-0">
                <div>
                  <div className="mono mb-4 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--brass)' }}>
                    001 / What is inside
                  </div>
                  <h2 className="display max-w-md text-3xl font-light leading-[1.08] tracking-[-0.01em] md:text-[2.7rem]" style={{ color: 'var(--paper)' }}>
                    Three layers, assembled by people who never met.
                  </h2>
                </div>
                <div className="max-w-md">
                  <p className="mb-7 text-[14px] font-light leading-relaxed" style={{ color: 'var(--paper-dim)' }}>
                    The movement has no founder, no scripture and no organisation. It is a synthesis — pseudo-archaeology
                    from the 1970s, contactee reports from the same decade, channelled material from the 1990s, and a
                    Gnostic framework eighteen centuries older than any of it. This outline separates the strands and
                    shows the seams.
                  </p>
                  <a
                    href="#get"
                    className="mono inline-flex items-center gap-2 rounded-full px-6 py-3 text-[11px] uppercase tracking-[0.18em] transition-all duration-300"
                    style={{ background: 'var(--brass)', color: '#0A0A0A' }}
                  >
                    Get the document — $25
                    <ArrowUpRight size={15} strokeWidth={2} />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 p-6 pt-10 md:grid-cols-3 md:p-12 md:pt-12">
                {PILLARS.map((p) => (
                  <div
                    key={p.mark}
                    className="flex min-h-[280px] flex-col justify-between rounded-2xl p-7 md:p-8"
                    style={{ background: 'rgba(6,8,15,0.5)', boxShadow: 'inset 0 0 0 1px rgba(192,138,62,0.13)' }}
                  >
                    <div className="mono text-[10px] uppercase tracking-[0.28em]" style={{ color: 'var(--brass)' }}>
                      {p.mark}
                    </div>
                    <div>
                      <h3 className="display mb-4 text-2xl font-light" style={{ color: 'var(--paper)' }}>
                        {p.title}
                      </h3>
                      <p className="text-[13.5px] font-light leading-relaxed" style={{ color: 'var(--paper-dim)' }}>
                        {p.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-6 pb-10 md:px-12 md:pb-14">
                <div className="rule mb-8" />
                <div className="mono mb-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--brass)' }}>
                  Table of contents
                </div>
                <ul>
                  {CONTENTS.map(([mark, title, sub, n]) => (
                    <li
                      key={mark}
                      className="grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 border-t py-5 md:grid-cols-[4rem_1fr_1fr_auto]"
                      style={{ borderColor: 'rgba(192,138,62,0.16)' }}
                    >
                      <span className="mono text-[11px] tracking-[0.16em]" style={{ color: 'var(--brass)' }}>{mark}</span>
                      <span className="display text-lg font-light md:text-xl" style={{ color: 'var(--paper)' }}>{title}</span>
                      <span className="mono hidden text-[11px] font-light md:block" style={{ color: 'var(--paper-dim)' }}>{sub}</span>
                      <span className="mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(185,174,151,0.55)' }}>
                        {n} pp
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ============ METHOD ============ */}
      <div className="relative z-10">
        <section id="method" className="relative flex flex-col justify-end px-6 py-20 sm:px-8 md:px-12 md:py-28">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mono mb-10 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--brass)' }}>
              002 / Method
            </div>

            <InkFill
              className="display mb-24 max-w-6xl text-2xl font-light leading-snug tracking-[-0.015em] sm:text-3xl md:mb-32 md:text-[2.9rem] lg:text-[3.4rem] lg:leading-[1.14]"
              text="Every claim is reported as adherents hold it, attributed to the author who introduced it, and followed by a plain statement of what the evidence supports. No belief is mocked. None is endorsed. The reader is left to judge."
            />

            <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
              {STATS.map((s) => (
                <div key={s.n} className="relative overflow-hidden rounded-lg">
                  <Brackets />
                  <div className="px-7 py-9">
                    <div className="mono mb-6 text-[10px] tracking-[0.24em]" style={{ color: 'var(--brass)' }}>{s.n}</div>
                    <div className="display mb-3 text-[2.6rem] font-light leading-none md:text-5xl" style={{ color: 'var(--paper)' }}>
                      {s.v}
                    </div>
                    <div className="mono text-[10px] uppercase leading-relaxed tracking-[0.16em]" style={{ color: 'var(--paper-dim)' }}>
                      {s.l}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div id="sources" className="mb-24">
              <div className="rule mb-8" />
              <div className="mono mb-7 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--brass)' }}>
                003 / Principal sources discussed
              </div>
              <p className="max-w-4xl text-[15px] font-light leading-loose" style={{ color: 'var(--paper-dim)' }}>
                Erich von Däniken, <em style={{ color: 'var(--paper)' }}>Chariots of the Gods</em> (1968) · Zecharia Sitchin,
                <em style={{ color: 'var(--paper)' }}> The Twelfth Planet</em> (1976) and later works · Eduard “Billy” Meier,
                contact reports (from 1975) · Barbara Marciniak, <em style={{ color: 'var(--paper)' }}>Bringers of the Dawn</em> (1992) ·
                Barbara Hand Clow, <em style={{ color: 'var(--paper)' }}>The Pleiadian Agenda</em> (1995) · David Icke, reptilian
                material (1990s) · Lovelock &amp; Margulis on the Gaia hypothesis · the Nag Hammadi corpus, including the
                <em style={{ color: 'var(--paper)' }}> Apocryphon of John</em> · Plotinus on emanation · Revelation 7 and 14 ·
                and contemporary reporting on the three known interstellar objects, 1I/ʻOumuamua, 2I/Borisov and 3I/ATLAS.
              </p>
            </div>

            <div id="faq" className="mb-24">
              <div className="rule mb-8" />
              <div className="mono mb-8 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--brass)' }}>
                004 / Before you buy
              </div>
              <div className="grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2">
                {FAQ.map((f) => (
                  <div key={f.q}>
                    <h4 className="display mb-3 text-xl font-light" style={{ color: 'var(--paper)' }}>{f.q}</h4>
                    <p className="text-[14px] font-light leading-relaxed" style={{ color: 'var(--paper-dim)' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div id="get" className="plate rounded-3xl px-8 py-14 text-center md:px-16 md:py-20">
              <div className="mono mb-6 text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--brass)' }}>
                Single payment · No subscription
              </div>
              <h2 className="display mx-auto mb-6 max-w-2xl text-3xl font-light leading-[1.1] tracking-[-0.015em] md:text-5xl" style={{ color: 'var(--paper)' }}>
                The current edition, and every revision after it.
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-[14px] font-light leading-relaxed" style={{ color: 'var(--paper-dim)' }}>
                $25 once. Immediate access on purchase. Future editions delivered at no additional cost.
                Full refund within 14 days, no reason required.
              </p>
              <a
                href="#"
                className="mono inline-flex items-center gap-2 rounded-full px-10 py-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-300"
                style={{ background: 'var(--paper)', color: '#0A0A0A' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brass)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--paper)' }}
              >
                Get the document — $25
                <ArrowUpRight size={15} strokeWidth={2} />
              </a>
            </div>

            <footer className="pt-20">
              <div className="rule mb-8" />
              <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.6fr_1fr]">
                <p className="mono text-[10.5px] leading-loose" style={{ color: 'rgba(185,174,151,0.6)' }}>
                  This is an independent scholarly outline of a contemporary belief system. It is offered for
                  educational, historical and critical purposes. It does not provide medical, psychological, legal or
                  financial advice, makes no predictions, and identifies no individual as belonging to any group. It is
                  not affiliated with, authorised by or endorsed by any organisation, author or person named or
                  discussed within it; third-party works are referenced for commentary, criticism and scholarship.
                  Sold as a digital publication.
                </p>
                <div className="flex flex-col gap-3">
                  {['Terms of sale', 'Refund policy', 'Privacy', 'Contact'].map((x) => (
                    <a key={x} href="#" className="mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: 'var(--paper-dim)' }}>
                      {x}
                    </a>
                  ))}
                </div>
              </div>
              <div className="mono mt-10 text-[10px] uppercase tracking-[0.24em]" style={{ color: 'rgba(185,174,151,0.4)' }}>
                © {new Date().getFullYear()} · Edition VI · All rights reserved
              </div>
            </footer>
          </div>
        </section>
      </div>

      <div className="h-[10vh]" />
    </div>
  )
}
