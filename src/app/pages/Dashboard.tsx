import { Link, useNavigate } from 'react-router';
import { useProjects } from '../lib/project-context';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Plus, FolderOpen, Calendar, Trash2, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const { projects, deleteProject, setCurrentProject } = useProjects();
  const navigate = useNavigate();

  const handleOpenProject = (projectId: string) => {
    setCurrentProject(projectId);
    navigate(`/workspace/${projectId}`);
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'archived':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
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
          <Link to="/new-project">
            <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/30 px-6 py-5 h-auto text-base text-white">
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            <span className="text-slate-900">Your </span>
            <span className="bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">Projects</span>
          </h1>
          <p className="text-slate-600 text-lg">
            {projects.length === 0
              ? 'No projects yet. Create your first production plan to get started.'
              : `Managing ${projects.length} ${projects.length === 1 ? 'project' : 'projects'}`}
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-32 max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg border border-slate-300">
              <FolderOpen className="w-10 h-10 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No projects yet</h3>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
              Get started by creating your first AI-powered production plan. It only takes seconds.
            </p>
            <Link to="/new-project">
              <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-600/30 px-8 py-6 h-auto text-base text-white">
                <Plus className="w-5 h-5" />
                Create Your First Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card
                key={project.id}
                className="bg-white border-2 border-slate-200 hover:border-cyan-400 hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                onClick={() => handleOpenProject(project.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors text-lg">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {new Date(project.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">
                    {project.prompt}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-4 mb-5 border border-slate-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Shots</p>
                        <p className="text-lg font-bold text-cyan-600">{project.shotList.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Equipment</p>
                        <p className="text-lg font-bold text-cyan-600">{project.equipment.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Budget</p>
                        <p className="text-lg font-bold text-orange-600">${(project.budget.totalEstimate / 1000).toFixed(0)}k</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-2 border-2 border-slate-300 text-slate-700 hover:bg-cyan-50 hover:border-cyan-400 hover:text-cyan-700 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProject(project.id);
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Project
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-red-50 border border-transparent hover:border-red-200"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}