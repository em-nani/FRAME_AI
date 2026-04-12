import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { 
  Sparkles, 
  ArrowLeft, 
  Loader2,
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  File,
  X,
  Paperclip,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { generateProjectFromPrompt } from '../lib/ai-mock';
import { useProjects } from '../lib/project-context';
import { Attachment } from '../lib/types';

const examplePrompt = "A luxury streetwear lookbook campaign. 3 models, rooftop location, golden hour. Moody editorial with film grain aesthetic. We need 30 final images and a 60-second reel.";

export default function NewProject() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [linkInput, setLinkInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      const project = await generateProjectFromPrompt(prompt);
      // Add attachments to the project
      project.attachments = attachments;
      addProject(project);
      navigate(`/workspace/${project.id}`);
    } catch (error) {
      console.error('Error generating project:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map(file => {
      const isImage = file.type.startsWith('image/');
      const url = URL.createObjectURL(file);
      
      return {
        id: `${Date.now()}-${Math.random()}`,
        type: isImage ? 'image' : 'file',
        name: file.name,
        url: url,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      };
    });

    setAttachments([...attachments, ...newAttachments]);
    if (!showAttachments) setShowAttachments(true);
  };

  const handleAddLink = () => {
    if (!linkInput.trim()) return;

    const newLink: Attachment = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'link',
      name: linkInput,
      url: linkInput,
      uploadedAt: new Date().toISOString(),
    };

    setAttachments([...attachments, newLink]);
    setLinkInput('');
  };

  const handleRemoveAttachment = (id: string) => {
    const attachment = attachments.find(a => a.id === id);
    if (attachment && attachment.type !== 'link') {
      URL.revokeObjectURL(attachment.url);
    }
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/30">
              <span className="font-bold text-white text-lg">F</span>
            </div>
            <span className="font-bold text-2xl text-slate-900">FRAME</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2 text-slate-700 hover:text-cyan-600 font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-300 text-slate-700 text-sm mb-8 shadow-lg font-medium">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            AI Campaign Generator
          </div>
          
          <h1 className="text-6xl font-bold mb-6 tracking-tight">
            <span className="text-slate-900">Describe your </span>
            <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">campaign</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Tell us about your creative vision and we'll generate a complete production plan in seconds
          </p>
        </div>

        <Card className="bg-white border-2 border-slate-200 p-10 mb-8 shadow-xl">
          <label className="block text-base font-semibold text-slate-900 mb-4">
            Campaign Prompt
          </label>
          <Textarea
            placeholder="e.g., A luxury streetwear lookbook campaign. 3 models, rooftop location, golden hour. Moody editorial with film grain aesthetic..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[220px] bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 resize-none focus:border-cyan-400 focus:ring-cyan-400 text-base leading-relaxed"
            disabled={isGenerating}
          />

          <div className="flex items-center justify-between mt-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPrompt(examplePrompt)}
              disabled={isGenerating}
              className="text-cyan-700 hover:text-cyan-600 hover:bg-cyan-50 font-medium"
            >
              Use example prompt
            </Button>
          </div>

          {/* Collapsible Attachments Section */}
          <div className="mt-8 pt-8 border-t-2 border-slate-100">
            <button
              onClick={() => setShowAttachments(!showAttachments)}
              disabled={isGenerating}
              className="w-full flex items-center justify-between text-left group"
            >
              <div className="flex items-center gap-3">
                <Paperclip className="w-5 h-5 text-cyan-600" />
                <span className="text-base font-semibold text-slate-900">
                  Add Reference Materials (Optional)
                </span>
                {attachments.length > 0 && (
                  <span className="px-2.5 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
                    {attachments.length}
                  </span>
                )}
              </div>
              {showAttachments ? (
                <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 transition-colors" />
              )}
            </button>

            {showAttachments && (
              <div className="mt-6">
                <p className="text-slate-600 mb-6">
                  Upload mood board images, reference files, or add links to Pinterest boards, design references, or inspiration
                </p>

                {/* Upload Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*,application/pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isGenerating}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-cyan-400 font-medium cursor-pointer"
                        disabled={isGenerating}
                        asChild
                      >
                        <span>
                          <Upload className="w-4 h-4" />
                          Upload Files
                        </span>
                      </Button>
                    </label>
                  </div>

                  <div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={isGenerating}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="gap-2 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-cyan-400 font-medium cursor-pointer"
                        disabled={isGenerating}
                        asChild
                      >
                        <span>
                          <ImageIcon className="w-4 h-4" />
                          Upload Images
                        </span>
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Link Input */}
                <div className="flex gap-3 mb-6">
                  <Input
                    type="url"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                    placeholder="https://pinterest.com/board/... or any reference link"
                    className="flex-1 bg-white border-2 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-cyan-400"
                    disabled={isGenerating}
                  />
                  <Button
                    onClick={handleAddLink}
                    disabled={!linkInput.trim() || isGenerating}
                    variant="outline"
                    className="gap-2 border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-cyan-400 font-medium"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Add Link
                  </Button>
                </div>

                {/* Attachments Display */}
                {attachments.length > 0 && (
                  <div className="pt-4 border-t-2 border-slate-100">
                    {/* Image Previews */}
                    {attachments.some(a => a.type === 'image') && (
                      <div className="mb-6">
                        <p className="text-sm text-slate-600 mb-3 font-medium">Images</p>
                        <div className="grid grid-cols-4 gap-4">
                          {attachments.filter(a => a.type === 'image').map((attachment) => (
                            <div key={attachment.id} className="relative group">
                              <div className="aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-md">
                                <img
                                  src={attachment.url}
                                  alt={attachment.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                onClick={() => handleRemoveAttachment(attachment.id)}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                disabled={isGenerating}
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <p className="text-xs text-slate-600 mt-2 truncate">{attachment.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* File List */}
                    {attachments.some(a => a.type === 'file') && (
                      <div className="mb-6">
                        <p className="text-sm text-slate-600 mb-3 font-medium">Files</p>
                        <div className="space-y-2">
                          {attachments.filter(a => a.type === 'file').map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 group hover:border-cyan-400 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-9 h-9 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                  <File className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-900 truncate">{attachment.name}</p>
                                  <p className="text-xs text-slate-600">{formatFileSize(attachment.size)}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveAttachment(attachment.id)}
                                className="w-7 h-7 bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-3 flex-shrink-0"
                                disabled={isGenerating}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links List */}
                    {attachments.some(a => a.type === 'link') && (
                      <div>
                        <p className="text-sm text-slate-600 mb-3 font-medium">Links</p>
                        <div className="space-y-2">
                          {attachments.filter(a => a.type === 'link').map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl border-2 border-cyan-200 group hover:border-cyan-400 transition-colors">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-9 h-9 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                  <LinkIcon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-cyan-700 hover:text-cyan-800 truncate block"
                                  >
                                    {attachment.name}
                                  </a>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveAttachment(attachment.id)}
                                className="w-7 h-7 bg-white border-2 border-red-200 hover:border-red-400 hover:bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ml-3 flex-shrink-0"
                                disabled={isGenerating}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-end mb-8">
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="gap-2 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/30 px-10 py-7 h-auto text-lg text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Your Plan...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Production Plan
              </>
            )}
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-10 h-10 bg-cyan-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg mb-3">Tips for better results</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold mt-0.5">•</span>
                  <span>Include the type of campaign (lookbook, commercial, editorial, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold mt-0.5">•</span>
                  <span>Specify number of models/talent needed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold mt-0.5">•</span>
                  <span>Describe the location and time of day</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold mt-0.5">•</span>
                  <span>Mention the aesthetic or visual style you're going for</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold mt-0.5">•</span>
                  <span>State your deliverables (images, videos, reels, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-600 font-bold mt-0.5">•</span>
                  <span>Upload reference images or mood boards to help guide the AI</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-8 bg-white border-2 border-cyan-300 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <Loader2 className="w-6 h-6 text-cyan-600 animate-spin mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 mb-3 text-lg">AI is working on your project...</h4>
                <p className="text-slate-700 mb-4">
                  We're analyzing your prompt{attachments.length > 0 && ' and reference materials'} to generate a complete production plan:
                </p>
                <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Mood board with curated references</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Pre-production timeline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Complete call sheet</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Detailed shot list</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Equipment recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Budget estimate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Post-production workflow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-600">✓</span>
                    <span>Deliverables breakdown</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}