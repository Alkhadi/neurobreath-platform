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
} from "@/lib/nbcard-templates";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemplatePickerProps {
  selection: TemplateSelection;
  orientation?: TemplateOrientation;
  onSelectionChange: (selection: TemplateSelection) => void;
  onCreateFromTemplate?: (template: Template) => void;
}

export function TemplatePicker({ selection, orientation, onSelectionChange, onCreateFromTemplate }: TemplatePickerProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [backgrounds, setBackgrounds] = React.useState<Template[]>([]);
  const [overlays, setOverlays] = React.useState<Template[]>([]);
  const [retryToken, setRetryToken] = React.useState(0);

  const activeOrientation: TemplateOrientation = selection.orientation || orientation || "landscape";

  const getAspectClass = (templateOrientation: TemplateOrientation) =>
    templateOrientation === "portrait" ? "aspect-[2/3]" : "aspect-video";

  const isLightSurfaceTemplate = (templateId: string) =>
    templateId.startsWith("address_blue_diagonal_") || templateId.startsWith("flyer_promo_");

  const TemplateThumb = ({ template }: { template: Template }) => {
    const lightSurface = isLightSurfaceTemplate(template.id);

    return (
      <div className={"relative " + getAspectClass(template.orientation) + " w-full bg-gray-100"}>
        <Image
          src={template.thumb}
          alt={template.label}
          fill
          className="object-cover"
          unoptimized
        />

        {/* WYSIWYG layout overlay: avatar + text blocks */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/10" />

          {/* Avatar */}
          <div className="absolute left-1/2 top-[18%] -translate-x-1/2">
            <div className="h-10 w-10 rounded-full bg-white/90 ring-2 ring-white" />
          </div>

          {/* Name + title blocks */}
          <div className="absolute left-1/2 top-[38%] -translate-x-1/2 w-[70%]">
            <div
              className={
                "h-2.5 rounded " +
                (lightSurface ? "bg-black/70" : "bg-white/80")
              }
            />
            <div
              className={
                "mt-2 h-2 rounded w-[65%] mx-auto " +
                (lightSurface ? "bg-black/50" : "bg-white/60")
              }
            />
          </div>

          {/* Contact lines */}
          <div className="absolute left-1/2 top-[55%] -translate-x-1/2 w-[78%] space-y-2">
            <div className={"h-2 rounded " + (lightSurface ? "bg-black/40" : "bg-white/45")} />
            <div className={"h-2 rounded w-[90%] " + (lightSurface ? "bg-black/35" : "bg-white/40")} />
            <div className={"h-2 rounded w-[80%] " + (lightSurface ? "bg-black/30" : "bg-white/35")} />
          </div>

          {/* Flyer hint: CTA + QR */}
          {template.id.startsWith("flyer_promo_") ? (
            <>
              <div className="absolute left-[12%] top-[72%] w-[76%] h-7 rounded bg-white/70" />
              <div className="absolute right-[12%] bottom-[10%] h-10 w-10 rounded bg-white/90" />
            </>
          ) : null}
        </div>
      </div>
    );
  };

  React.useEffect(() => {
    let cancelled = false;

    loadTemplateManifest()
      .then((manifest) => {
        if (cancelled) return;

        // Deduplicate templates by ID (defensive: manifests can be merged/extended)
        const deduped = Array.from(new Map(manifest.templates.map((t) => [t.id, t])).values());

        const allBackgrounds = filterTemplates(deduped, { type: "background" });
        const orientationFirstBackgrounds = [...allBackgrounds].sort((a, b) => {
          const aMatch = a.orientation === activeOrientation ? 1 : 0;
          const bMatch = b.orientation === activeOrientation ? 1 : 0;
          return bMatch - aMatch;
        });

        const filteredOverlays = filterTemplates(deduped, {
          type: "overlay",
          orientation: activeOrientation,
        });

        setBackgrounds(orientationFirstBackgrounds);
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
  }, [activeOrientation, retryToken]);

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
          <CardDescription className="text-destructive">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setError(null);
              setLoading(true);
              setRetryToken((v) => v + 1);
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
      <CardContent>
        <Tabs defaultValue="backgrounds" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="backgrounds">Backgrounds ({backgrounds.length})</TabsTrigger>
            <TabsTrigger value="overlays">Overlays ({overlays.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="backgrounds" className="space-y-4">
            {backgrounds.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No backgrounds available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {backgrounds.map((template) => {
                  const isSelected = selection.backgroundId === template.id;
                  return (
                    <div key={template.id} className="relative group">
                      <button
                        onClick={() => handleBackgroundSelect(template.id)}
                        className={
                          "relative rounded-lg overflow-hidden border-2 transition-all w-full " +
                          (isSelected
                            ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2"
                            : "border-gray-200 hover:border-purple-400")
                        }
                        title={template.notes || template.label}
                      >
                        <TemplateThumb template={template} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {template.label}
                        </div>
                        {isSelected ? (
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
                      </button>

                      {onCreateFromTemplate ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onCreateFromTemplate(template);
                          }}
                          className="absolute top-2 left-2 rounded-full bg-white/90 text-gray-900 text-xs font-semibold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label={`Create new from ${template.label}`}
                          title="Create new from this template"
                        >
                          New
                        </button>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overlays" className="space-y-4">
            {overlays.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No overlays available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => handleOverlaySelect(undefined)}
                  className={
                    "relative group rounded-lg overflow-hidden border-2 transition-all " +
                    getAspectClass(activeOrientation) +
                    " " +
                    (!selection.overlayId
                      ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2"
                      : "border-gray-200 hover:border-purple-400")
                  }
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <span className="text-sm font-medium text-gray-600">None</span>
                  </div>
                  {!selection.overlayId ? (
                    <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1  1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : null}
                </button>

                {overlays.map((template) => {
                  const isSelected = selection.overlayId === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleOverlaySelect(template.id)}
                      className={
                        "relative group rounded-lg overflow-hidden border-2 transition-all " +
                        (isSelected
                          ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2"
                          : "border-gray-200 hover:border-purple-400")
                      }
                      title={template.notes || template.label}
                    >
                      <TemplateThumb template={template} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {template.label}
                      </div>
                      {isSelected ? (
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
                    </button>
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
