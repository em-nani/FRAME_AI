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
    case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-300';
    default: return 'bg-slate-100 text-slate-600 border-slate-300';
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
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Post-Production Workflow</h2>
        <p className="text-slate-600 text-lg">Timeline for editing, retouching, and final delivery</p>
      </div>

      {/* Progress */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 text-xl">Post-Production Progress</h3>
          <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-300 text-base px-4 py-2">
            {completedTasks} / {totalTasks} completed
          </Badge>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-4 shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-600 to-violet-600 h-4 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {data.timeline.map((item, index) => (
          <Card key={item.id} className="bg-white border-2 border-purple-200/50 p-6 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all">
            <div className="flex items-start gap-5">
              <div className="mt-1.5">
                <Checkbox
                  checked={item.status === 'completed'}
                  onCheckedChange={() => updateItem(index, {
                    status: item.status === 'completed' ? 'not-started' : 'completed'
                  })}
                  className="border-2 border-purple-400 w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3 gap-4">
                  <div className="flex-1 min-w-0">
                    <EditableField
                      value={item.task}
                      onChange={v => updateItem(index, { task: v })}
                      className="font-bold text-slate-900 text-lg block"
                    />
                    <EditableField
                      value={item.phase}
                      onChange={v => updateItem(index, { phase: v })}
                      className="text-sm text-purple-600 font-medium block mt-1"
                    />
                  </div>
                  <Badge
                    className={`${getStatusColor(item.status)} cursor-pointer shrink-0`}
                    onClick={() => cycleStatus(index)}
                    title="Click to change status"
                  >
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center gap-8 text-sm text-slate-600 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-medium">Due:</span>
                    <input
                      type="date"
                      value={item.deadline}
                      onChange={e => updateItem(index, { deadline: e.target.value })}
                      className="text-slate-600 bg-transparent outline-none border-b border-transparent hover:border-purple-300 focus:border-purple-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-medium">Owner:</span>
                    <EditableField
                      value={item.owner}
                      onChange={v => updateItem(index, { owner: v })}
                      className="text-slate-600"
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
