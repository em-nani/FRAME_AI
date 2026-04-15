import { useState } from 'react';
import { Project, Budget, BudgetLineItem } from '../../lib/types';
import { Card } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DollarSign, Plus, Trash2 } from 'lucide-react';
import EditableField from './EditableField';

interface BudgetEstimatorProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2);

function CostInput({ value, onChange, placeholder = '—' }: { value: number | undefined; onChange: (v: number | undefined) => void; placeholder?: string }) {
  const display = value !== undefined ? String(value) : '';
  return (
    <div className="flex items-center justify-end gap-1">
      {(value !== undefined || display !== '') && <span className="text-zinc-500 text-sm">$</span>}
      <input
        type="number"
        value={display}
        min={0}
        step={100}
        placeholder={placeholder}
        onChange={e => {
          const raw = e.target.value;
          onChange(raw === '' ? undefined : parseFloat(raw) || 0);
        }}
        className="font-medium text-white bg-transparent outline-none border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 text-right w-24 placeholder:text-zinc-600"
      />
    </div>
  );
}

function variance(estimated: number, actual: number | undefined): React.ReactNode {
  if (actual === undefined) return <span className="text-zinc-700">—</span>;
  const diff = actual - estimated;
  if (diff === 0) return <span className="text-zinc-500">$0</span>;
  const label = `${diff > 0 ? '+' : '-'}$${Math.abs(diff).toLocaleString()}`;
  return <span className={diff > 0 ? 'text-red-400' : 'text-emerald-400'}>{label}</span>;
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

  const addLineItem = (category: string) => {
    const lineItems = [...data.lineItems, { id: newId(), category, item: '', estimatedCost: 0, notes: '' }];
    const totalEstimate = lineItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
    update({ ...data, lineItems, totalEstimate });
  };

  const deleteLineItem = (index: number) => {
    const lineItems = data.lineItems.filter((_, i) => i !== index);
    const totalEstimate = lineItems.reduce((sum, item) => sum + (item.estimatedCost || 0), 0);
    update({ ...data, lineItems, totalEstimate });
  };

  const categories = Array.from(new Set(data.lineItems.map(item => item.category)));
  const groupedBudget = categories.map(category => ({
    category,
    items: data.lineItems.map((item, index) => ({ item, index })).filter(({ item }) => item.category === category),
    estimated: data.lineItems.filter(item => item.category === category).reduce((sum, item) => sum + item.estimatedCost, 0),
    actual: (() => {
      const items = data.lineItems.filter(item => item.category === category);
      const hasActual = items.some(i => i.actualCost !== undefined);
      return hasActual ? items.reduce((sum, item) => sum + (item.actualCost ?? item.estimatedCost), 0) : undefined;
    })(),
  }));

  const totalActual = (() => {
    const hasAny = data.lineItems.some(i => i.actualCost !== undefined);
    if (!hasAny) return undefined;
    return data.lineItems.reduce((sum, item) => sum + (item.actualCost ?? item.estimatedCost), 0);
  })();

  const totalVariance = totalActual !== undefined ? totalActual - data.totalEstimate : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Budget</h2>
        <p className="text-zinc-500">Track estimated and actual spend per line item</p>
      </div>

      {/* Total Budget */}
      <Card className="bg-zinc-900 border border-cyan-500/20 p-8">
        <div className="flex items-center justify-between">
          <div className="flex gap-10">
            <div>
              <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Estimated</p>
              <p className="text-4xl font-bold text-white">${data.totalEstimate.toLocaleString()}</p>
            </div>
            {totalActual !== undefined && (
              <>
                <div className="w-px bg-zinc-800 self-stretch" />
                <div>
                  <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Actual</p>
                  <p className="text-4xl font-bold text-white">${totalActual.toLocaleString()}</p>
                </div>
                <div className="w-px bg-zinc-800 self-stretch" />
                <div>
                  <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">Variance</p>
                  <p className={`text-4xl font-bold ${totalVariance! > 0 ? 'text-red-400' : totalVariance! < 0 ? 'text-emerald-400' : 'text-zinc-400'}`}>
                    {totalVariance! > 0 ? '+' : ''}{totalVariance !== 0 ? `$${Math.abs(totalVariance!).toLocaleString()}` : '$0'}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign className="w-8 h-8 text-cyan-400" />
          </div>
        </div>
        {totalActual === undefined && (
          <p className="text-xs text-zinc-600 mt-4">Enter actual costs in the line items below to track spend vs estimate.</p>
        )}
      </Card>

      {/* Category Totals */}
      <div className="grid md:grid-cols-3 gap-4">
        {groupedBudget.map(({ category, estimated, actual }) => (
          <Card key={category} className="bg-zinc-900 border border-zinc-800 p-5">
            <p className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wide">{category}</p>
            <p className="text-2xl font-bold text-white">${estimated.toLocaleString()}</p>
            {actual !== undefined && (
              <p className="text-sm text-zinc-500 mt-1">
                Actual: <span className="text-zinc-300">${actual.toLocaleString()}</span>
              </p>
            )}
          </Card>
        ))}
      </div>

      {/* Line Items */}
      {groupedBudget.map(({ category, items, estimated }) => (
        <Card key={category} className="bg-zinc-900 border border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-800/50 flex items-center justify-between">
            <h3 className="font-semibold text-white">{category}</h3>
            <span className="text-lg font-bold text-white">${estimated.toLocaleString()}</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-800/30">
                <TableHead className="text-zinc-400 font-semibold">Item</TableHead>
                <TableHead className="text-zinc-400 font-semibold">Notes</TableHead>
                <TableHead className="text-zinc-400 font-semibold text-right">Estimated</TableHead>
                <TableHead className="text-zinc-400 font-semibold text-right">Actual</TableHead>
                <TableHead className="text-zinc-400 font-semibold text-right">Variance</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(({ item, index }) => (
                <TableRow key={item.id} className="group border-zinc-800 hover:bg-zinc-800/40">
                  <TableCell>
                    <EditableField value={item.item} onChange={v => updateLineItem(index, { item: v })} className="font-medium text-zinc-300" placeholder="Item name..." />
                  </TableCell>
                  <TableCell>
                    <EditableField value={item.notes} onChange={v => updateLineItem(index, { notes: v })} className="text-zinc-500" placeholder="Add notes..." />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-zinc-500 text-sm">$</span>
                      <input
                        type="number"
                        value={item.estimatedCost}
                        min={0}
                        step={100}
                        onChange={e => updateLineItem(index, { estimatedCost: parseFloat(e.target.value) || 0 })}
                        className="font-medium text-zinc-300 bg-transparent outline-none border-b border-transparent hover:border-zinc-600 focus:border-cyan-500 text-right w-24"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <CostInput
                      value={item.actualCost}
                      onChange={v => updateLineItem(index, { actualCost: v })}
                      placeholder="—"
                    />
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium">
                    {variance(item.estimatedCost, item.actualCost)}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => deleteLineItem(index)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-3 border-t border-zinc-800">
            <button onClick={() => addLineItem(category)} className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 border border-dashed border-zinc-700 hover:border-zinc-600 rounded-lg px-4 py-2.5 w-full transition-colors">
              <Plus className="w-4 h-4" /> Add item to {category}
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}
