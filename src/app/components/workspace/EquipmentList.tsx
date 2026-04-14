import { useState } from 'react';
import { Project, EquipmentItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
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

  const categories = Array.from(new Set(equipment.map(e => e.category)));
  const groupedEquipment = categories.map(category => ({
    category,
    items: equipment.map((item, index) => ({ item, index })).filter(({ item }) => item.category === category),
  }));

  const packedCount = equipment.filter(e => e.packed).length;
  const pct = equipment.length > 0 ? (packedCount / equipment.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Equipment List</h2>
        <p className="text-zinc-500">Camera, lighting, and gear recommendations for this shoot</p>
      </div>

      {/* Packing Progress */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white text-base">Packing Checklist</h3>
          <span className="text-sm text-zinc-400">{packedCount} / {equipment.length} packed</span>
        </div>
        <div className="w-full bg-zinc-800 rounded-full h-2">
          <div
            className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </Card>

      {/* Equipment by Category */}
      {groupedEquipment.map(({ category, items }) => (
        <Card key={category} className="bg-zinc-900 border border-zinc-800 p-6">
          <h3 className="font-semibold text-white mb-5 flex items-center gap-2 text-base">
            <div className="w-7 h-7 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            {category}
          </h3>
          <div className="space-y-3">
            {items.map(({ item, index }) => (
              <div
                key={item.id}
                className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-colors"
              >
                <div className="mt-0.5">
                  <Checkbox
                    checked={item.packed}
                    onCheckedChange={checked => updateItem(index, { packed: !!checked })}
                    className="border-zinc-600 cursor-pointer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-4">
                    <EditableField
                      value={item.item}
                      onChange={v => updateItem(index, { item: v })}
                      className="font-semibold text-white"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-zinc-500">Qty</span>
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        onChange={e => updateItem(index, { quantity: parseInt(e.target.value) || 1 })}
                        className="w-14 text-center text-sm font-semibold text-zinc-300 bg-zinc-700 border border-zinc-600 rounded-lg px-2 py-1 outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <EditableField
                    value={item.notes}
                    onChange={v => updateItem(index, { notes: v })}
                    className="text-sm text-zinc-500"
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
