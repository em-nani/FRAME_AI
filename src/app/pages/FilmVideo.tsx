import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { generateProjectFromPrompt } from '../lib/ai-mock';
import { useProjects } from '../lib/project-context';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function FilmVideo() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [mode, setMode] = useState<'choose' | 'ai' | 'manual'>('choose');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    try {
      const project = await generateProjectFromPrompt(prompt);
      addProject(project);
      navigate(`/workspace/${project.id}`);
    } catch (error) {
      console.error('Error generating project:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualCreate = () => {
    const blankProject = {
      id: `project-${Date.now()}`,
      name: 'Untitled Film Project',
      prompt: 'Manual film & video project',
      status: 'planning' as const,
      createdAt: new Date().toISOString(),
      moodBoard: { images: [], colorPalette: [], references: [] },
      timeline: [],
      callSheet: { crew: [], talent: [], schedule: [] },
      shotList: [],
      equipment: [],
      budget: { items: [], totalEstimate: 0 },
      postProduction: { tasks: [], workflow: '' },
      deliverables: []
    };

    addProject(blankProject);
    navigate(`/workspace/${blankProject.id}`);
  };

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
            <span className="text-3xl tracking-tighter">FRAME</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="gap-2 hover:text-cyan-600">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-24">
        <AnimatePresence mode="wait">
          {mode === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="relative h-[60vh] flex items-center overflow-hidden mb-20">
                <div className="absolute inset-0">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1591314222191-61fad06f4428?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxmaWxtJTIwcHJvZHVjdGlvbiUyMGNpbmVtYSUyMGNhbWVyYSUyMGJlaGluZCUyMHRoZSUyMHNjZW5lc3xlbnwxfHx8fDE3NzYwMTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Film & Video"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 max-w-[1600px] mx-auto px-8 w-full">
                  <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-8xl tracking-tight text-white max-w-4xl"
                  >
                    Film & Video
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl text-white/80 mt-6 max-w-2xl"
                  >
                    Commercials, music videos, content production
                  </motion.p>
                </div>
              </section>

              {/* Mode Selection */}
              <section className="max-w-[1600px] mx-auto px-8 mb-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-16"
                >
                  <h2 className="text-5xl tracking-tight mb-4">Choose your workflow</h2>
                  <p className="text-xl text-slate-600">AI-powered generation or complete creative control</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* AI Mode */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setMode('ai')}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-[500px] overflow-hidden mb-6 bg-black">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1632670467450-bc8f70fe5ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxmaWxtJTIwcHJvZHVjdGlvbiUyMGNpbmVtYSUyMGNhbWVyYSUyMGJlaGluZCUyMHRoZSUyMHNjZW5lc3xlbnwxfHx8fDE3NzYwMTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="AI Generation"
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                        />
                      </motion.div>
                      <div className="absolute inset-0 flex items-end p-8">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-8 h-8 text-cyan-400" />
                          <h3 className="text-white text-4xl tracking-tight">AI-Powered</h3>
                        </div>
                      </div>
                    </div>
                    <p className="text-xl text-slate-600 mb-4">
                      Describe your vision, get a complete production plan in seconds
                    </p>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 rounded-full h-auto">
                      Use AI Generator
                    </Button>
                  </motion.div>

                  {/* Manual Mode */}
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => setMode('manual')}
                    className="group cursor-pointer"
                  >
                    <div className="relative h-[500px] overflow-hidden mb-6 bg-black">
                      <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }}>
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1597263123506-6f343510a548?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmaWxtJTIwcHJvZHVjdGlvbiUyMGNpbmVtYSUyMGNhbWVyYSUyMGJlaGluZCUyMHRoZSUyMHNjZW5lc3xlbnwxfHx8fDE3NzYwMTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Manual Creation"
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                        />
                      </motion.div>
                      <div className="absolute inset-0 flex items-end p-8">
                        <h3 className="text-white text-4xl tracking-tight">Manual</h3>
                      </div>
                    </div>
                    <p className="text-xl text-slate-600 mb-4">
                      Start with a blank workspace and build everything yourself
                    </p>
                    <Button variant="outline" className="border-2 px-8 py-6 rounded-full h-auto">
                      Start From Scratch
                    </Button>
                  </motion.div>
                </div>
              </section>
            </motion.div>
          )}

          {mode === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1400px] mx-auto px-8 py-20"
            >
              <Button
                variant="ghost"
                onClick={() => setMode('choose')}
                className="mb-12 hover:text-cyan-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="w-10 h-10 text-cyan-500" />
                  <h1 className="text-6xl tracking-tight">Describe your vision</h1>
                </div>
                <p className="text-2xl text-slate-600 max-w-3xl">
                  AI will generate shot lists, crew schedules, equipment needs, and budgets
                </p>
              </div>

              <div className="mb-12">
                <Textarea
                  placeholder="A 60-second commercial for a tech startup. Modern office setting with natural light. 3 speaking roles, handheld camera work. Need to shoot in 2 days with same-day rough cut..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[240px] bg-white border-2 border-black/10 text-lg resize-none focus:border-cyan-500 focus:ring-cyan-500 p-6"
                  disabled={isGenerating}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setPrompt('A 60-second commercial for a tech startup. Modern office setting with natural light. 3 speaking roles, handheld camera work. Need to shoot in 2 days with same-day rough cut.')}
                  disabled={isGenerating}
                  className="text-slate-600 hover:text-cyan-600"
                >
                  Use example
                </Button>

                <Button
                  onClick={handleAIGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-12 py-7 rounded-full h-auto text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Plan
                    </>
                  )}
                </Button>
              </div>

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-8 bg-cyan-50 border-2 border-cyan-200"
                >
                  <div className="flex items-center gap-4">
                    <Loader2 className="w-6 h-6 text-cyan-600 animate-spin" />
                    <p className="text-lg">Creating your production plan...</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {mode === 'manual' && (
            <motion.div
              key="manual"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1400px] mx-auto px-8 py-20 text-center"
            >
              <Button
                variant="ghost"
                onClick={() => setMode('choose')}
                className="mb-12 hover:text-cyan-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <h1 className="text-7xl tracking-tight mb-8">
                Start with a blank canvas
              </h1>

              <p className="text-2xl text-slate-600 mb-16 max-w-3xl mx-auto">
                Build your production plan from scratch with complete creative control
              </p>

              <Button
                onClick={handleManualCreate}
                className="bg-black hover:bg-black/90 text-white px-12 py-7 rounded-full h-auto text-lg"
              >
                Create Blank Project
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
