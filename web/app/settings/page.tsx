'use client';

import { useState } from 'react';
import { Download, Upload, RotateCcw, Settings as SettingsIcon, Accessibility, Volume2, Globe } from 'lucide-react';
import { useUserPreferencesState, useExportPreferences, useImportPreferences, useResetPreferences } from '@/lib/user-preferences/useUserPreferences';
import { useGuestPreferences } from '@/lib/user-preferences/useGuestPreferences';
import { useTTSPreferences } from '@/lib/user-preferences/useTTSPreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import type { ReadingLevel, TextSizePreference, ContrastPreference, Region } from '@/lib/user-preferences/schema';

export default function SettingsPage() {
  const { preferences, isLoaded } = useUserPreferencesState();
  const exportPreferences = useExportPreferences();
  const importPreferences = useImportPreferences();
  const resetPreferences = useResetPreferences();

  const {
    setRegionPreference,
    setReadingLevel,
    setDyslexiaMode,
    setReducedMotion,
    setTextSize,
    setContrast,
  } = useGuestPreferences();

  const {
    ttsSettings,
    setTTSEnabled,
    setAutoSpeak,
    setRate,
    setFilterNonAlphanumeric,
    setPreferUKVoice,
  } = useTTSPreferences();

  const [activeTab, setActiveTab] = useState('profile');

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    try {
      const data = exportPreferences();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neurobreath-preferences-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Preferences exported successfully');
    } catch (error) {
      toast.error('Failed to export preferences');
      console.error(error);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        importPreferences(text);
        toast.success('Preferences imported successfully');
      } catch (error) {
        toast.error('Failed to import preferences. Please check the file format.');
        console.error(error);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all preferences to defaults? This cannot be undone.')) {
      resetPreferences();
      toast.success('All preferences reset to defaults');
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8" />
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your experience. All settings are saved locally on your device.
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Manage Preferences</CardTitle>
          <CardDescription>Export, import, or reset your settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleImport} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={handleReset} variant="outline" className="text-destructive hover:bg-destructive/10">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Guest Profile</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="w-4 h-4" />
            <span className="hidden sm:inline">Accessibility</span>
            <span className="sm:hidden">A11y</span>
          </TabsTrigger>
          <TabsTrigger value="tts" className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Text-to-Speech</span>
            <span className="sm:hidden">TTS</span>
          </TabsTrigger>
        </TabsList>

        {/* Guest Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Region & Language</CardTitle>
              <CardDescription>Choose your preferred region for localized content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region Preference</Label>
                <Select
                  value={preferences.regionPreference}
                  onValueChange={(value) => setRegionPreference(value as Region)}
                >
                  <SelectTrigger id="region">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  Affects spelling, terminology, and regional resources
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reading Level</CardTitle>
              <CardDescription>Adjust content complexity to match your preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={preferences.readingLevel}
                onValueChange={(value) => setReadingLevel(value as ReadingLevel)}
              >
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="simple" id="simple" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="simple" className="font-medium cursor-pointer">
                      Simple
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Clear, concise language with shorter sentences
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="standard" id="standard" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="standard" className="font-medium cursor-pointer">
                      Standard
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Balanced approach with moderate detail
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                  <RadioGroupItem value="detailed" id="detailed" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="detailed" className="font-medium cursor-pointer">
                      Detailed
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comprehensive information with technical terms
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accessibility Tab */}
        <TabsContent value="accessibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Visual Preferences</CardTitle>
              <CardDescription>Customize how content is displayed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dyslexia">Dyslexia-Friendly Font</Label>
                  <p className="text-sm text-muted-foreground">
                    Use fonts and spacing optimized for dyslexia
                  </p>
                </div>
                <Switch
                  id="dyslexia"
                  checked={preferences.dyslexiaMode}
                  onCheckedChange={setDyslexiaMode}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="text-size">Text Size</Label>
                <Select
                  value={preferences.textSize}
                  onValueChange={(value) => setTextSize(value as TextSizePreference)}
                >
                  <SelectTrigger id="text-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="large">Large (18px)</SelectItem>
                    <SelectItem value="xlarge">Extra Large (20px)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contrast">Contrast</Label>
                <Select
                  value={preferences.contrast}
                  onValueChange={(value) => setContrast(value as ContrastPreference)}
                >
                  <SelectTrigger id="contrast">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System Default</SelectItem>
                    <SelectItem value="high">High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="reduced-motion">Reduce Motion</Label>
                  <p className="text-sm text-muted-foreground">
                    Minimize animations and transitions
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={preferences.reducedMotion === 'on'}
                  onCheckedChange={(checked) => setReducedMotion(checked ? 'on' : 'system')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Text-to-Speech Tab */}
        <TabsContent value="tts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Text-to-Speech Settings</CardTitle>
              <CardDescription>Configure audio reading preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="tts-enabled">Enable Text-to-Speech</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow content to be read aloud
                  </p>
                </div>
                <Switch
                  id="tts-enabled"
                  checked={ttsSettings?.enabled ?? false}
                  onCheckedChange={setTTSEnabled}
                />
              </div>

              {ttsSettings?.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-speak">Auto-Speak</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically read new content
                      </p>
                    </div>
                    <Switch
                      id="auto-speak"
                      checked={ttsSettings?.autoSpeak ?? false}
                      onCheckedChange={setAutoSpeak}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate">Speaking Rate: {(ttsSettings?.rate ?? 1.0).toFixed(1)}x</Label>
                    <Slider
                      id="rate"
                      min={0.8}
                      max={1.2}
                      step={0.1}
                      value={[ttsSettings?.rate ?? 1.0]}
                      onValueChange={([value]) => setRate(value)}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Adjust how fast content is read aloud
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="prefer-uk">Prefer UK Voice</Label>
                      <p className="text-sm text-muted-foreground">
                        Use British pronunciation when available
                      </p>
                    </div>
                    <Switch
                      id="prefer-uk"
                      checked={ttsSettings?.preferUKVoice ?? false}
                      onCheckedChange={setPreferUKVoice}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="filter-symbols">Filter Symbols</Label>
                      <p className="text-sm text-muted-foreground">
                        Remove emojis and decorative symbols from speech
                      </p>
                    </div>
                    <Switch
                      id="filter-symbols"
                      checked={ttsSettings?.filterNonAlphanumeric ?? true}
                      onCheckedChange={setFilterNonAlphanumeric}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Privacy Notice */}
      <Card className="mt-6 border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Privacy:</strong> All settings are stored locally on your device. We do not collect or transmit any preference data to our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
