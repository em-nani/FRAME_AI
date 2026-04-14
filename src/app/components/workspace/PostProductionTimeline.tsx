import { useState } from 'react';
import { Project, PostProduction, PostTimelineItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Calendar, User } from 'lucide-react';
import EditableField from './EditableField';

interface PostProductionTimelineProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const STATUS_CYCLE: PostTimelineItem['status'][] = ['not-started', 'in-progress', 'completed'];

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-emerald-900/40 text-emerald-400 border-emerald-800 cursor-pointer';
    case 'in-progress': return 'bg-amber-900/40 text-amber-400 border-amber-800 cursor-pointer';
    default: return 'bg-zinc-800 text-zinc-400 border-zinc-700 cursor-pointer';
  }
}

export default function PostProductionTimeline({ project, onUpdate }: PostProductionTimelineProps) {
  const [data, setData] = useState<PostProduction>(() => project.postProduction);

  const update = (newData: PostProduction) => {
    setData(newData);
    onUpdate({ postProduction: newData });
  };

  const updateItem = (index: number, changes: Partial<PostTimelineItem>) => {
    const timeline = [...data.timeline];
    timeline[index] = { ...timeline[index], ...changes };
    update({ ...data, timeline });
  };

  const cycleStatus = (index: number) => {
    const current = data.timeline[index].status;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    updateItem(index, { status: next });
  };

  const completedTasks = data.timeline.filter(t => t.status === 'completed').length;
  const totalTasks = data.timeline.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Post-Production Workflow</h2>
        <p className="text-zinc-500">Timeline for editing, retouching, and final delivery</p>
      </div>

      {/* Progress */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white text-base">Progress</h3>
          <span className="text-sm text-zinc-400">{completedTasks} / {totalTasks} completed</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-3">
        {data.timeline.map((item, index) => (
          <Card key={item.id} className="bg-zinc-900 border border-zinc-800 p-5 hover:border-zinc-700 transition-colors">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Checkbox
                  checked={item.status === 'completed'}
                  onCheckedChange={() => updateItem(index, {
                    status: item.status === 'completed' ? 'not-started' : 'completed'
                  })}
                  className="border-zinc-600 cursor-pointer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <div className="flex-1 min-w-0">
                    <EditableField
                      value={item.task}
                      onChange={v => updateItem(index, { task: v })}
                      className="font-semibold text-white block"
                    />
                    <EditableField
                      value={item.phase}
                      onChange={v => updateItem(index, { phase: v })}
                      className="text-sm text-cyan-400 block mt-0.5"
                    />
                  </div>
                  <Badge
                    className={getStatusColor(item.status)}
                    onClick={() => cycleStatus(index)}
                    title="Click to change status"
                  >
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center gap-6 text-sm text-zinc-500 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span className="text-zinc-600">Due:</span>
                    <input
                      type="date"
                      value={item.deadline}
                      onChange={e => updateItem(index, { deadline: e.target.value })}
                      className="text-zinc-400 bg-transparent outline-none border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 cursor-pointer text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <span className="text-zinc-600">Owner:</span>
                    <EditableField
                      value={item.owner}
                      onChange={v => updateItem(index, { owner: v })}
                      className="text-zinc-400 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
