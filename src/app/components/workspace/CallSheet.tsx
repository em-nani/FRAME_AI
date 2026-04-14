import { useState } from 'react';
import { Project, CallSheet as CallSheetType } from '../../lib/types';
import { Card } from '../ui/card';
import EditableField from './EditableField';
import { Calendar, Clock, MapPin, User, AlertCircle } from 'lucide-react';

interface CallSheetProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function CallSheet({ project, onUpdate }: CallSheetProps) {
  const [data, setData] = useState<CallSheetType>(() => project.callSheet);
  const [editingDate, setEditingDate] = useState(false);

  const update = (newData: CallSheetType) => {
    setData(newData);
    onUpdate({ callSheet: newData });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Call Sheet</h2>
        <p className="text-zinc-500">Complete production call sheet for shoot day</p>
      </div>

      {/* Shoot Details */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base">Shoot Details</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">Shoot Date</p>
              {editingDate ? (
                <input
                  type="date"
                  value={data.shootDate}
                  onChange={e => update({ ...data, shootDate: e.target.value })}
                  onBlur={() => setEditingDate(false)}
                  className="font-semibold text-white bg-transparent outline-none border-b border-cyan-500/60 w-full"
                  autoFocus
                />
              ) : (
                <p
                  className="font-semibold text-white cursor-text hover:opacity-75 transition-opacity"
                  onClick={() => setEditingDate(true)}
                  title="Click to edit"
                >
                  {new Date(data.shootDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">Call Time</p>
              <EditableField value={data.callTime} onChange={v => update({ ...data, callTime: v })} className="font-semibold text-white" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wide">Wrap Time</p>
              <EditableField value={data.wrapTime} onChange={v => update({ ...data, wrapTime: v })} className="font-semibold text-white" />
            </div>
          </div>
        </div>
      </Card>

      {/* Location */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          Location
        </h3>
        <div className="space-y-4">
          {[
            { label: 'Name', field: 'name' as const },
            { label: 'Address', field: 'address' as const },
            { label: 'Parking', field: 'parking' as const },
            { label: 'Notes', field: 'notes' as const },
          ].map(({ label, field }) => (
            <div key={field}>
              <p className="text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wide">{label}</p>
              <EditableField
                value={data.location[field]}
                onChange={v => update({ ...data, location: { ...data.location, [field]: v } })}
                className="text-zinc-300"
                multiline={field === 'notes'}
                placeholder={`Add ${label.toLowerCase()}...`}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Talent */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base">Talent</h3>
        <div className="space-y-3">
          {data.talent.map((talent, i) => (
            <div key={talent.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-zinc-700 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <EditableField
                    value={talent.role}
                    onChange={v => { const t = [...data.talent]; t[i] = { ...t[i], role: v }; update({ ...data, talent: t }); }}
                    className="font-semibold text-white block"
                  />
                  <EditableField
                    value={talent.name}
                    onChange={v => { const t = [...data.talent]; t[i] = { ...t[i], name: v }; update({ ...data, talent: t }); }}
                    className="text-zinc-400 text-sm block"
                    placeholder="Name TBD"
                  />
                </div>
              </div>
              <div className="text-right ml-4 shrink-0">
                <p className="text-xs text-zinc-500 font-medium mb-0.5">Call Time</p>
                <EditableField
                  value={talent.callTime}
                  onChange={v => { const t = [...data.talent]; t[i] = { ...t[i], callTime: v }; update({ ...data, talent: t }); }}
                  className="font-semibold text-cyan-400"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Crew */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base">Crew</h3>
        <div className="space-y-3">
          {data.crew.map((crew, i) => (
            <div key={crew.id} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50 hover:border-zinc-600 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 bg-zinc-700 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <EditableField
                    value={crew.role}
                    onChange={v => { const c = [...data.crew]; c[i] = { ...c[i], role: v }; update({ ...data, crew: c }); }}
                    className="font-semibold text-white block"
                  />
                  <EditableField
                    value={crew.name}
                    onChange={v => { const c = [...data.crew]; c[i] = { ...c[i], name: v }; update({ ...data, crew: c }); }}
                    className="text-zinc-400 text-sm block"
                    placeholder="Name TBD"
                  />
                </div>
              </div>
              <div className="text-right ml-4 shrink-0 space-y-1">
                <div>
                  <p className="text-xs text-zinc-500 font-medium mb-0.5">Call Time</p>
                  <EditableField
                    value={crew.callTime}
                    onChange={v => { const c = [...data.crew]; c[i] = { ...c[i], callTime: v }; update({ ...data, crew: c }); }}
                    className="font-semibold text-cyan-400"
                  />
                </div>
                <EditableField
                  value={crew.contact}
                  onChange={v => { const c = [...data.crew]; c[i] = { ...c[i], contact: v }; update({ ...data, crew: c }); }}
                  className="text-xs text-zinc-500"
                  placeholder="Add contact..."
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base">Schedule</h3>
        <div className="space-y-2">
          {data.schedule.map((item, i) => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
              <div className="w-20 shrink-0">
                <EditableField
                  value={item.time}
                  onChange={v => { const s = [...data.schedule]; s[i] = { ...s[i], time: v }; update({ ...data, schedule: s }); }}
                  className="font-semibold text-cyan-400"
                />
              </div>
              <div className="flex-1">
                <EditableField
                  value={item.activity}
                  onChange={v => { const s = [...data.schedule]; s[i] = { ...s[i], activity: v }; update({ ...data, schedule: s }); }}
                  className="text-zinc-300 font-medium"
                />
              </div>
              <div className="text-right shrink-0">
                <EditableField
                  value={item.location}
                  onChange={v => { const s = [...data.schedule]; s[i] = { ...s[i], location: v }; update({ ...data, schedule: s }); }}
                  className="text-sm text-zinc-500"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card className="bg-red-950/40 border border-red-900/50 p-6">
        <h3 className="font-semibold text-red-400 mb-5 text-base flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Emergency Contacts
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { label: 'Nearest Hospital', field: 'hospital' as const },
            { label: 'Police', field: 'police' as const },
            { label: 'Production Contact', field: 'contact' as const },
          ].map(({ label, field }) => (
            <div key={field}>
              <p className="text-xs text-red-500/70 mb-1 font-semibold uppercase tracking-wide">{label}</p>
              <EditableField
                value={data.emergency[field]}
                onChange={v => update({ ...data, emergency: { ...data.emergency, [field]: v } })}
                className="text-zinc-300"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
