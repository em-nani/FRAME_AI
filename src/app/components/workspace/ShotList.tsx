import { useState } from 'react';
import { Project, ShotListItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../ui/table';
import EditableField from './EditableField';

interface ShotListProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const STATUS_CYCLE: ShotListItem['status'][] = ['pending', 'captured', 'approved'];

function getStatusColor(status: string) {
  switch (status) {
    case 'approved': return 'bg-emerald-900/40 text-emerald-400 border-emerald-800 cursor-pointer';
    case 'captured': return 'bg-amber-900/40 text-amber-400 border-amber-800 cursor-pointer';
    default: return 'bg-zinc-800 text-zinc-400 border-zinc-700 cursor-pointer';
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Shot List</h2>
        <p className="text-zinc-500">Detailed breakdown of all planned shots for this campaign</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border border-zinc-800 p-5">
          <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">Total Shots</p>
          <p className="text-3xl font-bold text-white">{shots.length}</p>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800 p-5">
          <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">Pending</p>
          <p className="text-3xl font-bold text-zinc-400">{pendingShots}</p>
        </Card>
        <Card className="bg-zinc-900 border border-amber-900/40 p-5">
          <p className="text-xs text-amber-500/70 mb-1.5 font-medium uppercase tracking-wide">Captured</p>
          <p className="text-3xl font-bold text-amber-400">{capturedShots}</p>
        </Card>
        <Card className="bg-zinc-900 border border-emerald-900/40 p-5">
          <p className="text-xs text-emerald-500/70 mb-1.5 font-medium uppercase tracking-wide">Approved</p>
          <p className="text-3xl font-bold text-emerald-400">{approvedShots}</p>
        </Card>
      </div>

      {/* Shot List Table */}
      <Card className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-800/50">
              <TableHead className="text-zinc-400 font-semibold">#</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Description</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Shot Type</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Lens</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Notes</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shots.map((shot, index) => (
              <TableRow key={shot.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell className="font-bold text-cyan-400">{shot.shotNumber}</TableCell>
                <TableCell>
                  <EditableField value={shot.description} onChange={v => updateShot(index, { description: v })} className="text-zinc-300 font-medium" />
                </TableCell>
                <TableCell>
                  <EditableField value={shot.shotType} onChange={v => updateShot(index, { shotType: v })} className="text-zinc-400" />
                </TableCell>
                <TableCell>
                  <EditableField value={shot.lens} onChange={v => updateShot(index, { lens: v })} className="text-zinc-400 font-mono text-sm" />
                </TableCell>
                <TableCell>
                  <EditableField value={shot.notes} onChange={v => updateShot(index, { notes: v })} className="text-zinc-500" placeholder="Add notes..." />
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(shot.status)} onClick={() => cycleStatus(index)} title="Click to change status">
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
