import { Project } from '../../lib/types';

interface Props { project: Project }

// ─── small helpers ────────────────────────────────────────────────────────────

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4 mb-5 break-inside-avoid">
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-zinc-400 shrink-0">{title}</span>
      <div className="flex-1 h-px bg-zinc-200" />
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-0.5">{label}</p>
      <p className="text-sm text-zinc-800 leading-snug">{value || '—'}</p>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  completed:     'bg-emerald-100 text-emerald-700',
  delivered:     'bg-emerald-100 text-emerald-700',
  approved:      'bg-emerald-100 text-emerald-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  captured:      'bg-amber-100 text-amber-700',
  'not-started': 'bg-zinc-100 text-zinc-500',
  pending:       'bg-zinc-100 text-zinc-500',
  planning:      'bg-zinc-100 text-zinc-600',
};

function Pill({ status }: { status: string }) {
  const cls = STATUS_COLORS[status] ?? 'bg-zinc-100 text-zinc-500';
  return (
    <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold ${cls}`}>
      {status.replace(/-/g, ' ')}
    </span>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-400 border-b border-zinc-200">
      {children}
    </th>
  );
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={`py-1.5 pr-3 text-sm text-zinc-700 border-b border-zinc-100 align-top ${mono ? 'font-mono text-xs' : ''}`}>
      {children || '—'}
    </td>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ProjectPrint({ project }: Props) {
  const { moodBoard, callSheet, shotList, equipment, budget, preProduction, postProduction, deliverables } = project;

  const equipmentCategories = Array.from(new Set(equipment.map(e => e.category)));
  const budgetCategories    = Array.from(new Set(budget.lineItems.map(i => i.category)));

  const totalActual = budget.lineItems.some(i => i.actualCost !== undefined)
    ? budget.lineItems.reduce((s, i) => s + (i.actualCost ?? i.estimatedCost), 0)
    : undefined;

  return (
    <div className="font-sans text-zinc-900 bg-white">
      {/* Print-only global styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 1.5cm 2cm; size: A4; }
          * { -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important; }
        }
      `}} />

      {/* ── Cover ─────────────────────────────────────────────────────────── */}
      <div className="break-after-page pb-16">
        <p className="text-[11px] font-bold tracking-[0.45em] text-zinc-300 uppercase mb-10">FRAME</p>
        <h1 className="text-5xl font-bold text-zinc-900 mb-5 leading-tight">{project.name}</h1>
        <div className="flex items-center gap-3 text-sm text-zinc-500 mb-5">
          <span>{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>·</span>
          <Pill status={project.status} />
        </div>
        <p className="text-zinc-500 leading-relaxed text-sm max-w-2xl">{project.prompt}</p>
        <div className="mt-12 h-px bg-zinc-900" />

        {/* Quick summary grid */}
        <div className="mt-8 grid grid-cols-4 gap-6">
          {[
            { label: 'Shoot Date', value: new Date(callSheet.shootDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
            { label: 'Total Shots', value: String(shotList.length) },
            { label: 'Crew Members', value: String(callSheet.crew.length) },
            { label: 'Budget', value: `$${budget.totalEstimate.toLocaleString()}` },
          ].map(({ label, value }) => (
            <div key={label} className="border-t border-zinc-200 pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
              <p className="text-xl font-bold text-zinc-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Mood Board ────────────────────────────────────────────────────── */}
      <div className="break-before-page mb-12">
        <SectionHeader title="Mood Board" />
        <div className="space-y-5">
          <div className="flex gap-12">
            <Field label="Aesthetic" value={moodBoard.aesthetic} />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1.5">Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {moodBoard.keywords.map((kw, i) => (
                  <span key={i} className="text-xs bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded">{kw}</span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Color Palette</p>
            <div className="flex gap-4">
              {moodBoard.colorPalette.map((color, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded border border-zinc-200 shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono text-zinc-500">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Call Sheet ────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <SectionHeader title="Call Sheet" />
        <div className="space-y-6">
          {/* Shoot details */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <Field label="Shoot Date" value={new Date(callSheet.shootDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />
            <Field label="Call Time" value={callSheet.callTime} />
            <Field label="Wrap Time" value={callSheet.wrapTime} />
          </div>

          {/* Location */}
          <div className="break-inside-avoid">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Location</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 p-4 border border-zinc-200 rounded-lg">
              <Field label="Name"    value={callSheet.location.name} />
              <Field label="Address" value={callSheet.location.address} />
              <Field label="Parking" value={callSheet.location.parking} />
              {callSheet.location.notes && <Field label="Notes" value={callSheet.location.notes} />}
            </div>
          </div>

          {/* Talent */}
          {callSheet.talent.length > 0 && (
            <div className="break-inside-avoid">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Talent</p>
              <table className="w-full border-collapse">
                <thead><tr><Th>Role</Th><Th>Name</Th><Th>Call Time</Th><Th>Notes</Th></tr></thead>
                <tbody>
                  {callSheet.talent.map(t => (
                    <tr key={t.id}>
                      <Td>{t.role}</Td><Td>{t.name}</Td>
                      <Td>{t.callTime}</Td><Td>{t.notes}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Crew */}
          {callSheet.crew.length > 0 && (
            <div className="break-inside-avoid">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Crew</p>
              <table className="w-full border-collapse">
                <thead><tr><Th>Role</Th><Th>Name</Th><Th>Contact</Th><Th>Call Time</Th></tr></thead>
                <tbody>
                  {callSheet.crew.map(c => (
                    <tr key={c.id}>
                      <Td>{c.role}</Td><Td>{c.name}</Td>
                      <Td>{c.contact}</Td><Td>{c.callTime}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Schedule */}
          {callSheet.schedule.length > 0 && (
            <div className="break-inside-avoid">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">Schedule</p>
              <table className="w-full border-collapse">
                <thead><tr><Th>Time</Th><Th>Activity</Th><Th>Location</Th></tr></thead>
                <tbody>
                  {callSheet.schedule.map(s => (
                    <tr key={s.id}><Td>{s.time}</Td><Td>{s.activity}</Td><Td>{s.location}</Td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Emergency */}
          <div className="break-inside-avoid p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 mb-3">Emergency Contacts</p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Nearest Hospital" value={callSheet.emergency.hospital} />
              <Field label="Police"            value={callSheet.emergency.police} />
              <Field label="Production Contact" value={callSheet.emergency.contact} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Shot List ─────────────────────────────────────────────────────── */}
      <div className="break-before-page mb-12">
        <SectionHeader title="Shot List" />
        <table className="w-full border-collapse">
          <thead>
            <tr><Th>#</Th><Th>Description</Th><Th>Shot Type</Th><Th>Lens</Th><Th>Notes</Th><Th>Status</Th></tr>
          </thead>
          <tbody>
            {shotList.map(shot => (
              <tr key={shot.id} className="break-inside-avoid">
                <Td><span className="font-bold text-zinc-900">{shot.shotNumber}</span></Td>
                <Td>{shot.description}</Td>
                <Td>{shot.shotType}</Td>
                <Td mono>{shot.lens}</Td>
                <Td>{shot.notes}</Td>
                <td className="py-1.5 pr-3 border-b border-zinc-100 align-top">
                  <Pill status={shot.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Equipment ─────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <SectionHeader title="Equipment" />
        <div className="space-y-6">
          {equipmentCategories.map(category => {
            const items = equipment.filter(e => e.category === category);
            return (
              <div key={category} className="break-inside-avoid">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-2">{category}</p>
                <table className="w-full border-collapse">
                  <thead><tr><Th>Item</Th><Th>Qty</Th><Th>Notes</Th><Th>Packed</Th></tr></thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id}>
                        <Td><span className={item.packed ? 'line-through text-zinc-400' : ''}>{item.item}</span></Td>
                        <Td>{String(item.quantity)}</Td>
                        <Td>{item.notes}</Td>
                        <td className="py-1.5 pr-3 border-b border-zinc-100 text-sm">
                          {item.packed ? '✓' : '○'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Budget ────────────────────────────────────────────────────────── */}
      <div className="break-before-page mb-12">
        <SectionHeader title="Budget" />

        {/* Totals */}
        <div className={`grid gap-6 mb-6 ${totalActual !== undefined ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Estimated</p>
            <p className="text-2xl font-bold text-zinc-900">${budget.totalEstimate.toLocaleString()}</p>
          </div>
          {totalActual !== undefined && (
            <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Actual</p>
              <p className="text-2xl font-bold text-zinc-900">${totalActual.toLocaleString()}</p>
            </div>
          )}
          {totalActual !== undefined && (() => {
            const diff = totalActual - budget.totalEstimate;
            return (
              <div className={`p-4 rounded-lg border ${diff > 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Variance</p>
                <p className={`text-2xl font-bold ${diff > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {diff > 0 ? '+' : '−'}${Math.abs(diff).toLocaleString()}
                </p>
              </div>
            );
          })()}
        </div>

        {/* Line items by category */}
        <div className="space-y-6">
          {budgetCategories.map(category => {
            const items = budget.lineItems.filter(i => i.category === category);
            const catEstimate = items.reduce((s, i) => s + i.estimatedCost, 0);
            return (
              <div key={category} className="break-inside-avoid">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{category}</p>
                  <p className="text-xs font-semibold text-zinc-500">${catEstimate.toLocaleString()}</p>
                </div>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <Th>Item</Th><Th>Notes</Th>
                      <Th>Estimated</Th>
                      {items.some(i => i.actualCost !== undefined) && <><Th>Actual</Th><Th>Variance</Th></>}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const diff = item.actualCost !== undefined ? item.actualCost - item.estimatedCost : null;
                      return (
                        <tr key={item.id}>
                          <Td>{item.item}</Td>
                          <Td>{item.notes}</Td>
                          <Td>${item.estimatedCost.toLocaleString()}</Td>
                          {items.some(i => i.actualCost !== undefined) && (
                            <>
                              <Td>{item.actualCost !== undefined ? `$${item.actualCost.toLocaleString()}` : '—'}</Td>
                              <td className="py-1.5 pr-3 border-b border-zinc-100 text-sm">
                                {diff === null ? '—' : (
                                  <span className={diff > 0 ? 'text-red-600' : diff < 0 ? 'text-emerald-600' : 'text-zinc-400'}>
                                    {diff > 0 ? '+' : diff < 0 ? '−' : ''}${Math.abs(diff).toLocaleString()}
                                  </span>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Pre-Production ────────────────────────────────────────────────── */}
      <div className="break-before-page mb-12">
        <SectionHeader title="Pre-Production Timeline" />
        <table className="w-full border-collapse">
          <thead><tr><Th>Task</Th><Th>Phase</Th><Th>Deadline</Th><Th>Owner</Th><Th>Status</Th></tr></thead>
          <tbody>
            {preProduction.timeline.map(item => (
              <tr key={item.id} className="break-inside-avoid">
                <Td><span className={item.status === 'completed' ? 'line-through text-zinc-400' : 'font-medium'}>{item.task}</span></Td>
                <Td>{item.phase}</Td>
                <Td>{new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Td>
                <Td>{item.owner}</Td>
                <td className="py-1.5 pr-3 border-b border-zinc-100 align-top"><Pill status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Post-Production ───────────────────────────────────────────────── */}
      <div className="mb-12">
        <SectionHeader title="Post-Production Timeline" />
        <table className="w-full border-collapse">
          <thead><tr><Th>Task</Th><Th>Phase</Th><Th>Deadline</Th><Th>Owner</Th><Th>Status</Th></tr></thead>
          <tbody>
            {postProduction.timeline.map(item => (
              <tr key={item.id} className="break-inside-avoid">
                <Td><span className={item.status === 'completed' ? 'line-through text-zinc-400' : 'font-medium'}>{item.task}</span></Td>
                <Td>{item.phase}</Td>
                <Td>{new Date(item.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Td>
                <Td>{item.owner}</Td>
                <td className="py-1.5 pr-3 border-b border-zinc-100 align-top"><Pill status={item.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Deliverables ──────────────────────────────────────────────────── */}
      <div className="break-before-page mb-12">
        <SectionHeader title="Deliverables" />
        <table className="w-full border-collapse">
          <thead><tr><Th>Type</Th><Th>Dimensions</Th><Th>Platform</Th><Th>Qty</Th><Th>Status</Th></tr></thead>
          <tbody>
            {deliverables.map(d => (
              <tr key={d.id} className="break-inside-avoid">
                <Td><span className="font-medium">{d.type}</span></Td>
                <Td mono>{d.dimensions}</Td>
                <Td>{d.platform}</Td>
                <Td>{String(d.quantity)}</Td>
                <td className="py-1.5 pr-3 border-b border-zinc-100 align-top"><Pill status={d.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="mt-16 pt-4 border-t border-zinc-200 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="font-bold tracking-widest uppercase">FRAME</span>
          <span>{project.name} — Exported {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
}
