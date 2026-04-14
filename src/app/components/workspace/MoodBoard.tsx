import { useState } from 'react';
import { Project, MoodBoard as MoodBoardType } from '../../lib/types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import EditableField from './EditableField';
import { X, Plus } from 'lucide-react';

interface MoodBoardProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export default function MoodBoard({ project, onUpdate }: MoodBoardProps) {
  const [data, setData] = useState<MoodBoardType>(() => project.moodBoard);
  const [newKeyword, setNewKeyword] = useState('');
  const [addingKeyword, setAddingKeyword] = useState(false);

  const update = (newData: MoodBoardType) => {
    setData(newData);
    onUpdate({ moodBoard: newData });
  };

  const removeKeyword = (index: number) => {
    update({ ...data, keywords: data.keywords.filter((_, i) => i !== index) });
  };

  const addKeyword = () => {
    const kw = newKeyword.trim();
    if (kw && !data.keywords.includes(kw)) {
      update({ ...data, keywords: [...data.keywords, kw] });
    }
    setNewKeyword('');
    setAddingKeyword(false);
  };

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
          <span className="text-slate-700 font-medium shrink-0">Style:</span>
          <Badge className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-300 text-base px-4 py-2">
            <EditableField
              value={data.aesthetic}
              onChange={v => update({ ...data, aesthetic: v })}
              className="text-purple-700 font-medium"
            />
          </Badge>
        </div>
        <div className="flex items-start gap-4 flex-wrap">
          <span className="text-slate-700 font-medium shrink-0 mt-1">Keywords:</span>
          <div className="flex flex-wrap gap-3">
            {data.keywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-2 border-indigo-300 text-indigo-700 bg-indigo-50 px-3 py-1.5 gap-2 group"
              >
                <EditableField
                  value={keyword}
                  onChange={v => {
                    const kws = [...data.keywords];
                    kws[index] = v;
                    update({ ...data, keywords: kws });
                  }}
                  className="text-indigo-700"
                />
                <button
                  onClick={() => removeKeyword(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 hover:text-red-500"
                  title="Remove keyword"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {addingKeyword ? (
              <Badge variant="outline" className="border-2 border-dashed border-indigo-300 bg-indigo-50 px-3 py-1.5">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  onBlur={addKeyword}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addKeyword();
                    if (e.key === 'Escape') { setNewKeyword(''); setAddingKeyword(false); }
                  }}
                  className="text-indigo-700 bg-transparent outline-none w-24 text-sm"
                  placeholder="Add..."
                  autoFocus
                />
              </Badge>
            ) : (
              <button
                onClick={() => setAddingKeyword(true)}
                className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-600 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-full px-3 py-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add keyword
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Color Palette */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Color Palette</h3>
        <div className="flex gap-4">
          {data.colorPalette.map((color, index) => (
            <div key={index} className="flex-1">
              <div className="relative group">
                <div
                  className="w-full h-32 rounded-2xl border-4 border-white shadow-xl mb-3 transition-transform group-hover:scale-105 cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const input = document.getElementById(`color-input-${index}`) as HTMLInputElement;
                    input?.click();
                  }}
                />
                <input
                  id={`color-input-${index}`}
                  type="color"
                  value={color}
                  onChange={e => {
                    const palette = [...data.colorPalette];
                    palette[index] = e.target.value;
                    update({ ...data, colorPalette: palette });
                  }}
                  className="sr-only"
                />
              </div>
              <EditableField
                value={color}
                onChange={v => {
                  const palette = [...data.colorPalette];
                  palette[index] = v;
                  update({ ...data, colorPalette: palette });
                }}
                className="text-sm text-slate-600 text-center font-mono font-semibold block w-full"
                placeholder="#000000"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">Click a color swatch to open the color picker, or click the hex value to type one in.</p>
      </Card>

      {/* Reference Images */}
      <Card className="bg-white border-2 border-purple-200/50 p-8 shadow-lg">
        <h3 className="font-bold text-slate-900 mb-6 text-xl">Reference Images</h3>
        <div className="grid grid-cols-3 gap-6">
          {data.images.map((image, index) => (
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
