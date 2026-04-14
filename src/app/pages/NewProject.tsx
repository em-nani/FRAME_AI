import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ArrowLeft, Loader2, Upload, Image as ImageIcon,
  Link as LinkIcon, File, X, Paperclip, ChevronDown, ChevronUp,
  Users, Camera, DollarSign, Palette, Clock, CheckSquare
} from 'lucide-react';
import { generateProjectFromPrompt } from '../lib/ai-mock';
import { useProjects } from '../lib/project-context';
import { Attachment } from '../lib/types';

const examplePrompt = "A luxury streetwear lookbook campaign. 3 models, rooftop location, golden hour. Moody editorial with film grain aesthetic. We need 30 final images and a 60-second reel.";

const generatingSteps = [
  { icon: Palette, label: 'Moodboard & visual references' },
  { icon: Users, label: 'Call sheet & crew breakdown' },
  { icon: Camera, label: 'Shot list & locations' },
  { icon: DollarSign, label: 'Budget estimate' },
  { icon: Clock, label: 'Pre & post production timeline' },
  { icon: CheckSquare, label: 'Deliverables tracker' },
];

export default function NewProject() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratingStep(0);
    
    const stepInterval = setInterval(() => {
      setGeneratingStep(s => Math.min(s + 1, generatingSteps.length - 1));
    }, 350);

    try {
      const project = await generateProjectFromPrompt(prompt);
      project.attachments = attachments;
      addProject(project);
      clearInterval(stepInterval);
      navigate(`/workspace/${project.id}`);
    } catch (error) {
      console.error('Error generating project:', error);
      clearInterval(stepInterval);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      type: file.type.startsWith('image/') ? 'image' : 'file',
      name: file.name,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
    }));
    setAttachments([...attachments, ...newAttachments]);
    if (!showAttachments) setShowAttachments(true);
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;
    setAttachments([...attachments, {
      id: `${Date.now()}-${Math.random()}`,
      type: 'link', name: linkInput, url: linkInput,
      uploadedAt: new Date().toISOString(),
    }]);
    setLinkInput('');
  };

  const handleRemoveAttachment = (id: string) => {
    const a = attachments.find(a => a.id === id);
    if (a && a.type !== 'link') URL.revokeObjectURL(a.url);
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb < 1 ? `${(bytes / 1024).toFixed(1)} KB` : `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-4xl px-6 py-5 flex items-center justify-between">
          <Link to="/">
            <span className="text-2xl tracking-tighter text-white">FRAME</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2 text-zinc-500 hover:text-white hover:bg-zinc-800 text-sm rounded-full">
              <ArrowLeft className="w-4 h-4" />Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-700 bg-zinc-900 text-zinc-400 text-xs mb-8 tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Campaign Generator
          </div>
          <h1 className="text-6xl tracking-tighter text-white mb-5">
            Describe your <span className="text-cyan-400">campaign</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto leading-relaxed">
            Tell us about your creative vision and we'll generate a complete production plan in seconds
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-6">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">Campaign Brief</label>
          <Textarea
            placeholder="e.g., A luxury streetwear lookbook campaign. 3 models, rooftop location, golden hour. Moody editorial with film grain aesthetic..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[220px] bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-700 resize-none focus:border-cyan-600 focus:ring-0 text-base leading-relaxed rounded-xl"
            disabled={isGenerating}
          />

          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPrompt(examplePrompt)}
              disabled={isGenerating}
              className="text-xs text-zinc-600 hover:text-cyan-400 transition-colors"
            >
              Use example prompt →
            </button>
            <span className="text-xs text-zinc-700">{prompt.length} chars</span>
          </div>

          {/* Attachments */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              disabled={isGenerating}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <Paperclip className="w-4 h-4 text-zinc-600" />
                <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  Add Reference Materials
                </span>
                {attachments.length > 0 && (
                  <span className="px-2 py-0.5 bg-cyan-900/50 text-cyan-400 text-xs rounded-full border border-cyan-800">
                    {attachments.length}
                  </span>
                )}
              </div>
              {showAttachments ? <ChevronUp className="w-4 h-4 text-zinc-600" /> : <ChevronDown className="w-4 h-4 text-zinc-600" />}
            </button>

            <AnimatePresence>
              {showAttachments && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-5">
                    <p className="text-zinc-600 text-sm mb-5">Upload mood board images, reference files, or add inspiration links</p>
                    <div className="flex flex-wrap gap-3 mb-5">
                      <div>
                        <input type="file" multiple accept="image/*,application/pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" id="file-upload" disabled={isGenerating} />
                        <label htmlFor="file-upload">
                          <Button type="button" variant="outline" size="sm" className="gap-2 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white bg-transparent text-xs rounded-full cursor-pointer" disabled={isGenerating} asChild>
                            <span><Upload className="w-3.5 h-3.5" />Upload Files</span>
                          </Button>
                        </label>
                      </div>
                      <div>
                        <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" id="image-upload" disabled={isGenerating} />
                        <label htmlFor="image-upload">
                          <Button type="button" variant="outline" size="sm" className="gap-2 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white bg-transparent text-xs rounded-full cursor-pointer" disabled={isGenerating} asChild>
                            <span><ImageIcon className="w-3.5 h-3.5" />Upload Images</span>
                          </Button>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-3 mb-5">
                      <Input
                        type="url" value={linkInput}
                        onChange={(e) => setLinkInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                        placeholder="https://pinterest.com/board/..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-700 text-sm focus:border-cyan-600 rounded-full px-4"
                        disabled={isGenerating}
                      />
                      <Button onClick={handleAddLink} disabled={!linkInput.trim() || isGenerating} variant="outline" size="sm" className="gap-2 border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white bg-transparent text-xs rounded-full px-4">
                        <LinkIcon className="w-3.5 h-3.5" />Add
                      </Button>
                    </div>

                    {attachments.length > 0 && (
                      <div className="space-y-2">
                        {attachments.filter(a => a.type === 'image').length > 0 && (
                          <div className="grid grid-cols-5 gap-3 mb-4">
                            {attachments.filter(a => a.type === 'image').map(a => (
                              <div key={a.id} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950">
                                  <img src={a.url} alt={a.name} className="w-full h-full object-cover" />
                                </div>
                                <button onClick={() => handleRemoveAttachment(a.id)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {attachments.filter(a => a.type !== 'image').map(a => (
                          <div key={a.id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800 group">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                {a.type === 'link' ? <LinkIcon className="w-3.5 h-3.5 text-cyan-400" /> : <File className="w-3.5 h-3.5 text-zinc-400" />}
                              </div>
                              <span className="text-xs text-zinc-400 truncate max-w-xs">{a.name}</span>
                            </div>
                            <button onClick={() => handleRemoveAttachment(a.id)} className="w-5 h-5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Generate */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex justify-end mb-8">
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-800 disabled:text-zinc-600 px-10 py-6 h-auto text-base text-white rounded-full transition-all"
          >
            {isGenerating ? (
              <><Loader2 className="w-5 h-5 animate-spin" />Generating Your Plan...</>
            ) : (
              <><Sparkles className="w-5 h-5" />Generate Production Plan</>
            )}
          </Button>
        </motion.div>

        {/* Generating state */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-white text-sm tracking-wide">Building your production package</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {generatingSteps.map(({ icon: Icon, label }, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= generatingStep ? 1 : 0.3 }}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${i <= generatingStep ? 'bg-cyan-500' : 'bg-zinc-800'}`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className={i <= generatingStep ? 'text-white' : 'text-zinc-600'}>{label}</span>
                    {i < generatingStep && <span className="ml-auto text-cyan-400 text-xs">✓</span>}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips */}
        {!isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mt-4">
            <div className="flex items-start gap-3 mb-5">
              <Sparkles className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-400 text-xs tracking-widest uppercase">Tips for better results</span>
            </div>
            <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
              {[
                'Include the type of campaign (lookbook, commercial, editorial)',
                'Specify number of models or talent needed',
                'Describe the location and time of day',
                'Mention the aesthetic or visual style',
                'State your deliverables (images, videos, reels)',
                'Upload reference images or mood boards',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-zinc-500">
                  <span className="text-cyan-600 mt-0.5 flex-shrink-0">→</span>
                  {tip}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}