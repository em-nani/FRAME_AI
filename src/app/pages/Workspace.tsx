import { useParams, Link, useNavigate } from 'react-router';
import { useProjects } from '../lib/project-context';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Download, 
  Users, 
  Palette,
  ClipboardList,
  Camera,
  Package,
  DollarSign,
  Film,
  CheckSquare
} from 'lucide-react';
import MoodBoard from '../components/workspace/MoodBoard';
import PreProductionTimeline from '../components/workspace/PreProductionTimeline';
import CallSheet from '../components/workspace/CallSheet';
import ShotList from '../components/workspace/ShotList';
import EquipmentList from '../components/workspace/EquipmentList';
import BudgetEstimator from '../components/workspace/BudgetEstimator';
import PostProductionTimeline from '../components/workspace/PostProductionTimeline';
import Deliverables from '../components/workspace/Deliverables';

export default function Workspace() {
  const { projectId } = useParams();
  const { currentProject, setCurrentProject } = useProjects();
  const navigate = useNavigate();

  // Set current project if coming from direct link
  if (projectId && (!currentProject || currentProject.id !== projectId)) {
    setCurrentProject(projectId);
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project not found</h2>
          <p className="text-zinc-400 mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleExportPDF = () => {
    alert('PDF export feature coming soon!');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-purple-200/50 bg-white/90 backdrop-blur-md sticky top-0 z-10 shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <span className="font-bold text-white text-lg">F</span>
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">FRAME</span>
            </Link>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-medium">
                <Users className="w-4 h-4" />
                Invite Team
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-medium" onClick={handleExportPDF}>
                <Download className="w-4 h-4" />
                Export PDF
              </Button>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-slate-700 hover:text-purple-600 font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{currentProject.name}</h1>
              <p className="text-slate-600 leading-relaxed">{currentProject.prompt}</p>
            </div>
            <Badge className={getStatusColor(currentProject.status)} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              {currentProject.status}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Tabs defaultValue="mood-board" className="w-full">
          <TabsList className="grid grid-cols-8 w-full bg-white border-2 border-purple-200/50 mb-10 p-1 shadow-md h-auto">
            <TabsTrigger 
              value="mood-board" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Mood Board</span>
            </TabsTrigger>
            <TabsTrigger 
              value="pre-production" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Pre-Prod</span>
            </TabsTrigger>
            <TabsTrigger 
              value="call-sheet" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Call Sheet</span>
            </TabsTrigger>
            <TabsTrigger 
              value="shot-list" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Shot List</span>
            </TabsTrigger>
            <TabsTrigger 
              value="equipment" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Equipment</span>
            </TabsTrigger>
            <TabsTrigger 
              value="budget" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Budget</span>
            </TabsTrigger>
            <TabsTrigger 
              value="post-production" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <Film className="w-4 h-4" />
              <span className="hidden sm:inline">Post-Prod</span>
            </TabsTrigger>
            <TabsTrigger 
              value="deliverables" 
              className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-violet-600 data-[state=active]:text-white py-3 text-sm font-medium data-[state=active]:shadow-lg"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Deliverables</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mood-board">
            <MoodBoard project={currentProject} />
          </TabsContent>

          <TabsContent value="pre-production">
            <PreProductionTimeline project={currentProject} />
          </TabsContent>

          <TabsContent value="call-sheet">
            <CallSheet project={currentProject} />
          </TabsContent>

          <TabsContent value="shot-list">
            <ShotList project={currentProject} />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentList project={currentProject} />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetEstimator project={currentProject} />
          </TabsContent>

          <TabsContent value="post-production">
            <PostProductionTimeline project={currentProject} />
          </TabsContent>

          <TabsContent value="deliverables">
            <Deliverables project={currentProject} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}