import { useState } from 'react';
import { Project, Budget, BudgetLineItem } from '../../lib/types';
import { Card } from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
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

  // Group budget items by category
  const categories = Array.from(new Set(data.lineItems.map(item => item.category)));
  const groupedBudget = categories.map(category => ({
    category,
    items: data.lineItems
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.category === category),
    total: data.lineItems
      .filter(item => item.category === category)
      .reduce((sum, item) => sum + item.estimatedCost, 0),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Budget Estimate</h2>
        <p className="text-slate-600 text-lg">Projected costs for this production</p>
      </div>

      {/* Total Budget */}
      <Card className="bg-gradient-to-br from-purple-600 to-violet-600 p-10 shadow-2xl shadow-purple-500/40">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base text-purple-100 mb-3 font-medium">Total Estimated Budget</p>
            <p className="text-6xl font-bold text-white">
              ${data.totalEstimate.toLocaleString()}
            </p>
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
        </div>
      </Card>

      {/* Budget Breakdown by Category */}
      <div className="grid md:grid-cols-3 gap-6">
        {groupedBudget.map(({ category, total }) => (
          <Card key={category} className="bg-white border-2 border-purple-200/50 p-6 shadow-lg hover:shadow-xl transition-shadow">
            <p className="text-sm text-slate-500 mb-2 font-medium">{category}</p>
            <p className="text-3xl font-bold text-purple-700">
              ${total.toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      {/* Detailed Line Items */}
      {groupedBudget.map(({ category, items, total }) => (
        <Card key={category} className="bg-white border-2 border-purple-200/50 shadow-lg overflow-hidden">
          <div className="p-6 border-b-2 border-purple-200/50 bg-purple-50">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-xl">{category}</h3>
              <p className="text-2xl font-bold text-purple-700">
                ${total.toLocaleString()}
              </p>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-purple-200/50 hover:bg-transparent bg-purple-50/50">
                <TableHead className="text-slate-900 font-bold">Item</TableHead>
                <TableHead className="text-slate-900 font-bold">Notes</TableHead>
                <TableHead className="text-slate-900 font-bold text-right">Estimated Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(({ item, index }) => (
                <TableRow key={item.id} className="border-purple-100/50 hover:bg-purple-50/50">
                  <TableCell>
                    <EditableField
                      value={item.item}
                      onChange={v => updateLineItem(index, { item: v })}
                      className="font-medium text-slate-900"
                    />
                  </TableCell>
                  <TableCell>
                    <EditableField
                      value={item.notes}
                      onChange={v => updateLineItem(index, { notes: v })}
                      className="text-slate-600"
                      placeholder="Add notes..."
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-500 font-medium">$</span>
                      <input
                        type="number"
                        value={item.estimatedCost}
                        min={0}
                        step={100}
                        onChange={e => updateLineItem(index, { estimatedCost: parseFloat(e.target.value) || 0 })}
                        className="font-bold text-slate-900 bg-transparent outline-none border-b-2 border-transparent hover:border-purple-300 focus:border-purple-500 text-right w-28"
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
