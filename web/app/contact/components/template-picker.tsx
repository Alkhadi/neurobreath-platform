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
}

export function TemplatePicker({ selection, orientation, onSelectionChange }: TemplatePickerProps) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [backgrounds, setBackgrounds] = React.useState<Template[]>([]);
  const [overlays, setOverlays] = React.useState<Template[]>([]);

  React.useEffect(() => {
    let cancelled = false;

    loadTemplateManifest()
      .then((manifest) => {
        if (cancelled) return;

        const currentOrientation = orientation || 'landscape';
        
        const filteredBackgrounds = filterTemplates(manifest.templates, {
          type: 'background',
          orientation: currentOrientation,
        });

        const filteredOverlays = filterTemplates(manifest.templates, {
          type: 'overlay',
          orientation: currentOrientation,
        });

        setBackgrounds(filteredBackgrounds);
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
  }, [orientation]);

  const handleBackgroundSelect = (templateId: string) => {
    onSelectionChange({
      ...selection,
      backgroundId: templateId,
      orientation: orientation || 'landscape',
    });
    toast.success('Background updated');
  };

  const handleOverlaySelect = (templateId: string | undefined) => {
    onSelectionChange({
      ...selection,
      overlayId: templateId,
      orientation: orientation || 'landscape',
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
              // Retry by re-mounting
              window.location.reload();
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
            <TabsTrigger value="backgrounds">
              Backgrounds ({backgrounds.length})
            </TabsTrigger>
            <TabsTrigger value="overlays">
              Overlays ({overlays.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="backgrounds" className="space-y-4">
            {backgrounds.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No backgrounds available</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {backgrounds.map((template) => {
                  const isSelected = selection.backgroundId === template.id;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleBackgroundSelect(template.id)}
                      className={`
                        relative group rounded-lg overflow-hidden border-2 transition-all
                        ${isSelected 
                          ? 'border-purple-600 ring-2 ring-purple-600 ring-offset-2' 
                          : 'border-gray-200 hover:border-purple-400'
                        }
                      `}
                      title={template.notes || template.label}
                    >
                      <div className="aspect-video relative bg-gray-100">
                        <Image
                          src={template.thumb}
                          alt={template.label}
                          fill
                          className="object-cover"
                          unoptimized // SVG thumbs don't need optimization
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        {template.label}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1.5">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="overlays" className="space-y-4">
            {overlays.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No overlays available</p>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* None option */}
                  <button
                    onClick={() => handleOverlaySelect(undefined)}
                    className={`
                      relative group rounded-lg overflow-hidden border-2 transition-all aspect-video
                      ${!selection.overlayId
                        ? 'border-purple-600 ring-2 ring-purple-600 ring-offset-2'
                        : 'border-gray-200 hover:border-purple-400'
                      }
                    `}
                  >
                    <div className="h-full flex items-center justify-center bg-gray-50">
                      <span className="text-sm font-medium text-gray-600">None</span>
                    </div>
                    {!selection.overlayId && (
                      <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1.5">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>

                  {overlays.map((template) => {
                    const isSelected = selection.overlayId === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleOverlaySelect(template.id)}
                        className={`
                          relative group rounded-lg overflow-hidden border-2 transition-all
                          ${isSelected
                            ? 'border-purple-600 ring-2 ring-purple-600 ring-offset-2'
                            : 'border-gray-200 hover:border-purple-400'
                          }
                        `}
                        title={template.notes || template.label}
                      >
                        <div className="aspect-video relative bg-gray-100">
                          <Image
                            src={template.thumb}
                            alt={template.label}
                            fill
                            className="object-cover"
                            unoptimized // SVG thumbs don't need optimization
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          {template.label}
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full p-1.5">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
