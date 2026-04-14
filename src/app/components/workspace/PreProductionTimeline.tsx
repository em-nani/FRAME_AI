import { useState } from 'react';
import { Project, PreProduction, TimelineItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Calendar, User } from 'lucide-react';
import EditableField from './EditableField';

interface PreProductionTimelineProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const STATUS_CYCLE: TimelineItem['status'][] = ['not-started', 'in-progress', 'completed'];

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-300';
    default: return 'bg-slate-100 text-slate-600 border-slate-300';
  }
}

export default function PreProductionTimeline({ project, onUpdate }: PreProductionTimelineProps) {
  const [data, setData] = useState<PreProduction>(() => project.preProduction);

  const update = (newData: PreProduction) => {
    setData(newData);
    onUpdate({ preProduction: newData });
  };

  const updateItem = (index: number, changes: Partial<TimelineItem>) => {
    const timeline = [...data.timeline];
    timeline[index] = { ...timeline[index], ...changes };
    update({ ...data, timeline });
  };

  const cycleStatus = (index: number) => {
    const current = data.timeline[index].status;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    updateItem(index, { status: next });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Pre-Production Timeline</h2>
        <p className="text-slate-600 text-lg">Tasks and milestones leading up to the shoot</p>
      </div>

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
