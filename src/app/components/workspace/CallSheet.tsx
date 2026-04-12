import { Project } from '../../lib/types';
import { Card } from '../ui/card';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  AlertCircle 
} from 'lucide-react';

interface CallSheetProps {
  project: Project;
}

export default function CallSheet({ project }: CallSheetProps) {
  const { callSheet } = project;

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
            <Calendar className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-slate-500 mb-2 font-medium">Shoot Date</p>
              <p className="font-bold text-slate-900 text-lg">
                {new Date(callSheet.shootDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-slate-500 mb-2 font-medium">Call Time</p>
              <p className="font-bold text-slate-900 text-lg">{callSheet.callTime}</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm text-slate-500 mb-2 font-medium">Wrap Time</p>
              <p className="font-bold text-slate-900 text-lg">{callSheet.wrapTime}</p>
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
            <p className="text-slate-900 text-lg">{callSheet.location.name}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-2 font-medium">Address</p>
            <p className="text-slate-900 text-lg">{callSheet.location.address}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 mb-2 font-medium">Parking</p>
            <p className="text-slate-900">{callSheet.location.parking}</p>
          </div>
          {callSheet.location.notes && (
            <div>
              <p className="text-sm text-slate-500 mb-2 font-medium">Notes</p>
              <p className="text-slate-900">{callSheet.location.notes}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Talent */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Talent</h3>
        <div className="space-y-4">
          {callSheet.talent.map((talent) => (
            <div key={talent.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border-2 border-purple-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{talent.role}</p>
                  <p className="text-slate-600">{talent.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Call Time</p>
                <p className="font-bold text-purple-700 text-lg">{talent.callTime}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Crew */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Crew</h3>
        <div className="space-y-4">
          {callSheet.crew.map((crew) => (
            <div key={crew.id} className="flex items-center justify-between p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200/50 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">{crew.role}</p>
                  <p className="text-slate-600">{crew.name || 'TBD'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 font-medium">Call Time</p>
                <p className="font-bold text-indigo-700 text-lg">{crew.callTime}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Schedule</h3>
        <div className="space-y-3">
          {callSheet.schedule.map((item) => (
            <div key={item.id} className="flex items-center gap-5 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border-2 border-violet-200/50 shadow-sm">
              <div className="w-24">
                <p className="font-bold text-purple-700 text-lg">{item.time}</p>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 font-medium">{item.activity}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600">{item.location}</p>
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
            <p className="text-slate-900">{callSheet.emergency.hospital}</p>
          </div>
          <div>
            <p className="text-sm text-red-600 mb-2 font-semibold">Police</p>
            <p className="text-slate-900">{callSheet.emergency.police}</p>
          </div>
          <div>
            <p className="text-sm text-red-600 mb-2 font-semibold">Production Contact</p>
            <p className="text-slate-900">{callSheet.emergency.contact}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
