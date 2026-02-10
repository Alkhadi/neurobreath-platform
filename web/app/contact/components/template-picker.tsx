"use client";

import * as React from "react";
import { toast } from "sonner";
import Image from "next/image";

import {
  type Template,
  type TemplateSelection,
  type TemplateOrientation,
  loadTemplateManifest,
  filterTemplates,
  getTemplateThemeTokens,
  resetTemplateManifestCache,
} from "@/lib/nbcard-templates";

import { type Profile, type CardLayer, type TextLayer, type AvatarLayer, type ShapeLayer } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import pickerStyles from "./template-picker.module.css";

interface TemplatePickerProps {
  selection: TemplateSelection;
  orientation?: TemplateOrientation;
  onSelectionChange: (selection: TemplateSelection) => void;
  onCreateFromTemplate?: (template: Template) => void;
  profile?: Profile; // For Free Layout Editor
  onProfileUpdate?: (profile: Profile) => void; // For Free Layout Editor
}

const PRESET_PALETTE: Array<{ label: string; value: string; swatchClass: string }> = [
  { label: "White", value: "#FFFFFF", swatchClass: "bg-white" },
  { label: "Slate 50", value: "#F8FAFC", swatchClass: "bg-slate-50" },
  { label: "Slate 100", value: "#F1F5F9", swatchClass: "bg-slate-100" },
  { label: "Slate 200", value: "#E2E8F0", swatchClass: "bg-slate-200" },
  { label: "Slate 950", value: "#0F172A", swatchClass: "bg-slate-950" },
  { label: "Gray 900", value: "#111827", swatchClass: "bg-gray-900" },
  { label: "Blue 900", value: "#1E3A8A", swatchClass: "bg-blue-900" },
  { label: "Sky 500", value: "#0EA5E9", swatchClass: "bg-sky-500" },
  { label: "Teal 500", value: "#14B8A6", swatchClass: "bg-teal-500" },
  { label: "Emerald 500", value: "#10B981", swatchClass: "bg-emerald-500" },
  { label: "Amber 500", value: "#F59E0B", swatchClass: "bg-amber-500" },
  { label: "Orange 500", value: "#F97316", swatchClass: "bg-orange-500" },
  { label: "Red 500", value: "#EF4444", swatchClass: "bg-red-500" },
  { label: "Rose 500", value: "#F43F5E", swatchClass: "bg-rose-500" },
  { label: "Purple 500", value: "#A855F7", swatchClass: "bg-purple-500" },
  { label: "Indigo 500", value: "#6366F1", swatchClass: "bg-indigo-500" },
];

function getAspectClass(templateOrientation: TemplateOrientation) {
  return templateOrientation === "portrait" ? "aspect-[3/4]" : "aspect-video";
}

