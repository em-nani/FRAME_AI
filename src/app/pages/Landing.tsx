import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { 
  Sparkles, ArrowRight, FileText, Users, Camera, 
  DollarSign, Palette, CheckSquare, Zap, Shield, Clock
} from 'lucide-react';

function TypewriterWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((index + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words]);

  return (
    <span className="text-cyan-400">
      {displayed}<span className="animate-pulse ml-0.5">|</span>
    </span>
  );
}

function DocumentCard({ title, icon: Icon, lines, delay, color }: { 
  title: string; icon: any; lines: string[]; delay: number; color: string 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="bg-zinc-900 border border-zinc-700/60 rounded-2xl p-6 cursor-default"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-medium text-sm tracking-tight">{title}</span>
        <div className="ml-auto flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
        </div>
      </div>
      <div className="space-y-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: delay + 0.2 + i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${i === 0 ? 'bg-cyan-400' : 'bg-zinc-600'}`} />
            <div
              className={`h-1.5 rounded-full ${i === 0 ? 'bg-zinc-400' : 'bg-zinc-700'}`}
              style={{ width: `${58 + Math.sin(i * 2.5) * 22}%` }}
            />
            <span className="text-xs text-zinc-600 flex-shrink-0 font-mono">{line}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function StatCounter({ value, label, suffix = '' }: { value: string; label: string; suffix?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <div className="text-5xl tracking-tighter text-white mb-2">
        {value}<span className="text-cyan-400">{suffix}</span>
      </div>
      <div className="text-zinc-500 text-xs tracking-[0.15em] uppercase">{label}</div>
    </motion.div>
  );
}

function FeatureTicker() {
  const tags = [
    'Shot Lists','Call Sheets','Budget Estimates','Moodboards',
    'Pre-Production Timeline','Equipment Lists','Casting Briefs',
    'Post-Production Workflow','Deliverables Tracker','Client Exports',
    'Team Collaboration','Version History','PDF Export','On-Set Mode'
  ];
  return (
    <div className="overflow-hidden py-5 border-y border-zinc-800">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...tags, ...tags].map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 text-zinc-500 text-sm tracking-wide">
            <span className="w-1 h-1 rounded-full bg-cyan-500 flex-shrink-0" />
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-black/5"
      >
        <div className="mx-auto max-w-[1600px] px-8 py-6 flex items-center justify-between">
          <Link to="/">
            <motion.span className="text-3xl tracking-tighter" whileHover={{ scale: 1.05 }}>FRAME</motion.span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link to="/dashboard" className="text-slate-600 hover:text-black transition-colors text-sm">Dashboard</Link>
            <Link to="/new-project">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-black hover:bg-black/90 text-white px-6 rounded-full text-sm">Start Project</Button>
              </motion.div>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* HERO */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1668952135116-2bcd8a9a2f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBlZGl0b3JpYWwlMjBtb2RlbCUyMHN0dWRpb3xlbnwxfHx8fDE3NzYwMTQxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fashion Photography" className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
        </motion.div>

        <motion.div
          className="relative z-10 max-w-[1600px] mx-auto px-8 w-full"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/80 text-sm mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              AI-powered production suite
            </motion.div>

            <motion.h1
              className="text-[100px] leading-[0.88] tracking-tighter mb-8 text-white"
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            >
              Production<br />planning.<br />
              <TypewriterWords words={['Reimagined.', 'Simplified.', 'Elevated.']} />
            </motion.h1>

            <motion.p
              className="text-xl text-white/70 mb-12 max-w-lg leading-relaxed"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
            >
              From concept to call sheet in seconds. Built for photographers, directors, and creative teams who move fast.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.8 }}
              className="flex items-center gap-4"
            >
              <Link to="/new-project">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-cyan-500 hover:bg-cyan-400 text-white px-10 py-7 text-lg rounded-full h-auto gap-2">
                    Start Your First Project <ArrowRight className="w-5 h-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white/60 hover:text-white hover:bg-white/10 px-6 py-7 h-auto rounded-full">
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-zinc-950 py-20">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid grid-cols-4 gap-12 divide-x divide-zinc-800">
            <StatCounter value="8" suffix="x" label="Faster than manual planning" />
            <StatCounter value="30" suffix="s" label="Brief to full production plan" />
            <StatCounter value="8" label="Documents generated at once" />
            <StatCounter value="100" suffix="%" label="Tailored to your production" />
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-zinc-950"><FeatureTicker /></div>

      {/* ONE INPUT, EIGHT DOCS */}
      <section className="bg-zinc-950 text-white py-40">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <div className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-6">The Brief Is Everything</div>
              <h2 className="text-6xl tracking-tighter mb-8 leading-[0.95]">
                One input.<br />Eight documents.<br /><span className="text-zinc-600">Zero friction.</span>
              </h2>
              <p className="text-zinc-400 text-xl leading-relaxed mb-10">
                Describe your vision in plain language. FRAME reads between the lines — understanding your aesthetic, scale, crew needs, and timeline — then generates a complete, internally consistent production package.
              </p>
              <div className="space-y-3.5">
                {[
                  { icon: Palette, label: 'Moodboard with curated visual references' },
                  { icon: Users, label: 'Call sheet with crew and talent breakdown' },
                  { icon: Camera, label: 'Shot list matched to your locations and looks' },
                  { icon: DollarSign, label: 'Budget estimate with line-item detail' },
                  { icon: Clock, label: 'Pre & post production timelines' },
                  { icon: CheckSquare, label: 'Deliverables tracker from shoot to handoff' },
                ].map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                    className="flex items-center gap-4 text-zinc-300"
                  >
                    <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="text-base">{label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              <DocumentCard title="Call Sheet" icon={Users} lines={['6:00 AM', '8:30 AM', '12:00 PM']} delay={0.1} color="bg-cyan-600" />
              <DocumentCard title="Shot List" icon={Camera} lines={['Shot 01', 'Shot 02', 'Shot 03']} delay={0.2} color="bg-zinc-700" />
              <DocumentCard title="Budget" icon={DollarSign} lines={['Talent', 'Location', 'Equipment']} delay={0.3} color="bg-zinc-700" />
              <DocumentCard title="Moodboard" icon={Palette} lines={['Ref 01', 'Ref 02', 'Ref 03']} delay={0.4} color="bg-cyan-600" />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTION TYPES */}
      <section className="bg-white py-32">
        <div className="max-w-[1600px] mx-auto px-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-6xl tracking-tight mb-20 max-w-2xl">
            Built for every type of production
          </motion.h2>
          <div className="space-y-4">
            <Link to="/fashion-editorial" className="block group">
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative h-[70vh] overflow-hidden bg-black">
                <motion.div className="absolute inset-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.6 }}>
                  <ImageWithFallback src="https://images.unsplash.com/photo-1668952135119-388d443497a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBlZGl0b3JpYWwlMjBtb2RlbCUyMHN0dWRpb3xlbnwxfHx8fDE3NzYwMTQxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Fashion & Editorial" className="w-full h-full object-cover opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
                </motion.div>
                <div className="absolute inset-0 flex items-end p-16">
                  <div className="flex items-end justify-between w-full">
                    <div>
                      <h3 className="text-white text-7xl tracking-tight mb-4">Fashion & Editorial</h3>
                      <p className="text-white/80 text-xl">Lookbooks, campaigns, editorial shoots</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-3 text-white border border-white/30 rounded-full px-6 py-3 backdrop-blur-sm">
                        <span className="text-sm tracking-wide">Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/film-video" className="block group">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="relative h-[60vh] overflow-hidden bg-black">
                  <motion.div className="absolute inset-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.6 }}>
                    <ImageWithFallback src="https://images.unsplash.com/photo-1587319331522-349361826cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvZHVjdGlvbiUyMGNpbmVtYSUyMGNhbWVyYSUyMGJlaGluZCUyMHRoZSUyMHNjZW5lc3xlbnwxfHx8fDE3NzYwMTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Film & Video" className="w-full h-full object-cover opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
                  </motion.div>
                  <div className="absolute inset-0 flex items-end p-12">
                    <div>
                      <h3 className="text-white text-5xl tracking-tight mb-3">Film & Video</h3>
                      <p className="text-white/80 text-lg">Commercials, music videos, content</p>
                    </div>
                  </div>
                </motion.div>
              </Link>

              <Link to="/commercial-photography" className="block group">
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="relative h-[60vh] overflow-hidden bg-black">
                  <motion.div className="absolute inset-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.6 }}>
                    <ImageWithFallback src="https://images.unsplash.com/photo-1545242640-7c9e9cc07d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb21tZXJjaWFsJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5JTIwbGlnaHRpbmclMjBzdHVkaW8lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc2MDE0MTQyfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Commercial Photography" className="w-full h-full object-cover opacity-70 group-hover:opacity-85 transition-opacity duration-500" />
                  </motion.div>
                  <div className="absolute inset-0 flex items-end p-12">
                    <div>
                      <h3 className="text-white text-5xl tracking-tight mb-3">Commercial</h3>
                      <p className="text-white/80 text-lg">Product shoots, brand campaigns</p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-black text-white py-40">
        <div className="max-w-[1600px] mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-32 max-w-3xl">
            <div className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-6">How It Works</div>
            <h2 className="text-7xl tracking-tight mb-8">From brief to shoot-ready in minutes</h2>
            <p className="text-2xl text-white/50">AI-powered or manual. Your choice.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-20">
            {[
              { num: '01', title: 'Brief', body: 'Describe your vision in your own words. Location, talent, mood, deliverables. Attach inspiration images or Pinterest boards.', src: "https://images.unsplash.com/photo-1647204137620-bc1eadf8b6a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGZpbG1tYWtlciUyMHBob3RvZ3JhcGhlciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwMTQxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080", delay: 0.1 },
              { num: '02', title: 'Build', body: 'FRAME generates your complete production package. Moodboards, call sheets, shot lists, budgets — all linked and consistent with your brief.', src: "https://images.unsplash.com/photo-1660299173156-a69ddba25824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGZpbG1tYWtlciUyMHBob3RvZ3JhcGhlciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwMTQxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080", delay: 0.2 },
              { num: '03', title: 'Execute', body: 'Refine, collaborate, export. Distribute polished docs to clients and crew. Everything your team needs in one workspace.', src: "https://images.unsplash.com/photo-1758553173287-513ad13280b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGZpbG1tYWtlciUyMHBob3RvZ3JhcGhlciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwMTQxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080", delay: 0.3 },
            ].map(({ num, title, body, src, delay }) => (
              <motion.div key={num} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay }}>
                <div className="mb-8 relative h-80 overflow-hidden">
                  <ImageWithFallback src={src} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-mono text-white/50 border border-white/20 rounded px-2 py-1">{num}</span>
                  </div>
                </div>
                <h3 className="text-3xl mb-4 tracking-tight">{title}</h3>
                <p className="text-white/50 text-lg leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY FRAME */}
      <section className="bg-zinc-950 text-white py-40">
        <div className="max-w-[1600px] mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <div className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-6">Why FRAME</div>
            <h2 className="text-6xl tracking-tighter max-w-3xl">The only tool that speaks fluent production</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-zinc-800">
            {[
              { icon: FileText, title: 'Brief as source of truth', body: 'Every document links back to your original creative intent. The brief stays alive through your entire production lifecycle.' },
              { icon: Shield, title: 'Domain-deep knowledge', body: 'FRAME knows what a second AC does. It understands the difference between a lookbook and an editorial. It speaks the language of your set.' },
              { icon: Zap, title: 'Coherent, not just fast', body: 'The shot list matches the call sheet. The budget reflects the equipment list. Everything generated as a system — not eight separate documents.' },
              { icon: Users, title: 'Built for teams', body: 'Export polished client-ready decks. Distribute call sheets to crew. Keep everyone aligned from pre-production to final delivery.' },
              { icon: Camera, title: 'On-set companion', body: 'Day-of logistics at your fingertips. Track shot progress, manage talent, monitor the schedule from a clean mobile-friendly view.' },
              { icon: CheckSquare, title: 'Deliverables to the end', body: 'From brief to handoff. FRAME tracks your deliverables through post so nothing falls through the cracks on the way out the door.' },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                whileHover={{ backgroundColor: 'rgba(6,182,212,0.04)' }}
                className="bg-zinc-950 p-10 transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-xl tracking-tight mb-4">{title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" alt="Creative" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 max-w-[1600px] mx-auto px-8">
          <blockquote className="text-white text-5xl tracking-tight leading-tight max-w-4xl">
            "Pre-production shouldn't steal your creative energy.<br />
            <span className="text-zinc-500">That's what FRAME is for."</span>
          </blockquote>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback src="https://images.unsplash.com/photo-1630706437030-34c03d3e3ff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBlZGl0b3JpYWwlMjBtb2RlbCUyMHN0dWRpb3xlbnwxfHx8fDE3NzYwMTQxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Start Creating" className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 max-w-[1600px] mx-auto px-8 w-full text-center">
          <p className="text-cyan-400 text-xs tracking-[0.2em] uppercase mb-6">Ready to move faster</p>
          <h2 className="text-8xl tracking-tight text-white mb-12 max-w-4xl mx-auto leading-none">Start your next production</h2>
          <Link to="/new-project">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-cyan-500 hover:bg-cyan-400 text-white px-16 py-8 text-xl rounded-full h-auto gap-3">
                Create Project <ArrowRight className="w-6 h-6" />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-[1600px] mx-auto px-8 flex items-center justify-between">
          <span className="text-3xl tracking-tighter">FRAME</span>
          <div className="flex items-center gap-8 text-zinc-500 text-sm">
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/new-project" className="hover:text-white transition-colors">New Project</Link>
            <span>© 2026 FRAME AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}