import { useState } from 'react';
import { Project, Deliverable } from '../../lib/types';
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
import { Image, Video, CheckCircle2 } from 'lucide-react';
import EditableField from './EditableField';

interface DeliverablesProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const STATUS_CYCLE: Deliverable['status'][] = ['pending', 'in-progress', 'delivered'];

function getStatusColor(status: string) {
  switch (status) {
    case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-300 cursor-pointer';
    case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-300 cursor-pointer';
    default: return 'bg-slate-100 text-slate-600 border-slate-300 cursor-pointer';
  }
}

function getIcon(type: string) {
  if (type.toLowerCase().includes('reel') || type.toLowerCase().includes('video')) {
    return <Video className="w-5 h-5 text-purple-600" />;
  }
  return <Image className="w-5 h-5 text-purple-600" />;
}

export default function Deliverables({ project, onUpdate }: DeliverablesProps) {
  const [deliverables, setDeliverables] = useState<Deliverable[]>(() => project.deliverables);

  const update = (newDeliverables: Deliverable[]) => {
    setDeliverables(newDeliverables);
    onUpdate({ deliverables: newDeliverables });
  };

  const updateItem = (index: number, changes: Partial<Deliverable>) => {
    const d = [...deliverables];
    d[index] = { ...d[index], ...changes };
    update(d);
  };

  const cycleStatus = (index: number) => {
    const current = deliverables[index].status;
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    updateItem(index, { status: next });
  };

  const pendingCount = deliverables.filter(d => d.status === 'pending').length;
  const inProgressCount = deliverables.filter(d => d.status === 'in-progress').length;
  const deliveredCount = deliverables.filter(d => d.status === 'delivered').length;
  const totalAssets = deliverables.reduce((sum, d) => sum + d.quantity, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Deliverables</h2>
        <p className="text-slate-600 text-lg">All final assets to be delivered for this campaign</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="bg-white border-2 border-purple-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-slate-500 mb-2 font-medium">Total Assets</p>
          <p className="text-4xl font-bold text-purple-700">{totalAssets}</p>
        </Card>
        <Card className="bg-white border-2 border-slate-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-slate-500 mb-2 font-medium">Pending</p>
          <p className="text-4xl font-bold text-slate-600">{pendingCount}</p>
        </Card>
        <Card className="bg-white border-2 border-amber-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-amber-700 mb-2 font-medium">In Progress</p>
          <p className="text-4xl font-bold text-amber-600">{inProgressCount}</p>
        </Card>
        <Card className="bg-white border-2 border-emerald-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
          <p className="text-sm text-emerald-700 mb-2 font-medium">Delivered</p>
          <p className="text-4xl font-bold text-emerald-600">{deliveredCount}</p>
        </Card>
      </div>

      {/* Deliverables Table */}
      <Card className="bg-white border-2 border-purple-200/50 shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-purple-200/50 hover:bg-transparent bg-purple-50">
              <TableHead className="w-12"></TableHead>
              <TableHead className="text-slate-900 font-bold">Type</TableHead>
              <TableHead className="text-slate-900 font-bold">Dimensions</TableHead>
              <TableHead className="text-slate-900 font-bold">Platform</TableHead>
              <TableHead className="text-slate-900 font-bold">Quantity</TableHead>
              <TableHead className="text-slate-900 font-bold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliverables.map((deliverable, index) => (
              <TableRow key={deliverable.id} className="border-purple-100/50 hover:bg-purple-50/50">
                <TableCell>
                  {getIcon(deliverable.type)}
                </TableCell>
                <TableCell>
                  <EditableField
                    value={deliverable.type}
                    onChange={v => updateItem(index, { type: v })}
                    className="font-bold text-slate-900"
                  />
                </TableCell>
                <TableCell>
                  <EditableField
                    value={deliverable.dimensions}
                    onChange={v => updateItem(index, { dimensions: v })}
                    className="text-slate-700 font-mono"
                  />
                </TableCell>
                <TableCell>
                  <EditableField
                    value={deliverable.platform}
                    onChange={v => updateItem(index, { platform: v })}
                    className="text-slate-700"
                  />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={deliverable.quantity}
                    min={1}
                    onChange={e => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                    className="font-medium text-slate-900 bg-transparent outline-none border-b-2 border-transparent hover:border-purple-300 focus:border-purple-500 w-16 text-center"
                  />
                </TableCell>
                <TableCell>
                  <Badge
                    className={getStatusColor(deliverable.status)}
                    onClick={() => cycleStatus(index)}
                    title="Click to change status"
                  >
                    {deliverable.status === 'in-progress' ? 'in progress' : deliverable.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delivery Notes */}
      <Card className="bg-gradient-to-br from-purple-100 to-violet-100 border-2 border-purple-300/50 p-8 shadow-lg">
        <div className="flex items-start gap-5">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-xl">Delivery Specifications</h3>
            <ul className="text-slate-700 space-y-2 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>All images delivered as high-resolution JPG and RAW files</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Color profiles: sRGB for web, Adobe RGB for print</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Video files delivered as ProRes 422 HQ and H.264 web-optimized</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Assets organized by platform and format in cloud storage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 font-bold mt-1">•</span>
                <span>Final delivery includes usage rights documentation</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
