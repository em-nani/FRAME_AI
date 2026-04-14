import { useState } from 'react';
import { Project, CallSheet as CallSheetType } from '../../lib/types';
import { Card } from '../ui/card';
import EditableField from './EditableField';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  AlertCircle
} from 'lucide-react';

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
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Call Sheet</h2>
        <p className="text-slate-600 text-lg">Complete production call sheet for shoot day</p>
      </div>

      {/* Shoot Details */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Shoot Details</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-purple-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500 mb-2 font-medium">Shoot Date</p>
              {editingDate ? (
                <input
                  type="date"
                  value={data.shootDate}
                  onChange={e => update({ ...data, shootDate: e.target.value })}
                  onBlur={() => setEditingDate(false)}
                  className="font-bold text-slate-900 text-lg bg-transparent outline-none border-b-2 border-purple-400 w-full"
                  autoFocus
                />
              ) : (
                <p
                  className="font-bold text-slate-900 text-lg cursor-text hover:opacity-75 transition-opacity"
                  onClick={() => setEditingDate(true)}
                  title="Click to edit"
                >
                  {new Date(data.shootDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-purple-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500 mb-2 font-medium">Call Time</p>
              <EditableField
                value={data.callTime}
                onChange={v => update({ ...data, callTime: v })}
                className="font-bold text-slate-900 text-lg"
              />
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-purple-600 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-500 mb-2 font-medium">Wrap Time</p>
              <EditableField
                value={data.wrapTime}
                onChange={v => update({ ...data, wrapTime: v })}
                className="font-bold text-slate-900 text-lg"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Location */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl flex items-center gap-3">
          <MapPin className="w-6 h-6 text-purple-600" />
          Location
        </h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 mb-2 font-medium">Name</p>
            <EditableField
              value={data.location.name}
              onChange={v => update({ ...data, location: { ...data.location, name: v } })}
              className="text-slate-900 text-lg"
            />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-2 font-medium">Address</p>
            <EditableField
              value={data.location.address}
              onChange={v => update({ ...data, location: { ...data.location, address: v } })}
              className="text-slate-900 text-lg"
            />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-2 font-medium">Parking</p>
            <EditableField
              value={data.location.parking}
              onChange={v => update({ ...data, location: { ...data.location, parking: v } })}
              className="text-slate-900"
            />
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-2 font-medium">Notes</p>
            <EditableField
              value={data.location.notes}
              onChange={v => update({ ...data, location: { ...data.location, notes: v } })}
              className="text-slate-900"
              multiline
              placeholder="Add location notes..."
            />
          </div>
        </div>
      </Card>

      {/* Talent */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Talent</h3>
        <div className="space-y-4">
          {data.talent.map((talent, i) => (
            <div key={talent.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <EditableField
                    value={talent.role}
                    onChange={v => {
                      const t = [...data.talent];
                      t[i] = { ...t[i], role: v };
                      update({ ...data, talent: t });
                    }}
                    className="font-bold text-slate-900 text-lg block"
                  />
                  <EditableField
                    value={talent.name}
                    onChange={v => {
                      const t = [...data.talent];
                      t[i] = { ...t[i], name: v };
                      update({ ...data, talent: t });
                    }}
                    className="text-slate-600 block"
                    placeholder="Name TBD"
                  />
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm text-slate-500 font-medium">Call Time</p>
                <EditableField
                  value={talent.callTime}
                  onChange={v => {
                    const t = [...data.talent];
                    t[i] = { ...t[i], callTime: v };
                    update({ ...data, talent: t });
                  }}
                  className="font-bold text-purple-700 text-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Crew */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Crew</h3>
        <div className="space-y-4">
          {data.crew.map((crew, i) => (
            <div key={crew.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <EditableField
                    value={crew.role}
                    onChange={v => {
                      const c = [...data.crew];
                      c[i] = { ...c[i], role: v };
                      update({ ...data, crew: c });
                    }}
                    className="font-bold text-slate-900 text-lg block"
                  />
                  <EditableField
                    value={crew.name}
                    onChange={v => {
                      const c = [...data.crew];
                      c[i] = { ...c[i], name: v };
                      update({ ...data, crew: c });
                    }}
                    className="text-slate-600 block"
                    placeholder="Name TBD"
                  />
                </div>
              </div>
              <div className="text-right ml-4 space-y-1">
                <div>
                  <p className="text-sm text-slate-500 font-medium">Call Time</p>
                  <EditableField
                    value={crew.callTime}
                    onChange={v => {
                      const c = [...data.crew];
                      c[i] = { ...c[i], callTime: v };
                      update({ ...data, crew: c });
                    }}
                    className="font-bold text-indigo-700 text-lg"
                  />
                </div>
                <div>
                  <EditableField
                    value={crew.contact}
                    onChange={v => {
                      const c = [...data.crew];
                      c[i] = { ...c[i], contact: v };
                      update({ ...data, crew: c });
                    }}
                    className="text-sm text-slate-500"
                    placeholder="Add contact..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Schedule</h3>
        <div className="space-y-3">
          {data.schedule.map((item, i) => (
            <div key={item.id} className="flex items-center gap-5 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-200/50 shadow-sm">
              <div className="w-24 shrink-0">
                <EditableField
                  value={item.time}
                  onChange={v => {
                    const s = [...data.schedule];
                    s[i] = { ...s[i], time: v };
                    update({ ...data, schedule: s });
                  }}
                  className="font-bold text-purple-700 text-lg"
                />
              </div>
              <div className="flex-1">
                <EditableField
                  value={item.activity}
                  onChange={v => {
                    const s = [...data.schedule];
                    s[i] = { ...s[i], activity: v };
                    update({ ...data, schedule: s });
                  }}
                  className="text-slate-900 font-medium"
                />
              </div>
              <div className="text-right">
                <EditableField
                  value={item.location}
                  onChange={v => {
                    const s = [...data.schedule];
                    s[i] = { ...s[i], location: v };
                    update({ ...data, schedule: s });
                  }}
                  className="text-sm text-slate-600"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 p-8 shadow-lg">
        <h3 className="font-bold text-red-700 mb-6 text-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          Emergency Contacts
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-red-600 mb-2 font-semibold">Nearest Hospital</p>
            <EditableField
              value={data.emergency.hospital}
              onChange={v => update({ ...data, emergency: { ...data.emergency, hospital: v } })}
              className="text-slate-900"
            />
          </div>
          <div>
            <p className="text-sm text-red-600 mb-2 font-semibold">Police</p>
            <EditableField
              value={data.emergency.police}
              onChange={v => update({ ...data, emergency: { ...data.emergency, police: v } })}
              className="text-slate-900"
            />
          </div>
          <div>
            <p className="text-sm text-red-600 mb-2 font-semibold">Production Contact</p>
            <EditableField
              value={data.emergency.contact}
              onChange={v => update({ ...data, emergency: { ...data.emergency, contact: v } })}
              className="text-slate-900"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
