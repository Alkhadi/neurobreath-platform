/**
 * NB-Card Pro Editor Toolbar
 * Professional Snagit-style editing controls
 */

"use client";

import { useState } from "react";
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  Move,
  Type,
  Square,
  Circle,
  User,
  Image as ImageIcon,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronUp,
 ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  RotateCcw,
  Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CardLayer, Profile } from "@/lib/utils";
import { cn } from "@/lib/utils";

const AVAILABLE_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Source Sans 3",
  "Merriweather",
  "Playfair Display",
  "Ubuntu",
  "Fira Sans",
  "Manrope",
  "Plus Jakarta Sans",
  "Beardsons",
  "Beardsons Inline",
  "Beardsons Shadow",
  "Beardsons Extras",
  "Monday",
];

export interface EditorToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  gridEnabled: boolean;
  onToggleGrid: () => void;
  snapEnabled: boolean;
  onToggleSnap: () => void;
  selectedLayerId: string | null;
  selectedLayer: CardLayer | null;
  onAddText: () => void;
  onAddShape: (kind: "rect" | "circle" | "line") => void;
  onAddAvatar: () => void;
  onAddImage: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onToggleVisibility: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onAlign: (direction: "left" | "center" | "right" | "top" | "middle" | "bottom") => void;
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
}