function TinyCardPreview({
  template,
  selected,
  onSelect,
}: {
  template: Template;
  selected: boolean;
  onSelect: () => void;
}) {
  const theme = getTemplateThemeTokens(template.id);
  const isPortrait = template.orientation === "portrait";
  const textClass = theme.tone === "dark" ? "text-black" : "text-white";
  const thumbFilterClass = template.id.startsWith("minimal_black_v1_")
    ? "brightness-[1.40] contrast-[0.85] saturate-[0.82]"
    : template.id.startsWith("modern_geometric_v1_")
      ? "brightness-[1.35] contrast-[0.88] saturate-[0.85]"
      : "";
  const lightenOverlayClass = template.id.startsWith("minimal_black_v1_")
    ? "bg-white/45"
    : template.id.startsWith("modern_geometric_v1_")
      ? "bg-white/35"
      : null;
  const barOpacityClass = theme.tone === "dark" ? "opacity-50" : "opacity-85";
  const blockOpacityClass = theme.tone === "dark" ? "opacity-40" : "opacity-70";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={
        "relative group rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 " +
        (selected
          ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2"
          : "border-gray-200 hover:border-purple-400")
      }
      title={template.notes || template.label}
    >
      <div className={`relative ${isPortrait ? "aspect-[3/4]" : "aspect-video"} bg-gray-100`} aria-hidden="true">
        <Image src={template.thumb} alt={template.label} fill className={`object-cover ${thumbFilterClass}`} unoptimized />

        {lightenOverlayClass ? <div className={`absolute inset-0 ${lightenOverlayClass}`} /> : null}

        {/* Orientation badge */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
          {isPortrait ? "Portrait" : "Landscape"}
        </div>

        {/* Mini layout preview (avatar + text blocks) */}
        <div className={`absolute inset-0 p-2 ${textClass}`}>
          <div className="flex flex-col items-center justify-start h-full">
            <div className={`mt-1 ${isPortrait ? "h-8 w-8" : "h-7 w-7"} rounded-full bg-white/80 border border-black/10`} />
            <div className={`mt-2 w-[75%] h-2 rounded bg-current/80 ${barOpacityClass}`} />
            <div className={`mt-1 w-[55%] h-2 rounded bg-current/70 ${blockOpacityClass}`} />
            <div className="mt-auto w-full grid grid-cols-2 gap-1">
              <div className={`h-2 rounded bg-current/60 ${blockOpacityClass}`} />
              <div className={`h-2 rounded bg-current/60 ${blockOpacityClass}`} />
              <div className={`h-2 rounded bg-current/60 ${blockOpacityClass}`} />
              <div className={`h-2 rounded bg-current/60 ${blockOpacityClass}`} />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {template.label}
        </div>

        {selected ? (
          <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ) : null}
      </div>
    </button>
  );
}

