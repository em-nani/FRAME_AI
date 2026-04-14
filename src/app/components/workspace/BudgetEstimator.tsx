import { useState } from 'react';
import { Project, Budget, BudgetLineItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DollarSign } from 'lucide-react';
import EditableField from './EditableField';

interface BudgetEstimatorProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function BudgetEstimator({ project, onUpdate }: BudgetEstimatorProps) {
  const [data, setData] = useState<Budget>(() => project.budget);

  const update = (newData: Budget) => {
    setData(newData);
    onUpdate({ budget: newData });
  };

  const updateLineItem = (index: number, changes: Partial<BudgetLineItem>) => {
    const lineItems = [...data.lineItems];
    lineItems[index] = { ...lineItems[index], ...changes };
    const totalEstimate = lineItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
    update({ ...data, lineItems, totalEstimate });
  };

  const categories = Array.from(new Set(data.lineItems.map(item => item.category)));
  const groupedBudget = categories.map(category => ({
    category,
    items: data.lineItems.map((item, index) => ({ item, index })).filter(({ item }) => item.category === category),
    total: data.lineItems.filter(item => item.category === category).reduce((sum, item) => sum + item.estimatedCost, 0),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Budget Estimate</h2>
        <p className="text-zinc-500">Projected costs for this production</p>
      </div>

      {/* Total Budget */}
      <Card className="bg-zinc-900 border border-cyan-500/20 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500 mb-2">Total Estimated Budget</p>
            <p className="text-5xl font-bold text-white">${data.totalEstimate.toLocaleString()}</p>
          </div>
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
      </Card>

      {/* Category Totals */}
      <div className="grid md:grid-cols-3 gap-4">
        {groupedBudget.map(({ category, total }) => (
          <Card key={category} className="bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">{category}</p>
            <p className="text-2xl font-bold text-white">${total.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      {/* Line Items */}
      {groupedBudget.map(({ category, items, total }) => (
        <Card key={category} className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-800/50 flex items-center justify-between">
            <h3 className="font-semibold text-white">{category}</h3>
            <span className="text-lg font-bold text-white">${total.toLocaleString()}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-800/30">
                <TableHead className="text-zinc-400 font-semibold">Item</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Notes</TableHead>
                <TableHead className="text-zinc-400 font-semibold text-right">Estimated Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(({ item, index }) => (
                <TableRow key={item.id} className="border-zinc-800 hover:bg-zinc-800/40">
                  <TableCell>
                    <EditableField value={item.item} onChange={v => updateLineItem(index, { item: v })} className="font-medium text-zinc-300" />
                  </TableCell>
                  <TableCell>
                    <EditableField value={item.notes} onChange={v => updateLineItem(index, { notes: v })} className="text-zinc-500" placeholder="Add notes..." />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-zinc-500">$</span>
                      <input
                        type="number"
                        value={item.estimatedCost}
                        min={0}
                        step={100}
                        onChange={e => updateLineItem(index, { estimatedCost: parseFloat(e.target.value) || 0 })}
                        className="font-bold text-white bg-transparent outline-none border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 text-right w-28"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      ))}
    </div>
  );
}
