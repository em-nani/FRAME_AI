import { useState } from 'react';
import { Project, Deliverable } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Image, Video, CheckCircle2 } from 'lucide-react';
import EditableField from './EditableField';

interface DeliverablesProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const STATUS_CYCLE: Deliverable['status'][] = ['pending', 'in-progress', 'delivered'];

function getStatusColor(status: string) {
  switch (status) {
    case 'delivered': return 'bg-emerald-900/40 text-emerald-400 border-emerald-800 cursor-pointer';
    case 'in-progress': return 'bg-amber-900/40 text-amber-400 border-amber-800 cursor-pointer';
    default: return 'bg-zinc-800 text-zinc-400 border-zinc-700 cursor-pointer';
  }
}

function getIcon(type: string) {
  if (type.toLowerCase().includes('reel') || type.toLowerCase().includes('video')) {
    return <Video className="w-4 h-4 text-zinc-500" />;
  }
  return <Image className="w-4 h-4 text-zinc-500" />;
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Deliverables</h2>
        <p className="text-zinc-500">All final assets to be delivered for this campaign</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-zinc-900 border border-zinc-800 p-5">
          <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">Total Assets</p>
          <p className="text-3xl font-bold text-white">{totalAssets}</p>
        </Card>
        <Card className="bg-zinc-900 border border-zinc-800 p-5">
          <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">Pending</p>
          <p className="text-3xl font-bold text-zinc-400">{pendingCount}</p>
        </Card>
        <Card className="bg-zinc-900 border border-amber-900/40 p-5">
          <p className="text-xs text-amber-500/70 mb-1.5 font-medium uppercase tracking-wide">In Progress</p>
          <p className="text-3xl font-bold text-amber-400">{inProgressCount}</p>
        </Card>
        <Card className="bg-zinc-900 border border-emerald-900/40 p-5">
          <p className="text-xs text-emerald-500/70 mb-1.5 font-medium uppercase tracking-wide">Delivered</p>
          <p className="text-3xl font-bold text-emerald-400">{deliveredCount}</p>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-800/50">
              <TableHead className="w-10"></TableHead>
              <TableHead className="text-zinc-400 font-semibold">Type</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Dimensions</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Platform</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Quantity</TableHead>
              <TableHead className="text-zinc-400 font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliverables.map((deliverable, index) => (
              <TableRow key={deliverable.id} className="border-zinc-800 hover:bg-zinc-800/40">
                <TableCell>{getIcon(deliverable.type)}</TableCell>
                <TableCell>
                  <EditableField value={deliverable.type} onChange={v => updateItem(index, { type: v })} className="font-semibold text-zinc-300" />
                </TableCell>
                <TableCell>
                  <EditableField value={deliverable.dimensions} onChange={v => updateItem(index, { dimensions: v })} className="text-zinc-400 font-mono text-sm" />
                </TableCell>
                <TableCell>
                  <EditableField value={deliverable.platform} onChange={v => updateItem(index, { platform: v })} className="text-zinc-400" />
                </TableCell>
                <TableCell>
                  <input
                    type="number"
                    value={deliverable.quantity}
                    min={1}
                    onChange={e => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                    className="font-medium text-zinc-300 bg-transparent outline-none border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 w-16 text-center"
                  />
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(deliverable.status)} onClick={() => cycleStatus(index)} title="Click to change status">
                    {deliverable.status === 'in-progress' ? 'in progress' : deliverable.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delivery Specs */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-3 text-base">Delivery Specifications</h3>
            <ul className="text-zinc-500 space-y-2 text-sm leading-relaxed">
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>All images delivered as high-resolution JPG and RAW files</span></li>
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>Color profiles: sRGB for web, Adobe RGB for print</span></li>
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>Video files delivered as ProRes 422 HQ and H.264 web-optimized</span></li>
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>Assets organized by platform and format in cloud storage</span></li>
              <li className="flex items-start gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>Final delivery includes usage rights documentation</span></li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
