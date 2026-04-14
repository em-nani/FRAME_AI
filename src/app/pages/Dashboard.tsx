import { Link, useNavigate } from 'react-router';
import { useProjects } from '../lib/project-context';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { motion } from 'motion/react';
import { Plus, FolderOpen, Calendar, Trash2, ExternalLink, Camera, Package, DollarSign } from 'lucide-react';

export default function Dashboard() {
  const { projects, deleteProject, setCurrentProject } = useProjects();
  const navigate = useNavigate();

  const handleOpenProject = (projectId: string) => {
    setCurrentProject(projectId);
    navigate(`/workspace/${projectId}`);
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this project?')) deleteProject(projectId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'in-progress': return 'bg-cyan-900/40 text-cyan-300 border-cyan-800';
      case 'completed': return 'bg-zinc-800 text-white border-zinc-600';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <Link to="/">
            <span className="text-2xl tracking-tighter text-white">FRAME</span>
          </Link>
          <Link to="/new-project">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-5 h-auto text-sm rounded-full">
                <Plus className="w-4 h-4" />New Project
              </Button>
            </motion.div>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-5xl tracking-tighter text-white mb-3">
            Your Projects
          </h1>
          <p className="text-zinc-500 text-base">
            {projects.length === 0
              ? 'No projects yet. Create your first production plan.'
              : `${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-center py-40 max-w-md mx-auto">
            <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-cyan-500" />
            </div>
            <h3 className="text-2xl tracking-tight text-white mb-3">No projects yet</h3>
            <p className="text-zinc-500 mb-8 leading-relaxed">Get started by creating your first AI-powered production plan. It only takes seconds.</p>
            <Link to="/new-project">
              <Button className="gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-6 h-auto text-base rounded-full">
                <Plus className="w-5 h-5" />Create Your First Project
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all cursor-pointer group overflow-hidden"
                  onClick={() => handleOpenProject(project.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-white mb-2 group-hover:text-cyan-400 transition-colors text-base tracking-tight">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-zinc-600">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(project.status)} border text-xs px-2.5 py-1 rounded-full`}>
                        {project.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-zinc-500 line-clamp-2 mb-5 leading-relaxed">{project.prompt}</p>

                    <div className="bg-zinc-950 rounded-xl p-4 mb-5 border border-zinc-800">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-1 mb-1"><Camera className="w-3 h-3 text-zinc-600" /></div>
                          <p className="text-lg font-medium text-cyan-400">{project.shotList.length}</p>
                          <p className="text-xs text-zinc-600">Shots</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 mb-1"><Package className="w-3 h-3 text-zinc-600" /></div>
                          <p className="text-lg font-medium text-cyan-400">{project.equipment.length}</p>
                          <p className="text-xs text-zinc-600">Equipment</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1 mb-1"><DollarSign className="w-3 h-3 text-zinc-600" /></div>
                          <p className="text-lg font-medium text-white">${(project.budget.totalEstimate / 1000).toFixed(0)}k</p>
                          <p className="text-xs text-zinc-600">Budget</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 bg-transparent text-xs rounded-full"
                        onClick={(e) => { e.stopPropagation(); handleOpenProject(project.id); }}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />Open Project
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        className="hover:bg-red-950/40 border border-transparent hover:border-red-900 rounded-full"
                        onClick={(e) => handleDeleteProject(project.id, e)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
