import { Project } from '../../lib/types';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Package } from 'lucide-react';

interface EquipmentListProps {
  project: Project;
}

export default function EquipmentList({ project }: EquipmentListProps) {
  const { equipment } = project;

  // Group equipment by category
  const categories = Array.from(new Set(equipment.map(e => e.category)));
  const groupedEquipment = categories.map(category => ({
    category,
    items: equipment.filter(e => e.category === category),
  }));

  const packedCount = equipment.filter(e => e.packed).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Equipment List</h2>
        <p className="text-slate-600 text-lg">Camera, lighting, and gear recommendations for this shoot</p>
      </div>

      {/* Packing Progress */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-slate-900 text-xl">Packing Checklist</h3>
          <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-300 text-base px-4 py-2">
            {packedCount} / {equipment.length} packed
          </Badge>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-4 shadow-inner">
          <div
            className="bg-gradient-to-r from-purple-600 to-violet-600 h-4 rounded-full transition-all duration-500 shadow-lg"
            style={{ width: `${(packedCount / equipment.length) * 100}%` }}
          />
        </div>
      </Card>

      {/* Equipment by Category */}
      {groupedEquipment.map(({ category, items }) => (
        <Card key={category} className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-3 text-xl">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            {category}
          </h3>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-5 p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mt-1">
                  <Checkbox
                    checked={item.packed}
                    className="border-2 border-purple-400 w-5 h-5"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-lg">{item.item}</h4>
                    <Badge variant="outline" className="border-2 border-indigo-300 text-indigo-700 bg-indigo-50 px-3 py-1.5">
                      Qty: {item.quantity}
                    </Badge>
                  </div>
                  {item.notes && (
                    <p className="text-slate-600">{item.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
