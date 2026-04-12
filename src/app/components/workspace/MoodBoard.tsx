import { Project } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';

interface MoodBoardProps {
  project: Project;
}

export default function MoodBoard({ project }: MoodBoardProps) {
  const { moodBoard } = project;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3">Mood Board</h2>
        <p className="text-slate-600 text-lg">Visual direction and aesthetic references for this campaign</p>
      </div>

      {/* Aesthetic & Keywords */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Aesthetic Direction</h3>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-slate-700 font-medium">Style:</span>
          <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-300 text-base px-4 py-2">
            {moodBoard.aesthetic}
          </Badge>
        </div>
        <div className="flex items-start gap-4">
          <span className="text-slate-700 font-medium">Keywords:</span>
          <div className="flex flex-wrap gap-3">
            {moodBoard.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="border-2 border-indigo-300 text-indigo-700 bg-indigo-50 px-3 py-1.5">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Color Palette */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Color Palette</h3>
        <div className="flex gap-4">
          {moodBoard.colorPalette.map((color, index) => (
            <div key={index} className="flex-1">
              <div
                className="w-full h-32 rounded-2xl border-4 border-white shadow-xl mb-3 transition-transform hover:scale-105"
                style={{ backgroundColor: color }}
              />
              <p className="text-sm text-slate-600 text-center font-mono font-semibold">{color}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Reference Images */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Reference Images</h3>
        <div className="grid grid-cols-3 gap-6">
          {moodBoard.images.map((image, index) => (
            <div key={index} className="aspect-square rounded-2xl overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <img
                src={image}
                alt={`Mood board reference ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}