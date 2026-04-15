import { useParams, Link } from 'react-router';
import { useProjects } from '../lib/project-context';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft, Download, Users, Palette,
  ClipboardList, Camera, Package, DollarSign, Film, CheckSquare,
  Save, Loader2, Clock
} from 'lucide-react';
import MoodBoard from '../components/workspace/MoodBoard';
import PreProductionTimeline from '../components/workspace/PreProductionTimeline';
import CallSheet from '../components/workspace/CallSheet';
import ShotList from '../components/workspace/ShotList';
import EquipmentList from '../components/workspace/EquipmentList';
import BudgetEstimator from '../components/workspace/BudgetEstimator';
import PostProductionTimeline from '../components/workspace/PostProductionTimeline';
import Deliverables from '../components/workspace/Deliverables';
import { useCallback, useRef, useState } from 'react';
import { Project } from '../lib/types';
import EditableField from '../components/workspace/EditableField';
import ProjectPrint from '../components/workspace/ProjectPrint';

type SaveState = 'idle' | 'pending' | 'saved';

function formatLastSaved(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (isToday) return `today at ${time}`;
  const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${label} at ${time}`;
}

export default function Workspace() {
  const { projectId } = useParams();
  const { currentProject, setCurrentProject, updateProject } = useProjects();

  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const pendingRef = useRef<Partial<Project>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  if (projectId && (!currentProject || currentProject.id !== projectId)) {
    setCurrentProject(projectId);
  }

  const handleUpdate = useCallback((updates: Partial<Project>) => {
    pendingRef.current = { ...pendingRef.current, ...updates };
    setSaveState('pending');

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (!currentProject) return;
      const now = new Date();
      updateProject(currentProject.id, {
        ...pendingRef.current,
        lastSaved: now.toISOString(),
      });
      pendingRef.current = {};
      setLastSaved(now);
      setSaveState('saved');
      setTimeout(() => setSaveState('idle'), 3000);
    }, 1500);
  }, [currentProject, updateProject]);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl tracking-tight text-white mb-2">Project not found</h2>
          <p className="text-zinc-500 mb-6">The project you're looking for doesn't exist.</p>
          <Link to="/dashboard">
            <Button className="bg-cyan-500 hover:bg-cyan-400 text-white rounded-full">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleExportPDF = () => window.print();

  const PROJECT_STATUS_CYCLE: Project['status'][] = ['planning', 'in-progress', 'completed'];

  const cycleProjectStatus = () => {
    const current = currentProject.status;
    const next = PROJECT_STATUS_CYCLE[(PROJECT_STATUS_CYCLE.indexOf(current) + 1) % PROJECT_STATUS_CYCLE.length];
    handleUpdate({ status: next });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-zinc-800 text-zinc-300 border-zinc-700';
      case 'in-progress': return 'bg-cyan-900/40 text-cyan-300 border-cyan-800';
      case 'completed': return 'bg-emerald-900/40 text-emerald-300 border-emerald-800';
      default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const tabs = [
    { value: 'mood-board', icon: Palette, label: 'Mood Board' },
    { value: 'pre-production', icon: ClipboardList, label: 'Pre-Prod' },
    { value: 'call-sheet', icon: Users, label: 'Call Sheet' },
    { value: 'shot-list', icon: Camera, label: 'Shot List' },
    { value: 'equipment', icon: Package, label: 'Equipment' },
    { value: 'budget', icon: DollarSign, label: 'Budget' },
    { value: 'post-production', icon: Film, label: 'Post-Prod' },
    { value: 'deliverables', icon: CheckSquare, label: 'Deliverables' },
  ];

  return (
    <>
    <div className="hidden print:block"><ProjectPrint project={currentProject} /></div>
    <div className="min-h-screen bg-zinc-950 print:hidden">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-black/90 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <Link to="/" className="flex items-center gap-3">
              <span className="text-2xl tracking-tighter text-white">FRAME</span>
            </Link>
            <div className="flex items-center gap-4">
              {/* Autosave indicator */}
              <div className="flex items-center gap-2 text-xs min-w-[140px] justify-end">
                {saveState === 'pending' && (
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Saving...
                  </span>
                )}
                {saveState === 'saved' && lastSaved && (
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Save className="w-3 h-3" />
                    Saved {formatLastSaved(lastSaved)}
                  </span>
                )}
                {saveState === 'idle' && lastSaved && (
                  <span className="flex items-center gap-1.5 text-zinc-600">
                    <Clock className="w-3 h-3" />
                    Saved {formatLastSaved(lastSaved)}
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" className="gap-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white bg-transparent text-sm rounded-full">
                <Users className="w-4 h-4" />Invite Team
              </Button>
              <Button variant="outline" size="sm" className="gap-2 border border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white bg-transparent text-sm rounded-full" onClick={handleExportPDF}>
                <Download className="w-4 h-4" />Export PDF
              </Button>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 text-zinc-500 hover:text-white hover:bg-zinc-800 text-sm rounded-full">
                  <ArrowLeft className="w-4 h-4" />Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <h1 className="text-3xl tracking-tight text-white mb-2">
                <EditableField
                  value={currentProject.name}
                  onChange={v => handleUpdate({ name: v })}
                  className="text-3xl tracking-tight text-white"
                />
              </h1>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                <EditableField
                  value={currentProject.prompt}
                  onChange={v => handleUpdate({ prompt: v })}
                  className="text-zinc-500 text-sm leading-relaxed"
                  multiline
                />
              </p>
            </div>
            <Badge
              onClick={cycleProjectStatus}
              className={`${getStatusColor(currentProject.status)} border text-xs px-3 py-1.5 rounded-full cursor-pointer hover:opacity-80 transition-opacity`}
              title="Click to change status"
            >
              {currentProject.status}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Tabs defaultValue="mood-board" className="w-full">
          <TabsList className="flex w-full bg-zinc-900 border border-zinc-800 mb-10 p-1 h-auto gap-1 rounded-2xl overflow-x-auto">
            {tabs.map(({ value, icon: Icon, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:text-black text-zinc-500 hover:text-zinc-300 py-3 text-xs font-medium rounded-xl transition-all data-[state=active]:shadow-none min-w-fit px-4"
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="mood-board"><MoodBoard project={currentProject} onUpdate={handleUpdate} /></TabsContent>
          <TabsContent value="pre-production"><PreProductionTimeline project={currentProject} onUpdate={handleUpdate} /></TabsContent>
          <TabsContent value="call-sheet"><CallSheet project={currentProject} onUpdate={handleUpdate} /></TabsContent>
          <TabsContent value="shot-list"><ShotList project={currentProject} onUpdate={handleUpdate} /></TabsContent>
          <TabsContent value="equipment"><EquipmentList project={currentProject} onUpdate={handleUpdate} /></TabsContent>
          <TabsContent value="budget"><BudgetEstimator project={currentProject} onUpdate={handleUpdate} /></TabsContent>
          <TabsContent value="post-production"><PostProductionTimeline project={currentProject} onUpdate={handleUpdate} /></TabsContent>
          <TabsContent value="deliverables"><Deliverables project={currentProject} onUpdate={handleUpdate} /></TabsContent>
        </Tabs>
      </main>
    </div>
    </>
  );
}
