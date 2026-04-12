import { Project } from '../../lib/types';
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
import { Checkbox } from '../ui/checkbox';

interface ShotListProps {
  project: Project;
}

export default function ShotList({ project }: ShotListProps) {
  const { shotList } = project;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'captured':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const pendingShots = shotList.filter(s => s.status === 'pending').length;
  const capturedShots = shotList.filter(s => s.status === 'captured').length;
  const approvedShots = shotList.filter(s => s.status === 'approved').length;

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
          <p className="text-4xl font-bold text-purple-700">{shotList.length}</p>
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
              <TableHead className="w-12"></TableHead>
              <TableHead className="text-slate-900 font-bold">#</TableHead>
              <TableHead className="text-slate-900 font-bold">Description</TableHead>
              <TableHead className="text-slate-900 font-bold">Shot Type</TableHead>
              <TableHead className="text-slate-900 font-bold">Lens</TableHead>
              <TableHead className="text-slate-900 font-bold">Notes</TableHead>
              <TableHead className="text-slate-900 font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shotList.map((shot) => (
              <TableRow key={shot.id} className="border-purple-100/50 hover:bg-purple-50/50">
                <TableCell>
                  <Checkbox className="border-2 border-purple-400" />
                </TableCell>
                <TableCell className="font-bold text-purple-700 text-base">
                  {shot.shotNumber}
                </TableCell>
                <TableCell className="text-slate-900 font-medium">
                  {shot.description}
                </TableCell>
                <TableCell className="text-slate-700">
                  {shot.shotType}
                </TableCell>
                <TableCell className="text-slate-700 font-mono">
                  {shot.lens}
                </TableCell>
                <TableCell className="text-slate-600">
                  {shot.notes || '—'}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(shot.status)}>
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
