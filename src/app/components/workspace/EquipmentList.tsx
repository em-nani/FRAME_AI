import { useState } from 'react';
import { Project, EquipmentItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Package } from 'lucide-react';
import EditableField from './EditableField';

interface EquipmentListProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function EquipmentList({ project, onUpdate }: EquipmentListProps) {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(() => project.equipment);

  const update = (newEquipment: EquipmentItem[]) => {
    setEquipment(newEquipment);
    onUpdate({ equipment: newEquipment });
  };

  const updateItem = (index: number, changes: Partial<EquipmentItem>) => {
    const e = [...equipment];
    e[index] = { ...e[index], ...changes };
    update(e);
  };

  // Group equipment by category
  const categories = Array.from(new Set(equipment.map(e => e.category)));
  const groupedEquipment = categories.map(category => ({
    category,
    items: equipment
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.category === category),
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
            style={{ width: `${equipment.length > 0 ? (packedCount / equipment.length) * 100 : 0}%` }}
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
            {items.map(({ item, index }) => (
              <div
                key={item.id}
                className="flex items-start gap-5 p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200/50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mt-1">
                  <Checkbox
                    checked={item.packed}
                    onCheckedChange={checked => updateItem(index, { packed: !!checked })}
                    className="border-2 border-purple-400 w-5 h-5 cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 gap-4">
                    <EditableField
                      value={item.item}
                      onChange={v => updateItem(index, { item: v })}
                      className="font-bold text-slate-900 text-lg"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm text-indigo-600 font-medium">Qty:</span>
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={e => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-16 text-center font-bold text-indigo-700 bg-indigo-50 border-2 border-indigo-200 rounded-lg px-2 py-1 outline-none focus:border-indigo-400"
                      />
                    </div>
                  </div>
                  <EditableField
                    value={item.notes}
                    onChange={v => updateItem(index, { notes: v })}
                    className="text-slate-600"
                    placeholder="Add notes..."
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