export function TemplatePicker({ selection, orientation, onSelectionChange, onCreateFromTemplate, profile, onProfileUpdate }: TemplatePickerProps) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    // Used by the custom palette swatch (no JSX inline styles).
    el.style.setProperty("--nbcard-template-custom-color", selection.backgroundColor || "#ffffff");
  }, [selection.backgroundColor]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [backgrounds, setBackgrounds] = React.useState<Template[]>([]);
  const [overlays, setOverlays] = React.useState<Template[]>([]);
  const [reloadKey, setReloadKey] = React.useState(0);

  // Free Layout Editor state
  const [editMode, setEditMode] = React.useState(false);
  const [selectedLayerId, setSelectedLayerId] = React.useState<string | null>(null);
  const [newLayerColor, setNewLayerColor] = React.useState("#A855F7");

  const reload = React.useCallback(() => {
    setError(null);
    setLoading(true);
    resetTemplateManifestCache();
    setReloadKey((k) => k + 1);
  }, []);

  const activeOrientation: TemplateOrientation = selection.orientation || orientation || "landscape";

  React.useEffect(() => {
    let cancelled = false;

    loadTemplateManifest()
      .then((manifest) => {
        if (cancelled) return;

        // Deduplicate templates by ID (defensive: manifests can be merged/extended)
        const deduped = Array.from(new Map(manifest.templates.map((t) => [t.id, t])).values());

        const allBackgrounds = filterTemplates(deduped, { type: "background" });
        const sortedBackgrounds = [...allBackgrounds].sort((a, b) => {
          const aFlyer = a.id.startsWith("flyer_promo_") ? 1 : 0;
          const bFlyer = b.id.startsWith("flyer_promo_") ? 1 : 0;
          if (aFlyer !== bFlyer) return bFlyer - aFlyer;

          const aMatch = a.orientation === activeOrientation ? 1 : 0;
          const bMatch = b.orientation === activeOrientation ? 1 : 0;
          if (aMatch !== bMatch) return bMatch - aMatch;

          // Prefer portrait slightly so flyer templates remain visible.
          if (a.orientation !== b.orientation) return a.orientation === "portrait" ? -1 : 1;

          return a.label.localeCompare(b.label);
        });

        const filteredOverlays = filterTemplates(deduped, { type: "overlay", orientation: activeOrientation });

        setBackgrounds(sortedBackgrounds);
        setOverlays(filteredOverlays);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load templates:', err);
        setError(err instanceof Error ? err.message : 'Failed to load templates');
        setLoading(false);
        toast.error('Failed to load templates');
      });

    return () => {
      cancelled = true;
    };
  }, [activeOrientation, reloadKey]);

  const handleBackgroundSelect = (templateId: string) => {
    const picked = backgrounds.find((t) => t.id === templateId);
    onSelectionChange({
      ...selection,
      backgroundId: templateId,
      orientation: picked?.orientation ?? activeOrientation,
    });
    toast.success('Background updated');
  };

  const handleOverlaySelect = (templateId: string | undefined) => {
    onSelectionChange({
      ...selection,
      overlayId: templateId,
      orientation: activeOrientation,
    });
    toast.success(templateId ? 'Overlay updated' : 'Overlay removed');
  };

  // Free Layout Editor: Layer management functions
  const addTextLayer = () => {
    if (!profile || !onProfileUpdate) return;
    const newLayer: TextLayer = {
      id: `text-${Date.now()}`,
      type: "text",
      x: 20,
      y: 20,
      w: 40,
      h: 10,
      zIndex: (profile.layers || []).length + 1,
      locked: false,
      visible: true,
      style: {
        content: "New Text",
        fontSize: 18,
        fontWeight: "normal",
        align: "left",
        color: newLayerColor,
      },
    };
    onProfileUpdate({
      ...profile,
      layers: [...(profile.layers || []), newLayer],
    });
    setSelectedLayerId(newLayer.id);
    toast.success("Text layer added");
  };

  const addShapeLayer = (shapeKind: "rect" | "circle" | "line") => {
    if (!profile || !onProfileUpdate) return;
    const newLayer: ShapeLayer = {
      id: `shape-${Date.now()}`,
      type: "shape",
      x: 30,
      y: 30,
      w: shapeKind === "line" ? 40 : 20,
      h: shapeKind === "line" ? 1 : 20,
      zIndex: (profile.layers || []).length + 1,
      locked: false,
      visible: true,
      style: {
        shapeKind,
        fill: newLayerColor,
        opacity: 1,
        cornerRadius: shapeKind === "rect" ? 4 : undefined,
      },
    };
    onProfileUpdate({
      ...profile,
      layers: [...(profile.layers || []), newLayer],
    });
    setSelectedLayerId(newLayer.id);
    toast.success(`${shapeKind} added`);
  };

  const addAvatarLayer = () => {
    if (!profile || !onProfileUpdate) return;
    const newLayer: AvatarLayer = {
      id: `avatar-${Date.now()}`,
      type: "avatar",
      x: 40,
      y: 40,
      w: 20,
      h: 20,
      zIndex: (profile.layers || []).length + 1,
      locked: false,
      visible: true,
      style: {
        src: "",
        fit: "cover",
        borderRadius: 8,
      },
    };
    onProfileUpdate({
      ...profile,
      layers: [...(profile.layers || []), newLayer],
    });
    setSelectedLayerId(newLayer.id);
    toast.success("Avatar layer added (upload image below)");
  };

  const updateLayer = (layerId: string, updates: Partial<CardLayer>) => {
    if (!profile || !onProfileUpdate) return;
    onProfileUpdate({
      ...profile,
      layers: (profile.layers || []).map((layer) =>
        layer.id === layerId ? ({ ...layer, ...updates } as CardLayer) : layer
      ),
    });
  };

  const deleteLayer = (layerId: string) => {
    if (!profile || !onProfileUpdate) return;
    onProfileUpdate({
      ...profile,
      layers: (profile.layers || []).filter((layer) => layer.id !== layerId),
    });
    setSelectedLayerId(null);
    toast.success("Layer deleted");
  };

  const selectedLayer = profile?.layers?.find((l) => l.id === selectedLayerId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>Loading templates...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription className="text-destructive">Templates failed to load. {error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              reload();
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Templates</CardTitle>
        <CardDescription>Choose a background and optional overlay for your card</CardDescription>
      </CardHeader>
      <CardContent ref={rootRef}>
        <Tabs defaultValue="backgrounds" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="backgrounds">Backgrounds ({backgrounds.length})</TabsTrigger>
            <TabsTrigger value="overlays">Overlays ({overlays.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="backgrounds" className="space-y-4">
            {backgrounds.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No backgrounds available</p>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {backgrounds.map((template) => {
                    const isSelected = selection.backgroundId === template.id;
                    return (
                      <div key={template.id} className="space-y-2">
                        <TinyCardPreview
                          template={template}
                          selected={isSelected}
                          onSelect={() => handleBackgroundSelect(template.id)}
                        />

                        {onCreateFromTemplate ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => onCreateFromTemplate(template)}
                          >
                            New
                          </Button>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-lg border bg-muted/20 p-3">
                  <div className="text-sm font-semibold">Background color</div>
                  <div className="text-xs text-muted-foreground">Pick a professional palette color or choose a custom one.</div>

                  <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Background color palette">
                    {PRESET_PALETTE.map((c) => {
                      const isActive = (selection.backgroundColor || "").toLowerCase() === c.value.toLowerCase();
                      return (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => onSelectionChange({ ...selection, backgroundColor: c.value })}
                          className={`h-8 w-8 rounded-md border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 ${
                            isActive ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2" : "border-gray-300"
                          } ${c.swatchClass}`}
                          aria-label={`Set background color to ${c.value}`}
                          title={c.label}
                        />
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        // Keep the current value; this is just the swatch to indicate custom.
                        const next = selection.backgroundColor || "#ffffff";
                        onSelectionChange({ ...selection, backgroundColor: next });
                      }}
                      className={`h-8 w-8 rounded-md border border-gray-300 ${pickerStyles.customColorSwatch} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2`}
                      aria-label="Custom background color swatch"
                      title="Custom"
                    />

                    <button
                      type="button"
                      onClick={() => onSelectionChange({ ...selection, backgroundColor: undefined })}
                      className="h-8 px-3 rounded-md border border-gray-300 text-xs font-medium hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
                      aria-label="Clear background color"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-xs font-medium" htmlFor="nbcard-template-custom-color">
                      Custom
                    </label>
                    <input
                      id="nbcard-template-custom-color"
                      type="color"
                      value={selection.backgroundColor || "#ffffff"}
                      onChange={(e) => onSelectionChange({ ...selection, backgroundColor: e.target.value })}
                      className="h-9 w-14 rounded border border-gray-300 bg-white"
                      aria-label="Choose custom background color"
                    />
                    <div className="text-xs text-muted-foreground">{selection.backgroundColor || "(not set)"}</div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="overlays" className="space-y-4">
            {overlays.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No overlays available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleOverlaySelect(undefined)}
                  className={
                    "relative group rounded-lg overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 " +
                    getAspectClass(activeOrientation) +
                    " " +
                    (!selection.overlayId
                      ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2"
                      : "border-gray-200 hover:border-purple-400")
                  }
                  title="No overlay"
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">None</span>
                  </div>
                </button>

                {overlays.map((template) => {
                  const isSelected = selection.overlayId === template.id;
                  return (
                    <TinyCardPreview
                      key={template.id}
                      template={template}
                      selected={isSelected}
                      onSelect={() => handleOverlaySelect(template.id)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* FREE LAYOUT EDITOR */}
        {profile && onProfileUpdate && (
          <div className="mt-6 rounded-lg border bg-muted/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Free Layout Editor</h3>
                <p className="text-xs text-muted-foreground">Add text, shapes, and images that you can drag and resize</p>
              </div>
              <Button
                type="button"
                variant={editMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setEditMode(!editMode);
                  if (editMode) setSelectedLayerId(null);
                }}
              >
                {editMode ? "✓ Editing" : "Edit Layout"}
              </Button>
            </div>

            {editMode && (
              <>
                <div className="grid grid-cols-4 gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={addTextLayer}>
                    + Text
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addShapeLayer("rect")}>
                    + Rect
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => addShapeLayer("circle")}>
                    + Circle
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={addAvatarLayer}>
                    + Avatar
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="layer-color" className="text-xs">
                    New Layer Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="layer-color"
                      type="color"
                      value={newLayerColor}
                      onChange={(e) => setNewLayerColor(e.target.value)}
                      className="w-20 h-9"
                    />
                    <Input
                      type="text"
                      value={newLayerColor}
                      onChange={(e) => setNewLayerColor(e.target.value)}
                      className="flex-1 text-sm"
                      placeholder="#A855F7"
                    />
                  </div>
                </div>

                {selectedLayer && (
                  <div className="mt-4 p-3 rounded border bg-background space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold">Selected: {selectedLayer.type}</h4>
                      <Button type="button" variant="destructive" size="sm" onClick={() => deleteLayer(selectedLayer.id)}>
                        Delete
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="layer-x" className="text-xs">X %</Label>
                        <Input
                          id="layer-x"
                          type="number"
                          min={0}
                          max={100}
                          value={Math.round(selectedLayer.x)}
                          onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="layer-y" className="text-xs">Y %</Label>
                        <Input
                          id="layer-y"
                          type="number"
                          min={0}
                          max={100}
                          value={Math.round(selectedLayer.y)}
                          onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="layer-w" className="text-xs">Width %</Label>
                        <Input
                          id="layer-w"
                          type="number"
                          min={5}
                          max={100}
                          value={Math.round(selectedLayer.w)}
                          onChange={(e) => updateLayer(selectedLayer.id, { w: Number(e.target.value) })}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="layer-h" className="text-xs">Height %</Label>
                        <Input
                          id="layer-h"
                          type="number"
                          min={5}
                          max={100}
                          value={Math.round(selectedLayer.h)}
                          onChange={(e) => updateLayer(selectedLayer.id, { h: Number(e.target.value) })}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    {selectedLayer.type === "text" && (
                      <>
                        <div className="space-y-1">
                          <Label htmlFor="text-content" className="text-xs">Text</Label>
                          <Input
                            id="text-content"
                            type="text"
                            value={selectedLayer.style.content}
                            onChange={(e) => updateLayer(selectedLayer.id, { style: { ...selectedLayer.style, content: e.target.value } })}
                            className="text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="text-size" className="text-xs">Font Size</Label>
                            <Input
                              id="text-size"
                              type="number"
                              min={8}
                              max={72}
                              value={selectedLayer.style.fontSize}
                              onChange={(e) => updateLayer(selectedLayer.id, { style: { ...selectedLayer.style, fontSize: Number(e.target.value) } })}
                              className="text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="text-color" className="text-xs">Color</Label>
                            <Input
                              id="text-color"
                              type="color"
                              value={selectedLayer.style.color}
                              onChange={(e) => updateLayer(selectedLayer.id, { style: { ...selectedLayer.style, color: e.target.value } })}
                              className="h-9"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {selectedLayer.type === "shape" && (
                      <>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label htmlFor="shape-fill" className="text-xs">Fill</Label>
                            <Input
                              id="shape-fill"
                              type="color"
                              value={selectedLayer.style.fill}
                              onChange={(e) => updateLayer(selectedLayer.id, { style: { ...selectedLayer.style, fill: e.target.value } })}
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="shape-opacity" className="text-xs">Opacity</Label>
                            <Slider
                              id="shape-opacity"
                              min={0}
                              max={1}
                              step={0.1}
                              value={[selectedLayer.style.opacity]}
                              onValueChange={([val]) => updateLayer(selectedLayer.id, { style: { ...selectedLayer.style, opacity: val } })}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateLayer(selectedLayer.id, { locked: !selectedLayer.locked })}
                      >
                        {selectedLayer.locked ? "🔒 Locked" : "🔓 Unlocked"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateLayer(selectedLayer.id, { visible: !selectedLayer.visible })}
                      >
                        {selectedLayer.visible ? "👁️ Visible" : "👁️‍🗨️ Hidden"}
                      </Button>
                    </div>
                  </div>
                )}

                {!selectedLayer && (profile.layers || []).length > 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Click a layer on the card to select and edit it
                  </p>
                )}

                {(profile.layers || []).length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    Add your first layer using the buttons above
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
