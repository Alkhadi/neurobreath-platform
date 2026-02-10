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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import pickerStyles from "./template-picker.module.css";

interface TemplatePickerProps {
  selection: TemplateSelection;
  orientation?: TemplateOrientation;
  onSelectionChange: (selection: TemplateSelection) => void;
  onCreateFromTemplate?: (template: Template) => void;
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

export function TemplatePicker({ selection, orientation, onSelectionChange, onCreateFromTemplate }: TemplatePickerProps) {
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
                            Create new from template
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
      </CardContent>
    </Card>
  );
}
