import { useState } from 'react';
import { Project, MoodBoard as MoodBoardType } from '../../lib/types';
import { Card } from '../ui/card';
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
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Mood Board</h2>
        <p className="text-zinc-500">Visual direction and aesthetic references for this campaign</p>
      </div>

      {/* Aesthetic & Keywords */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base">Aesthetic Direction</h3>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-zinc-500 text-sm shrink-0">Style:</span>
          <span className="bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-sm text-zinc-300">
            <EditableField
              value={data.aesthetic}
              onChange={v => update({ ...data, aesthetic: v })}
              className="text-zinc-300 text-sm"
            />
          </span>
        </div>
        <div className="flex items-start gap-3 flex-wrap">
          <span className="text-zinc-500 text-sm shrink-0 mt-1">Keywords:</span>
          <div className="flex flex-wrap gap-2">
            {data.keywords.map((keyword, index) => (
              <span
                key={index}
                className="group flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 text-sm text-zinc-300"
              >
                <EditableField
                  value={keyword}
                  onChange={v => {
                    const kws = [...data.keywords];
                    kws[index] = v;
                    update({ ...data, keywords: kws });
                  }}
                  className="text-zinc-300 text-sm"
                />
                <button
                  onClick={() => removeKeyword(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 ml-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {addingKeyword ? (
              <span className="flex items-center bg-zinc-800 border border-dashed border-cyan-500/50 rounded-full px-3 py-1">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  onBlur={addKeyword}
                  onKeyDown={e => {
                    if (e.key === 'Enter') addKeyword();
                    if (e.key === 'Escape') { setNewKeyword(''); setAddingKeyword(false); }
                  }}
                  className="text-zinc-300 text-sm bg-transparent outline-none w-24"
                  placeholder="Add..."
                  autoFocus
                />
              </span>
            ) : (
              <button
                onClick={() => setAddingKeyword(true)}
                className="flex items-center gap-1 text-sm text-zinc-500 hover:text-cyan-400 border border-dashed border-zinc-700 hover:border-cyan-500/50 rounded-full px-3 py-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Color Palette */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base">Color Palette</h3>
        <div className="flex gap-4">
          {data.colorPalette.map((color, index) => (
            <div key={index} className="flex-1">
              <div
                className="w-full h-28 rounded-xl border border-zinc-700 mb-3 transition-transform hover:scale-105 cursor-pointer shadow-lg"
                style={{ backgroundColor: color }}
                onClick={() => {
                  const input = document.getElementById(`color-input-${index}`) as HTMLInputElement;
                  input?.click();
                }}
                title="Click to pick color"
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
              <EditableField
                value={color}
                onChange={v => {
                  const palette = [...data.colorPalette];
                  palette[index] = v;
                  update({ ...data, colorPalette: palette });
                }}
                className="text-xs text-zinc-500 text-center font-mono block w-full"
                placeholder="#000000"
              />
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-4">Click a swatch to open the color picker, or click the hex value to type one in.</p>
      </Card>

      {/* Reference Images */}
      <Card className="bg-zinc-900 border border-zinc-800 p-6">
        <h3 className="font-semibold text-white mb-5 text-base">Reference Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {data.images.map((image, index) => (
            <div key={index} className="aspect-square rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-colors group">
              <img
                src={image}
                alt={`Mood board reference ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
