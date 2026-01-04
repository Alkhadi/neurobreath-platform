'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, RefreshCw, Save, Type, Palette } from 'lucide-react';

const fonts = [
  { name: 'OpenDyslexic', value: 'OpenDyslexic, sans-serif', dyslexiaFriendly: true },
  { name: 'Arial', value: 'Arial, sans-serif', dyslexiaFriendly: true },
  { name: 'Comic Sans MS', value: 'Comic Sans MS, cursive', dyslexiaFriendly: true },
  { name: 'Verdana', value: 'Verdana, sans-serif', dyslexiaFriendly: true },
  { name: 'Georgia', value: 'Georgia, serif', dyslexiaFriendly: false },
  { name: 'Times New Roman', value: 'Times New Roman, serif', dyslexiaFriendly: false },
];

const backgroundColors = [
  { name: 'White', value: '#ffffff' },
  { name: 'Cream', value: '#fffef0' },
  { name: 'Light Blue', value: '#e3f2fd' },
  { name: 'Light Green', value: '#e8f5e9' },
  { name: 'Light Yellow', value: '#fffde7' },
  { name: 'Light Gray', value: '#f5f5f5' },
];

const textColors = [
  { name: 'Black', value: '#000000' },
  { name: 'Dark Gray', value: '#424242' },
  { name: 'Dark Blue', value: '#1565c0' },
  { name: 'Dark Green', value: '#2e7d32' },
];

const sampleText = `The quick brown fox jumps over the lazy dog. Reading should be comfortable and accessible for everyone. With the right customization, text becomes easier to read and comprehend.`;

export function ReadingCustomizer() {
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [wordSpacing, setWordSpacing] = useState(0);
  const [fontFamily, setFontFamily] = useState(fonts[0].value);
  const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0].value);
  const [textColor, setTextColor] = useState(textColors[0].value);
  const [showRuler, setShowRuler] = useState(false);

  const savePreferences = () => {
    const preferences = {
      fontSize,
      lineHeight,
      letterSpacing,
      wordSpacing,
      fontFamily,
      backgroundColor,
      textColor,
      showRuler,
    };
    localStorage.setItem('dyslexia-reading-preferences', JSON.stringify(preferences));
    alert('✔️ Preferences saved!');
  };

  const loadPreferences = () => {
    const saved = localStorage.getItem('dyslexia-reading-preferences');
    if (saved) {
      const preferences = JSON.parse(saved);
      setFontSize(preferences.fontSize || 16);
      setLineHeight(preferences.lineHeight || 1.5);
      setLetterSpacing(preferences.letterSpacing || 0);
      setWordSpacing(preferences.wordSpacing || 0);
      setFontFamily(preferences.fontFamily || fonts[0].value);
      setBackgroundColor(preferences.backgroundColor || backgroundColors[0].value);
      setTextColor(preferences.textColor || textColors[0].value);
      setShowRuler(preferences.showRuler || false);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  const resetToDefaults = () => {
    setFontSize(16);
    setLineHeight(1.5);
    setLetterSpacing(0);
    setWordSpacing(0);
    setFontFamily(fonts[0].value);
    setBackgroundColor(backgroundColors[0].value);
    setTextColor(textColors[0].value);
    setShowRuler(false);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Reading Customizer
          </h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Settings Panel */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Type className="w-4 h-4" />
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Line Height: {lineHeight.toFixed(1)}</label>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Letter Spacing: {letterSpacing}px</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Word Spacing: {wordSpacing}px</label>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={wordSpacing}
                onChange={(e) => setWordSpacing(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Font Family:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.name} {font.dyslexiaFriendly ? '✅' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Background Color:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {backgroundColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBackgroundColor(color.value)}
                    className={`p-3 rounded-lg border-2 ${
                      backgroundColor === color.value ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Text Color:</label>
              <div className="grid grid-cols-2 gap-2">
                {textColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setTextColor(color.value)}
                    className={`p-3 rounded-lg border-2 ${
                      textColor === color.value ? 'border-blue-500' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  >
                    <span className="text-xs text-white">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ruler"
                checked={showRuler}
                onChange={(e) => setShowRuler(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="ruler" className="text-sm font-semibold">
                Show Reading Ruler
              </label>
            </div>

            <div className="flex gap-2">
              <Button onClick={savePreferences} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={resetToDefaults} variant="outline" className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-2">
            <label className="text-sm font-semibold">Preview:</label>
            <div
              className="p-6 rounded-lg border-2 min-h-[400px] relative overflow-hidden"
              style={{ backgroundColor }}
            >
              <div
                className="relative"
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: lineHeight,
                  letterSpacing: `${letterSpacing}px`,
                  wordSpacing: `${wordSpacing}px`,
                  fontFamily: fontFamily,
                  color: textColor,
                }}
              >
                {sampleText}
              </div>
              {showRuler && (
                <div className="absolute top-0 left-0 right-0 h-8 bg-yellow-400 opacity-40 pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>⚙️ Customize your reading experience for maximum comfort and accessibility</p>
          <p className="mt-1">✅ = Dyslexia-friendly fonts recommended</p>
        </div>
      </CardContent>
    </Card>
  );
}
