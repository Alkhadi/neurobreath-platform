/**
 * NB-Card Pro Layer Editor
 * Professional undo/redo system + layer management utilities
 * NO new dependencies - pure TypeScript
 */

import type { CardLayer, Profile } from "@/lib/utils";

export interface LayerHistory {
  past: Profile[];
  present: Profile;
  future: Profile[];
}

const MAX_HISTORY_SIZE = 50;

export function createLayerHistory(initialProfile: Profile): LayerHistory {
  return {
    past: [],
    present: initialProfile,
    future: [],
  };
}

export function pushHistory(
  history: LayerHistory,
  nextProfile: Profile
): LayerHistory {
  const newPast = [...history.past, history.present].slice(-MAX_HISTORY_SIZE);

  return {
    past: newPast,
    present: nextProfile,
    future: [], // clear future when new action is performed
  };
}

export function undo(history: LayerHistory): LayerHistory {
  if (history.past.length === 0) return history;

  const previous = history.past[history.past.length - 1];
  const newPast = history.past.slice(0, -1);

  return {
    past: newPast,
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redo(history: LayerHistory): LayerHistory {
  if (history.future.length === 0) return history;

  const next = history.future[0];
  const newFuture = history.future.slice(1);

  return {
    past: [...history.past, history.present],
    present: next,
    future: newFuture,
  };
}

export function canUndo(history: LayerHistory): boolean {
  return history.past.length > 0;
}

export function canRedo(history: LayerHistory): boolean {
  return history.future.length > 0;
}

// Layer manipulation utilities

export function addLayer(
  profile: Profile,
  layer: CardLayer
): Profile {
  const layers = profile.layers || [];
  return {
    ...profile,
    layers: [...layers, layer],
  };
}

export function updateLayer(
  profile: Profile,
  layerId: string,
  updates: Partial<CardLayer>
): Profile {
  const layers = profile.layers || [];
  return {
    ...profile,
    layers: layers.map((layer) =>
      layer.id === layerId ? { ...layer, ...updates } as CardLayer : layer
    ),
  };
}

export function deleteLayer(
  profile: Profile,
  layerId: string
): Profile {
  const layers = profile.layers || [];
  return {
    ...profile,
    layers: layers.filter((layer) => layer.id !== layerId),
  };
}

export function duplicateLayer(
  profile: Profile,
  layerId: string
): Profile {
  const layers = profile.layers || [];
  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return profile;

  const newLayer: CardLayer = {
    ...layer,
    id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    x: Math.min(100, layer.x + 2),
    y: Math.min(100, layer.y + 2),
    zIndex: Math.max(...layers.map((l) => l.zIndex), 0) + 1,
  };

  return {
    ...profile,
    layers: [...layers, newLayer],
  };
}

export function bringLayerForward(
  profile: Profile,
  layerId: string
): Profile {
  const layers = profile.layers || [];
  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return profile;

  const maxZ = Math.max(...layers.map((l) => l.zIndex), 0);
  if (layer.zIndex >= maxZ) return profile; // already on top

  return updateLayer(profile, layerId, { zIndex: maxZ + 1 });
}

export function sendLayerBackward(
  profile: Profile,
  layerId: string
): Profile {
  const layers = profile.layers || [];
  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return profile;

  const minZ = Math.min(...layers.map((l) => l.zIndex), 0);
  if (layer.zIndex <= minZ) return profile; // already at bottom

  return updateLayer(profile, layerId, { zIndex: minZ - 1 });
}

export function bringLayerToFront(
  profile: Profile,
  layerId: string
): Profile {
  const layers = profile.layers || [];
  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return profile;

  const maxZ = Math.max(...layers.map((l) => l.zIndex), 0);
  return updateLayer(profile, layerId, { zIndex: maxZ + 1 });
}

export function sendLayerToBack(
  profile: Profile,
  layerId: string
): Profile {
  const layers = profile.layers || [];
  const layer = layers.find((l) => l.id === layerId);
  if (!layer) return profile;

  const minZ = Math.min(...layers.map((l) => l.zIndex), 0);
  return updateLayer(profile, layerId, { zIndex: minZ - 1 });
}

export function moveLayerUp(
  profile: Profile,
  layerIndex: number
): Profile {
  const layers = profile.layers || [];
  if (layerIndex <= 0 || layerIndex >= layers.length) return profile;

  const newLayers = [...layers];
  [newLayers[layerIndex - 1], newLayers[layerIndex]] = [
    newLayers[layerIndex],
    newLayers[layerIndex - 1],
  ];

  return { ...profile, layers: newLayers };
}

export function moveLayerDown(
  profile: Profile,
  layerIndex: number
): Profile {
  const layers = profile.layers || [];
  if (layerIndex < 0 || layerIndex >= layers.length - 1) return profile;

  const newLayers = [...layers];
  [newLayers[layerIndex], newLayers[layerIndex + 1]] = [
    newLayers[layerIndex + 1],
    newLayers[layerIndex],
  ];

  return { ...profile, layers: newLayers };
}

export function reorderLayers(
  profile: Profile,
  newOrder: CardLayer[]
): Profile {
  return {
    ...profile,
    layers: newOrder,
  };
}

// Layer factory functions

export function createTextLayer(
  x: number = 10,
  y: number = 10,
  content: string = "Double-click to edit"
): CardLayer {
  return {
    id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: "text",
    x,
    y,
    w: 30,
    h: 10,
    rotation: 0,
    zIndex: 100,
    locked: false,
    visible: true,
    style: {
      content,
      fontSize: 12,
      fontFamily: "Inter",
      fontWeight: "bold",
      align: "left",
      color: "#000000",
      backgroundColor: undefined,
      padding: 8,
    },
  };
}

export function createAvatarLayer(
  x: number = 10,
  y: number = 10,
  src: string = ""
): CardLayer {
  return {
    id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: "avatar",
    x,
    y,
    w: 20,
    h: 20,
    rotation: 0,
    zIndex: 100,
    locked: false,
    visible: true,
    style: {
      src,
      fit: "cover",
      borderRadius: 999,
      borderWidth: 2,
      borderColor: "#ffffff",
    },
  };
}

export function createShapeLayer(
  x: number = 10,
  y: number = 10,
  shapeKind: "rect" | "circle" | "line" = "rect"
): CardLayer {
  return {
    id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: "shape",
    x,
    y,
    w: shapeKind === "line" ? 30 : 20,
    h: shapeKind === "line" ? 1 : 20,
    rotation: 0,
    zIndex: 100,
    locked: false,
    visible: true,
    style: {
      shapeKind,
      fill: "#A855F7",
      stroke: "#000000",
      strokeWidth: 0,
      opacity: 1,
      cornerRadius: shapeKind === "rect" ? 8 : 0,
    },
  };
}

export function createQrLayer(
  x: number = 10,
  y: number = 10,
  value: string = ""
): CardLayer {
  return {
    id: `layer-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type: "qr",
    x,
    y,
    w: 20,
    h: 20,
    rotation: 0,
    zIndex: 100,
    locked: false,
    visible: true,
    style: {
      value,
      fill: "#000000",
      background: "#ffffff",
      level: "M",
      marginSize: 1,
    },
  };
}

export function clearLayers(profile: Profile): Profile {
  return { ...profile, layers: [] };
}

export function resetLayers(profile: Profile, initialLayers: CardLayer[]): Profile {
  return { ...profile, layers: initialLayers };
}

// Grid and snap utilities

export interface SnapPoint {
  x?: number;
  y?: number;
}

export function snapToGrid(
  value: number,
  gridSize: number = 5
): number {
  return Math.round(value / gridSize) * gridSize;
}

export function findSnapPoints(
  targetLayer: CardLayer,
  allLayers: CardLayer[],
  snapThreshold: number = 2
): SnapPoint {
  const snapPoint: SnapPoint = {};

  // Snap to canvas edges
  if (Math.abs(targetLayer.x) < snapThreshold) snapPoint.x = 0;
  if (Math.abs(targetLayer.y) < snapThreshold) snapPoint.y = 0;
  if (Math.abs(targetLayer.x + targetLayer.w - 100) < snapThreshold)
    snapPoint.x = 100 - targetLayer.w;
  if (Math.abs(targetLayer.y + targetLayer.h - 100) < snapThreshold)
    snapPoint.y = 100 - targetLayer.h;

  // Snap to center lines
  const centerX = targetLayer.x + targetLayer.w / 2;
  const centerY = targetLayer.y + targetLayer.h / 2;

  if (Math.abs(centerX - 50) < snapThreshold)
    snapPoint.x = 50 - targetLayer.w / 2;
  if (Math.abs(centerY - 50) < snapThreshold)
    snapPoint.y = 50 - targetLayer.h / 2;

  // Snap to other layers
  for (const layer of allLayers) {
    if (layer.id === targetLayer.id || !layer.visible) continue;

    // Left edge alignment
    if (Math.abs(targetLayer.x - layer.x) < snapThreshold) {
      snapPoint.x = layer.x;
    }

    // Top edge alignment
    if (Math.abs(targetLayer.y - layer.y) < snapThreshold) {
      snapPoint.y = layer.y;
    }

    // Right edge alignment
    const targetRight = targetLayer.x + targetLayer.w;
    const layerRight = layer.x + layer.w;
    if (Math.abs(targetRight - layerRight) < snapThreshold) {
      snapPoint.x = layerRight - targetLayer.w;
    }

    // Bottom edge alignment
    const targetBottom = targetLayer.y + targetLayer.h;
    const layerBottom = layer.y + layer.h;
    if (Math.abs(targetBottom - layerBottom) < snapThreshold) {
      snapPoint.y = layerBottom - targetLayer.h;
    }
  }

  return snapPoint;
}

// Align utilities

export function alignLayersLeft(
  profile: Profile,
  layerIds: string[]
): Profile {
  const layers = profile.layers || [];
  const targetLayers = layers.filter((l) => layerIds.includes(l.id));
  if (targetLayers.length === 0) return profile;

  const minX = Math.min(...targetLayers.map((l) => l.x));

  return {
    ...profile,
    layers: layers.map((layer) =>
      layerIds.includes(layer.id) ? { ...layer, x: minX } : layer
    ),
  };
}

export function alignLayersCenter(
  profile: Profile,
  layerIds: string[]
): Profile {
  const layers = profile.layers || [];
  const targetLayers = layers.filter((l) => layerIds.includes(l.id));
  if (targetLayers.length === 0) return profile;

  const avgCenterX =
    targetLayers.reduce((sum, l) => sum + l.x + l.w / 2, 0) / targetLayers.length;

  return {
    ...profile,
    layers: layers.map((layer) =>
      layerIds.includes(layer.id)
        ? { ...layer, x: avgCenterX - layer.w / 2 }
        : layer
    ),
  };
}

export function alignLayersRight(
  profile: Profile,
  layerIds: string[]
): Profile {
  const layers = profile.layers || [];
  const targetLayers = layers.filter((l) => layerIds.includes(l.id));
  if (targetLayers.length === 0) return profile;

  const maxRight = Math.max(...targetLayers.map((l) => l.x + l.w));

  return {
    ...profile,
    layers: layers.map((layer) =>
      layerIds.includes(layer.id) ? { ...layer, x: maxRight - layer.w } : layer
    ),
  };
}

export function alignLayersTop(
  profile: Profile,
  layerIds: string[]
): Profile {
  const layers = profile.layers || [];
  const targetLayers = layers.filter((l) => layerIds.includes(l.id));
  if (targetLayers.length === 0) return profile;

  const minY = Math.min(...targetLayers.map((l) => l.y));

  return {
    ...profile,
    layers: layers.map((layer) =>
      layerIds.includes(layer.id) ? { ...layer, y: minY } : layer
    ),
  };
}

export function alignLayersMiddle(
  profile: Profile,
  layerIds: string[]
): Profile {
  const layers = profile.layers || [];
  const targetLayers = layers.filter((l) => layerIds.includes(l.id));
  if (targetLayers.length === 0) return profile;

  const avgCenterY =
    targetLayers.reduce((sum, l) => sum + l.y + l.h / 2, 0) / targetLayers.length;

  return {
    ...profile,
    layers: layers.map((layer) =>
      layerIds.includes(layer.id)
        ? { ...layer, y: avgCenterY - layer.h / 2 }
        : layer
    ),
  };
}

export function alignLayersBottom(
  profile: Profile,
  layerIds: string[]
): Profile {
  const layers = profile.layers || [];
  const targetLayers = layers.filter((l) => layerIds.includes(l.id));
  if (targetLayers.length === 0) return profile;

  const maxBottom = Math.max(...targetLayers.map((l) => l.y + l.h));

  return {
    ...profile,
    layers: layers.map((layer) =>
      layerIds.includes(layer.id) ? { ...layer, y: maxBottom - layer.h } : layer
    ),
  };
}
