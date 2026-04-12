import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50]);
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
          <Link to="/" className="flex items-center gap-3">
            <motion.span
              className="text-3xl tracking-tighter"
              whileHover={{ scale: 1.05 }}
            >
              FRAME
            </motion.span>
          </Link>
          <nav className="flex items-center gap-8">
            <Link to="/dashboard" className="text-slate-600 hover:text-black transition-colors">
              Dashboard
            </Link>
            <Link to="/new-project">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-black hover:bg-black/90 text-white px-6 rounded-full">
                  Start Project
                </Button>
              </motion.div>
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section - Full Bleed */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: imageScale }}
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1668952135116-2bcd8a9a2f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBlZGl0b3JpYWwlMjBtb2RlbCUyMHN0dWRpb3xlbnwxfHx8fDE3NzYwMTQxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fashion Photography"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </motion.div>

        <motion.div
          className="relative z-10 max-w-[1600px] mx-auto px-8 w-full"
          style={{ y: textY, opacity: textOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl"
          >
            <motion.h1
              className="text-[120px] leading-[0.9] tracking-tighter mb-8 text-white"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Production<br />planning.<br />Reimagined.
            </motion.h1>

            <motion.p
              className="text-xl text-white/90 mb-12 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              From concept to call sheet in seconds. Built for photographers, directors, and creative teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/new-project">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-10 py-7 text-lg rounded-full h-auto">
                    Start Your First Project
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Production Types */}
      <section className="bg-white py-32">
        <div className="max-w-[1600px] mx-auto px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl tracking-tight mb-20 max-w-2xl"
          >
            Built for every type of production
          </motion.h2>

          <div className="space-y-4">
            {/* Fashion & Editorial */}
            <Link to="/fashion-editorial" className="block group">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[70vh] overflow-hidden bg-black"
              >
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.6 }}
                >
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1668952135119-388d443497a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBlZGl0b3JpYWwlMjBtb2RlbCUyMHN0dWRpb3xlbnwxfHx8fDE3NzYwMTQxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Fashion & Editorial"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-500"
                  />
                </motion.div>
                <div className="absolute inset-0 flex items-end p-16">
                  <div>
                    <motion.h3
                      className="text-white text-7xl tracking-tight mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      Fashion & Editorial
                    </motion.h3>
                    <motion.p
                      className="text-white/80 text-xl max-w-xl"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      Lookbooks, campaigns, editorial shoots
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Film & Video + Commercial Photography - Split */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/film-video" className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative h-[60vh] overflow-hidden bg-black"
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1587319331522-349361826cd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvZHVjdGlvbiUyMGNpbmVtYSUyMGNhbWVyYSUyMGJlaGluZCUyMHRoZSUyMHNjZW5lc3xlbnwxfHx8fDE3NzYwMTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Film & Video"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-500"
                    />
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
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative h-[60vh] overflow-hidden bg-black"
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.6 }}
                  >
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1545242640-7c9e9cc07d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjb21tZXJjaWFsJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5JTIwbGlnaHRpbmclMjBzdHVkaW8lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzc2MDE0MTQyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Commercial Photography"
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-80 transition-opacity duration-500"
                    />
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

      {/* Workflow Section */}
      <section className="bg-black text-white py-40">
        <div className="max-w-[1600px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-32 max-w-3xl"
          >
            <h2 className="text-7xl tracking-tight mb-8">
              From brief to shoot-ready in minutes
            </h2>
            <p className="text-2xl text-white/60">
              AI-powered or manual. Your choice.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-20">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="mb-8 relative h-80 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1647204137620-bc1eadf8b6a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGZpbG1tYWtlciUyMHBob3RvZ3JhcGhlciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwMTQxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Creative Brief"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl mb-4 tracking-tight">Brief</h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Describe your vision in your own words. Location, talent, mood, deliverables.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-8 relative h-80 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1660299173156-a69ddba25824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGZpbG1tYWtlciUyMHBob3RvZ3JhcGhlciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwMTQxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="AI Generation"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl mb-4 tracking-tight">Build</h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Instant production workspace with mood boards, call sheets, shot lists, budgets.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="mb-8 relative h-80 overflow-hidden">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758553173287-513ad13280b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjcmVhdGl2ZSUyMHdvcmtzcGFjZSUyMGZpbG1tYWtlciUyMHBob3RvZ3JhcGhlciUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzYwMTQxNDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Production"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl mb-4 tracking-tight">Execute</h3>
              <p className="text-white/60 text-lg leading-relaxed">
                Refine, collaborate, export. Everything your team needs in one workspace.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1630706437030-34c03d3e3ff4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwcGhvdG9ncmFwaHklMjBlZGl0b3JpYWwlMjBtb2RlbCUyMHN0dWRpb3xlbnwxfHx8fDE3NzYwMTQxNDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Start Creating"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-[1600px] mx-auto px-8 w-full text-center"
        >
          <h2 className="text-8xl tracking-tight text-white mb-12 max-w-4xl mx-auto">
            Start your next production
          </h2>
          <Link to="/new-project">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-16 py-8 text-xl rounded-full h-auto">
                Create Project
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-[1600px] mx-auto px-8">
          <div className="flex items-center justify-between">
            <span className="text-3xl tracking-tighter">FRAME</span>
            <p className="text-white/40">© 2026 FRAME</p>
          </div>
        </div>
      </footer>
    </div>
  );
}