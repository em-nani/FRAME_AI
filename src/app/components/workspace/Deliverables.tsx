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
import { Image, Video, CheckCircle2 } from 'lucide-react';

interface DeliverablesProps {
  project: Project;
}

export default function Deliverables({ project }: DeliverablesProps) {
  const { deliverables } = project;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'in-progress':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-300';
    }
  };

  const getIcon = (type: string) => {
    if (type.toLowerCase().includes('reel') || type.toLowerCase().includes('video')) {
      return <Video className="w-5 h-5 text-purple-600" />;
    }
    return <Image className="w-5 h-5 text-purple-600" />;
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
            {deliverables.map((deliverable) => (
              <TableRow key={deliverable.id} className="border-purple-100/50 hover:bg-purple-50/50">
                <TableCell>
                  {getIcon(deliverable.type)}
                </TableCell>
                <TableCell className="font-bold text-slate-900">
                  {deliverable.type}
                </TableCell>
                <TableCell className="text-slate-700 font-mono">
                  {deliverable.dimensions}
                </TableCell>
                <TableCell className="text-slate-700">
                  {deliverable.platform}
                </TableCell>
                <TableCell className="text-slate-900 font-medium">
                  {deliverable.quantity}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(deliverable.status)}>
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