export function EditorToolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  gridEnabled,
  onToggleGrid,
  snapEnabled,
  onToggleSnap,
  selectedLayerId: _selectedLayerId,
  selectedLayer,
  onAddText,
  onAddShape,
  onAddAvatar,
  onAddImage,
  onDuplicate,
  onDelete,
  onToggleLock,
  onToggleVisibility,
  onBringForward,
  onSendBackward,
  onAlign,
  profile,
  onProfileUpdate,
}: EditorToolbarProps) {
  const [shapeMenuOpen, setShapeMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-3 space-y-3">
      {/* Top Row: Undo/Redo, Zoom, Grid */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            onClick={onUndo}
            disabled={!canUndo}
            size="sm"
            variant="ghost"
            title="Undo (Ctrl+Z)"
            className="h-8 w-8 p-0"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            onClick={onRedo}
            disabled={!canRedo}
            size="sm"
            variant="ghost"
            title="Redo (Ctrl+Y)"
            className="h-8 w-8 p-0"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1 border-r pr-2">
          <Button
            onClick={onZoomOut}
            size="sm"
            variant="ghost"
            title="Zoom Out"
            className="h-8 w-8 p-0"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            onClick={onZoomIn}
            size="sm"
            variant="ghost"
            title="Zoom In"
            className="h-8 w-8 p-0"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            onClick={onZoomFit}
            size="sm"
            variant="ghost"
            title="Fit to Screen"
            className="h-8 w-8 p-0"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            onClick={onToggleGrid}
            size="sm"
            variant={gridEnabled ? "default" : "ghost"}
            title="Toggle Grid"
            className="h-8 px-2"
          >
            <Grid3x3 className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            onClick={onToggleSnap}
            size="sm"
            variant={snapEnabled ? "default" : "ghost"}
            title="Toggle Snap"
            className="h-8 px-2"
          >
            <Move className="h-4 w-4 mr-1" />
            Snap
          </Button>
        </div>
      </div>

      {/* Add Layer Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-600">Add:</span>
        <Button
          onClick={onAddText}
          size="sm"
          variant="outline"
          className="h-8 px-2"
          title="Add Text"
        >
          <Type className="h-4 w-4 mr-1" />
          Text
        </Button>

        <div className="relative">
          <Button
            onClick={() => setShapeMenuOpen(!shapeMenuOpen)}
            size="sm"
            variant="outline"
            className="h-8 px-2"
            title="Add Shape"
          >
            <Square className="h-4 w-4 mr-1" />
            Shape ▾
          </Button>
          {shapeMenuOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border z-50 py-1 min-w-[120px]">
              <button
                onClick={() => {
                  onAddShape("rect");
                  setShapeMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Square className="h-4 w-4" /> Rectangle
              </button>
              <button
                onClick={() => {
                  onAddShape("circle");
                  setShapeMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Circle className="h-4 w-4" /> Circle
              </button>
              <button
                onClick={() => {
                  onAddShape("line");
                  setShapeMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <div className="h-0.5 w-4 bg-gray-700" /> Line
              </button>
            </div>
          )}
        </div>

        <Button
          onClick={onAddAvatar}
          size="sm"
          variant="outline"
          className="h-8 px-2"
          title="Add Avatar"
        >
          <User className="h-4 w-4 mr-1" />
          Avatar
        </Button>

        <Button
          onClick={onAddImage}
          size="sm"
          variant="outline"
          className="h-8 px-2"
          title="Add Image"
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          Image
        </Button>
      </div>

      {/* Selected Layer Inspector */}
      {selectedLayer && (
        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">
              Selected: {selectedLayer.type.charAt(0).toUpperCase() + selectedLayer.type.slice(1)}
            </span>
            <div className="flex items-center gap-1">
              <Button
                onClick={onDuplicate}
                size="sm"
                variant="ghost"
                title="Duplicate"
                className="h-7 w-7 p-0"
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
              <Button
                onClick={onToggleLock}
                size="sm"
                variant="ghost"
                title={selectedLayer.locked ? "Unlock" : "Lock"}
                className="h-7 w-7 p-0"
              >
                {selectedLayer.locked ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Unlock className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                onClick={onToggleVisibility}
                size="sm"
                variant="ghost"
                title={selectedLayer.visible ? "Hide" : "Show"}
                className="h-7 w-7 p-0"
              >
                {selectedLayer.visible ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
              </Button>
              <Button
                onClick={onDelete}
                size="sm"
                variant="ghost"
                title="Delete"
                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Arrange */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600">Arrange:</span>
            <Button
              onClick={onBringForward}
              size="sm"
              variant="outline"
              className="h-7 px-2"
              title="Bring Forward"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={onSendBackward}
              size="sm"
              variant="outline"
              className="h-7 px-2"
              title="Send Backward"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Align */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600">Align:</span>
            <Button
              onClick={() => onAlign("left")}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              title="Align Left"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => onAlign("center")}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              title="Align Center"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => onAlign("right")}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              title="Align Right"
            >
              <AlignRight className="h-3.5 w-3.5" />
            </Button>
            <span className="text-gray-300">|</span>
            <Button
              onClick={() => onAlign("top")}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              title="Align Top"
            >
              <AlignVerticalJustifyStart className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => onAlign("middle")}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              title="Align Middle"
            >
              <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
            </Button>
            <Button
              onClick={() => onAlign("bottom")}
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              title="Align Bottom"
            >
              <AlignVerticalJustifyEnd className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Layer-specific controls */}
          {selectedLayer.type === "text" && (
            <div className="space-y-2 pt-2 border-t">
              {/* Font Family */}
              <div>
                <label className="text-xs text-gray-600">Font Family</label>
                <select
                  value={selectedLayer.style.fontFamily || "Inter"}
                  onChange={(e) => {
                    const updated = {
                      ...profile,
                      layers: profile.layers?.map((l) =>
                        l.id === selectedLayer.id && l.type === "text"
                          ? { ...l, style: { ...l.style, fontFamily: e.target.value } }
                          : l
                      ),
                    };
                    onProfileUpdate(updated);
                  }}
                  className="w-full px-2 py-1 text-sm border rounded bg-white"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Font Size</label>
                  <input
                    type="number"
                    value={selectedLayer.style.fontSize}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isFinite(v) || v < 8 || v > 200) return;
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "text"
                            ? { ...l, style: { ...l.style, fontSize: v } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min="8"
                    max="200"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Color</label>
                  <input
                    type="color"
                    value={selectedLayer.style.color}
                    onChange={(e) => {
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "text"
                            ? { ...l, style: { ...l.style, color: e.target.value } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full h-8 border rounded cursor-pointer"
                  />
                </div>
              </div>
              {/* Bold / Italic / Align */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  onClick={() => {
                    const next = selectedLayer.style.fontWeight === "bold" ? "normal" : "bold";
                    const updated = {
                      ...profile,
                      layers: profile.layers?.map((l) =>
                        l.id === selectedLayer.id && l.type === "text"
                          ? { ...l, style: { ...l.style, fontWeight: next as "normal" | "bold" } }
                          : l
                      ),
                    };
                    onProfileUpdate(updated);
                  }}
                  size="sm"
                  variant={selectedLayer.style.fontWeight === "bold" ? "default" : "outline"}
                  className="h-8 w-8 p-0 font-bold"
                  title="Bold"
                >
                  B
                </Button>
                <span className="text-gray-300">|</span>
                <Button
                  onClick={() => {
                    const updated = {
                      ...profile,
                      layers: profile.layers?.map((l) =>
                        l.id === selectedLayer.id && l.type === "text"
                          ? { ...l, style: { ...l.style, align: "left" as const } }
                          : l
                      ),
                    };
                    onProfileUpdate(updated);
                  }}
                  size="sm"
                  variant={selectedLayer.style.align === "left" ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  title="Align Left"
                >
                  <AlignLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  onClick={() => {
                    const updated = {
                      ...profile,
                      layers: profile.layers?.map((l) =>
                        l.id === selectedLayer.id && l.type === "text"
                          ? { ...l, style: { ...l.style, align: "center" as const } }
                          : l
                      ),
                    };
                    onProfileUpdate(updated);
                  }}
                  size="sm"
                  variant={selectedLayer.style.align === "center" ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  title="Align Center"
                >
                  <AlignCenter className="h-3.5 w-3.5" />
                </Button>
                <Button
                  onClick={() => {
                    const updated = {
                      ...profile,
                      layers: profile.layers?.map((l) =>
                        l.id === selectedLayer.id && l.type === "text"
                          ? { ...l, style: { ...l.style, align: "right" as const } }
                          : l
                      ),
                    };
                    onProfileUpdate(updated);
                  }}
                  size="sm"
                  variant={selectedLayer.style.align === "right" ? "default" : "outline"}
                  className="h-8 w-8 p-0"
                  title="Align Right"
                >
                  <AlignRight className="h-3.5 w-3.5" />
                </Button>
              </div>
              {/* Background Color */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Background</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={selectedLayer.style.backgroundColor || "#ffffff"}
                      onChange={(e) => {
                        const updated = {
                          ...profile,
                          layers: profile.layers?.map((l) =>
                            l.id === selectedLayer.id && l.type === "text"
                              ? { ...l, style: { ...l.style, backgroundColor: e.target.value } }
                              : l
                          ),
                        };
                        onProfileUpdate(updated);
                      }}
                      className="w-full h-8 border rounded cursor-pointer"
                    />
                    {selectedLayer.style.backgroundColor && (
                      <Button
                        onClick={() => {
                          const updated = {
                            ...profile,
                            layers: profile.layers?.map((l) =>
                              l.id === selectedLayer.id && l.type === "text"
                                ? { ...l, style: { ...l.style, backgroundColor: undefined } }
                                : l
                            ),
                          };
                          onProfileUpdate(updated);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 px-1 text-xs"
                        title="Clear background"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Padding</label>
                  <input
                    type="number"
                    value={selectedLayer.style.padding ?? 8}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isFinite(v) || v < 0 || v > 100) return;
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "text"
                            ? { ...l, style: { ...l.style, padding: v } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedLayer.type === "shape" && (
            <div className="space-y-2 pt-2 border-t">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Fill</label>
                  <input
                    type="color"
                    value={selectedLayer.style.fill}
                    onChange={(e) => {
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "shape"
                            ? { ...l, style: { ...l.style, fill: e.target.value } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full h-8 border rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Opacity ({Math.round(selectedLayer.style.opacity * 100)}%)</label>
                  <input
                    type="range"
                    value={selectedLayer.style.opacity * 100}
                    onChange={(e) => {
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "shape"
                            ? { ...l, style: { ...l.style, opacity: parseInt(e.target.value, 10) / 100 } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Stroke</label>
                  <input
                    type="color"
                    value={selectedLayer.style.stroke || "#000000"}
                    onChange={(e) => {
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "shape"
                            ? { ...l, style: { ...l.style, stroke: e.target.value } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full h-8 border rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Stroke Width</label>
                  <input
                    type="number"
                    value={selectedLayer.style.strokeWidth ?? 0}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isFinite(v) || v < 0 || v > 20) return;
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "shape"
                            ? { ...l, style: { ...l.style, strokeWidth: v } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min="0"
                    max="20"
                  />
                </div>
              </div>
              {selectedLayer.style.shapeKind === "rect" && (
                <div>
                  <label className="text-xs text-gray-600">Corner Radius</label>
                  <input
                    type="number"
                    value={selectedLayer.style.cornerRadius ?? 0}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isFinite(v) || v < 0 || v > 200) return;
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "shape"
                            ? { ...l, style: { ...l.style, cornerRadius: v } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min="0"
                    max="200"
                  />
                </div>
              )}
            </div>
          )}

          {selectedLayer.type === "avatar" && (
            <div className="space-y-2 pt-2 border-t">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-600">Border Radius</label>
                  <input
                    type="number"
                    value={selectedLayer.style.borderRadius}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isFinite(v) || v < 0) return;
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "avatar"
                            ? { ...l, style: { ...l.style, borderRadius: v } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min="0"
                    max="999"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Border Width</label>
                  <input
                    type="number"
                    value={selectedLayer.style.borderWidth ?? 0}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (!Number.isFinite(v) || v < 0 || v > 20) return;
                      const updated = {
                        ...profile,
                        layers: profile.layers?.map((l) =>
                          l.id === selectedLayer.id && l.type === "avatar"
                            ? { ...l, style: { ...l.style, borderWidth: v } }
                            : l
                        ),
                      };
                      onProfileUpdate(updated);
                    }}
                    className="w-full px-2 py-1 text-sm border rounded"
                    min="0"
                    max="20"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-600">Border Color</label>
                <input
                  type="color"
                  value={selectedLayer.style.borderColor || "#ffffff"}
                  onChange={(e) => {
                    const updated = {
                      ...profile,
                      layers: profile.layers?.map((l) =>
                        l.id === selectedLayer.id && l.type === "avatar"
                          ? { ...l, style: { ...l.style, borderColor: e.target.value } }
                          : l
                      ),
                    };
                    onProfileUpdate(updated);
                  }}
                  className="w-full h-8 border rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Fit</label>
                <select
                  value={selectedLayer.style.fit}
                  onChange={(e) => {
                    const updated = {
                      ...profile,
                      layers: profile.layers?.map((l) =>
                        l.id === selectedLayer.id && l.type === "avatar"
                          ? { ...l, style: { ...l.style, fit: e.target.value as "cover" | "contain" } }
                          : l
                      ),
                    };
                    onProfileUpdate(updated);
                  }}
                  className="w-full px-2 py-1 text-sm border rounded bg-white"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Layers Panel — full CRUD: inline edit, add, paste, delete, reset, clear,
 * drag-reorder, show/hide, lock/unlock. Canvas updates are instant (driven by
 * state); localStorage writes are debounced by the parent.
 */
export interface LayersPanelProps {
  layers: CardLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onReorderLayers: (newOrder: CardLayer[]) => void;
  onToggleLayerVisibility: (id: string) => void;
  onToggleLayerLock: (id: string) => void;
  // CRUD additions
  onAddText: (text?: string) => void;
  onDeleteLayer: (id: string) => void;
  onUpdateLayerText: (id: string, text: string) => void;
  onEditEnd: () => void;
  onResetLayers: () => void;
  onClearLayers: () => void;
}

export function LayersPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onReorderLayers,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onAddText,
  onDeleteLayer,
  onUpdateLayerText,
  onEditEnd,
  onResetLayers,
  onClearLayers,
}: LayersPanelProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editOriginal, setEditOriginal] = useState("");

  const startEdit = (layer: CardLayer) => {
    if (layer.locked || layer.type !== "text") return;
    const content = layer.style.content || "";
    setEditingId(layer.id);
    setEditText(content);
    setEditOriginal(content);
  };

  const commitEdit = () => {
    onEditEnd();
    setEditingId(null);
  };

  const cancelEdit = () => {
    if (editingId) onUpdateLayerText(editingId, editOriginal);
    setEditingId(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onAddText(text.trim() || "Pasted text");
    } catch {
      onAddText("Pasted text");
    }
  };

  const handleDragStart = (index: number, locked: boolean) => {
    if (locked) return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newLayers = [...layers];
    const [removed] = newLayers.splice(draggedIndex, 1);
    newLayers.splice(index, 0, removed);
    onReorderLayers(newLayers);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => setDraggedIndex(null);

  const sortedLayers = [...layers].sort((a, b) => b.zIndex - a.zIndex);

  const getLayerLabel = (layer: CardLayer): string => {
    if (layer.type === "text") {
      const c = layer.style.content || "";
      return c.length > 22 ? `${c.slice(0, 22)}\u2026` : c || "Text";
    }
    return layer.type.charAt(0).toUpperCase() + layer.type.slice(1);
  };

  const typePrefix = (layer: CardLayer) => {
    if (layer.type === "text") return "T";
    if (layer.type === "avatar") return "A";
    return "S";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2 gap-1 flex-wrap">
        <h3 className="text-sm font-semibold text-gray-700">Layers</h3>
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => onAddText("New text")}
            className="flex items-center gap-0.5 px-2 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 rounded transition-colors"
            title="Add text layer"
            aria-label="Add text layer"
          >
            <Type className="h-3 w-3" />
            +&nbsp;Text
          </button>
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-0.5 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
            title="Paste clipboard as text layer"
            aria-label="Paste clipboard as text layer"
          >
            <Clipboard className="h-3 w-3" />
            Paste
          </button>
          <button
            type="button"
            onClick={onResetLayers}
            className="flex items-center gap-0.5 px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
            title="Reset layers to session defaults"
            aria-label="Reset layers to session defaults"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
          <button
            type="button"
            onClick={onClearLayers}
            className="flex items-center gap-0.5 px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded transition-colors"
            title="Clear all layers"
            aria-label="Clear all layers"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>
      </div>

      {/* Layer rows */}
      <div className="space-y-1 max-h-64 overflow-y-auto">
        {sortedLayers.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No layers yet. Add text, shapes, or images.
          </p>
        ) : (
          sortedLayers.map((layer) => {
            const originalIndex = layers.findIndex((l) => l.id === layer.id);
            const isEditing = editingId === layer.id;
            const isSelected = selectedLayerId === layer.id;
            return (
              <div
                key={layer.id}
                draggable={!layer.locked && !isEditing}
                onDragStart={() => handleDragStart(originalIndex, layer.locked)}
                onDragOver={(e) => handleDragOver(e, originalIndex)}
                onDragEnd={handleDragEnd}
                onClick={() => { if (!isEditing) onSelectLayer(layer.id); }}
                onDoubleClick={() => startEdit(layer)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1.5 rounded transition-colors",
                  isEditing
                    ? "cursor-text bg-purple-50 border border-purple-300"
                    : layer.locked
                      ? "cursor-default opacity-70 hover:bg-gray-50 border border-transparent"
                      : isSelected
                        ? "cursor-pointer bg-purple-100 border border-purple-300"
                        : "cursor-pointer hover:bg-gray-100 border border-transparent"
                )}
              >
                {/* Type badge */}
                <span className="text-xs text-gray-400 font-mono flex-shrink-0 w-4 text-center select-none">
                  {typePrefix(layer)}
                </span>

                {/* Label or inline textarea (multiline) */}
                {isEditing ? (
                  <textarea
                    autoFocus
                    rows={3}
                    value={editText}
                    aria-label="Edit layer text"
                    onChange={(e) => {
                      setEditText(e.target.value);
                      onUpdateLayerText(layer.id, e.target.value);
                    }}
                    onKeyDown={(e) => {
                      // Escape cancels; Enter adds a newline (natural textarea behaviour)
                      if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                      // Ctrl/Cmd+Enter commits
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); commitEdit(); }
                    }}
                    onBlur={() => commitEdit()}
                    onClick={(e) => e.stopPropagation()}
                    style={{ resize: "none" }}
                    className="flex-1 min-w-0 text-sm border border-purple-400 rounded px-1 py-0.5 bg-white focus:outline-none focus:ring-1 focus:ring-purple-400"
                  />
                ) : (
                  <div
                    className="flex-1 min-w-0 text-sm truncate"
                    title={
                      layer.type === "text" ? layer.style.content : undefined
                    }
                  >
                    {getLayerLabel(layer)}
                  </div>
                )}

                {/* Visibility */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleLayerVisibility(layer.id); }}
                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                  title={layer.visible ? "Hide layer" : "Show layer"}
                  aria-label={layer.visible ? "Hide layer" : "Show layer"}
                >
                  {layer.visible
                    ? <Eye className="h-3.5 w-3.5 text-gray-600" />
                    : <EyeOff className="h-3.5 w-3.5 text-gray-400" />}
                </button>

                {/* Lock */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleLayerLock(layer.id); }}
                  className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
                  title={layer.locked ? "Unlock layer" : "Lock layer"}
                  aria-label={layer.locked ? "Unlock layer" : "Lock layer"}
                >
                  {layer.locked
                    ? <Lock className="h-3.5 w-3.5 text-gray-600" />
                    : <Unlock className="h-3.5 w-3.5 text-gray-400" />}
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id); }}
                  className="p-1 hover:bg-red-100 rounded flex-shrink-0"
                  title="Delete layer"
                  aria-label="Delete layer"
                >
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>
            );
          })
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Double-click a text layer to edit. Enter for line breaks, Ctrl+Enter to finish. Drag to reorder.
      </p>
    </div>
  );
}
