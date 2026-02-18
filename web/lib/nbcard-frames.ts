export type NbCardFrame = {
  id: string;
  name: string;
  category: string;
  src: string;
  aspect?: "landscape" | "portrait";
};

const BUILTIN_FRAME_SPECS: Array<{ src: string; category: "backgrounds" | "overlays" }> = [
  // Backgrounds
  { src: "/nb-card/templates/backgrounds/minimal-black-landscape.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/minimal-black-portrait.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/minimal_black_landscape_bg.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/minimal_black_portrait_bg.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/modern-geometric-landscape.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/modern-geometric-portrait.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/modern_geometric_landscape_bg.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/modern_geometric_portrait_bg.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/address-blue-diagonal-landscape.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/address_blue_diagonal_landscape_bg.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/flyer-promo-portrait.svg", category: "backgrounds" },
  { src: "/nb-card/templates/backgrounds/flyer_promo_portrait_bg.svg", category: "backgrounds" },

  // Overlays
  { src: "/nb-card/templates/overlays/ink_frame_overlay_landscape.svg", category: "overlays" },
  { src: "/nb-card/templates/overlays/ink_frame_overlay_portrait.svg", category: "overlays" },
];

function inferAspectFromSrc(src: string): "landscape" | "portrait" | undefined {
  const lower = src.toLowerCase();
  if (lower.includes("landscape")) return "landscape";
  if (lower.includes("portrait")) return "portrait";
  return undefined;
}

function humanizeNameFromSrc(src: string): string {
  const file = src.split("/").pop() ?? src;
  const base = file.replace(/\.svg$/i, "");
  return base.replace(/[-_]+/g, " ").trim();
}

export function getBuiltinFrames(): NbCardFrame[] {
  return BUILTIN_FRAME_SPECS.map((spec) => {
    const aspect = inferAspectFromSrc(spec.src);
    return {
      id: `builtin:${spec.src}`,
      name: humanizeNameFromSrc(spec.src),
      category: spec.category,
      src: spec.src,
      ...(aspect ? { aspect } : {}),
    };
  });
}

export function isSafeFrameSrc(src: unknown): src is string {
  if (typeof src !== "string") return false;
  if (!src.startsWith("/")) return false;

  // Only allow same-origin frame assets.
  if (src.startsWith("/nb-card/templates/backgrounds/")) return true;
  if (src.startsWith("/nb-card/templates/overlays/")) return true;
  if (src.startsWith("/nb-card/frames/")) return true;

  return false;
}
