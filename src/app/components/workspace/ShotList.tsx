import { useState } from 'react';
import { Project, ShotListItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import EditableField from './EditableField';

interface ShotListProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const STATUS_CYCLE: ShotListItem['status'][] = ['pending', 'captured', 'approved'];

function getStatusColor(status: string) {
  switch (status) {
    case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-pointer';
    case 'captured': return 'bg-amber-100 text-amber-700 border-amber-300 cursor-pointer';
    default: return 'bg-slate-100 text-slate-600 border-slate-300 cursor-pointer';
  }
}

export default function ShotList({ project, onUpdate }: ShotListProps) {
  const [shots, setShots] = useState<ShotListItem[]>(() => project.shotList);

  const update = (newShots: ShotListItem[]) => {
    setShots(newShots);
    onUpdate({ shotList: newShots });
  };

  const updateShot = (index: number, changes: Partial<ShotListItem>) => {
    const s = [...shots];
    s[index] = { ...s[index], ...changes };
    update(s);
  };

  const cycleStatus = (index: number) => {
    const current = shots[index].status;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    updateShot(index, { status: next });
  };

  const pendingShots = shots.filter(s => s.status === 'pending').length;
  const capturedShots = shots.filter(s => s.status === 'captured').length;
  const approvedShots = shots.filter(s => s.status === 'approved').length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Shot List</h2>
        <p className="text-slate-600 text-lg">Detailed breakdown of all planned shots for this campaign</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-white border-2 border-purple-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-slate-500 mb-2 font-medium">Total Shots</p>
          <p className="text-4xl font-bold text-purple-700">{shots.length}</p>
        </Card>
        <Card className="bg-white border-2 border-slate-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-slate-500 mb-2 font-medium">Pending</p>
          <p className="text-4xl font-bold text-slate-600">{pendingShots}</p>
        </Card>
        <Card className="bg-white border-2 border-amber-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-amber-700 mb-2 font-medium">Captured</p>
          <p className="text-4xl font-bold text-amber-600">{capturedShots}</p>
        </Card>
        <Card className="bg-white border-2 border-emerald-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-emerald-700 mb-2 font-medium">Approved</p>
          <p className="text-4xl font-bold text-emerald-600">{approvedShots}</p>
        </Card>
      </div>

      {/* Shot List Table */}
      <Card className="bg-white border-2 border-purple-200/50 shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-purple-200/50 hover:bg-transparent bg-purple-50">
              <TableHead className="text-slate-900 font-bold">#</TableHead>
              <TableHead className="text-slate-900 font-bold">Description</TableHead>
              <TableHead className="text-slate-900 font-bold">Shot Type</TableHead>
              <TableHead className="text-slate-900 font-bold">Lens</TableHead>
              <TableHead className="text-slate-900 font-bold">Notes</TableHead>
              <TableHead className="text-slate-900 font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shots.map((shot, index) => (
              <TableRow key={shot.id} className="border-purple-100/50 hover:bg-purple-50/50">
                <TableCell className="font-bold text-purple-700 text-base">
                  {shot.shotNumber}
                </TableCell>
                <TableCell>
                  <EditableField
                    value={shot.description}
                    onChange={v => updateShot(index, { description: v })}
                    className="text-slate-900 font-medium"
                  />
                </TableCell>
                <TableCell>
                  <EditableField
                    value={shot.shotType}
                    onChange={v => updateShot(index, { shotType: v })}
                    className="text-slate-700"
                  />
                </TableCell>
                <TableCell>
                  <EditableField
                    value={shot.lens}
                    onChange={v => updateShot(index, { lens: v })}
                    className="text-slate-700 font-mono"
                  />
                </TableCell>
                <TableCell>
                  <EditableField
                    value={shot.notes}
                    onChange={v => updateShot(index, { notes: v })}
                    className="text-slate-600"
                    placeholder="Add notes..."
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    className={getStatusColor(shot.status)}
                    onClick={() => cycleStatus(index)}
                    title="Click to change status"
                  >
                    {shot.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
