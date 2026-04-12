import { Project } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Calendar, User } from 'lucide-react';

interface PostProductionTimelineProps {
  project: Project;
}

export default function PostProductionTimeline({ project }: PostProductionTimelineProps) {
  const { postProduction } = project;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const completedTasks = postProduction.timeline.filter(t => t.status === 'completed').length;
  const totalTasks = postProduction.timeline.length;

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
            style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
          />
        </div>
      </Card>

      {/* Timeline */}
      <div className="space-y-4">
        {postProduction.timeline.map((item, index) => (
          <Card key={item.id} className="bg-white border-2 border-purple-200/50 p-6 shadow-lg hover:shadow-xl hover:border-purple-400 transition-all">
            <div className="flex items-start gap-5">
              <div className="mt-1.5">
                <Checkbox
                  checked={item.status === 'completed'}
                  className="border-2 border-purple-400 w-5 h-5"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{item.task}</h3>
                    <p className="text-sm text-purple-600 font-medium">{item.phase}</p>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center gap-8 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span><span className="font-medium">Due:</span> {new Date(item.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-600" />
                    <span><span className="font-medium">Owner:</span> {item.owner}</span>
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
