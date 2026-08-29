// NEUROBREATH_STABLE_APPS_INSTITUTIONAL_MENU
export type Phase3MenuItem = {
  icon: string;
  title: string;
  href: string;
  description: string;
  example: string;
};

export type Phase3MenuGroup = {
  title: string;
  href: string;
  description: string;
  items: Phase3MenuItem[];
};

export const phase3AppsMenu: Phase3MenuItem[] = [
  {
    icon: "🗓️",
    title: "Visual Routine Planner",
    href: "/apps/visual-routine",
    description: "Build visual routines with steps, transition notes and a countdown.",
    example: "Create a morning routine with water, reminder, bag check and leaving time.",
  },
  {
    icon: "🧩",
    title: "AI Task Decomposer",
    href: "/apps/task-decomposer",
    description: "Break a large goal into small low-pressure actions with progress rewards.",
    example: "Type “Clean the kitchen” and turn it into manageable steps.",
  },
  {
    icon: "📖",
    title: "Multi-Sensory Reader",
    href: "/apps/reader",
    description: "Paste text, listen with browser speech, highlight words and adjust spacing.",
    example: "Paste a long email, slow the reading speed and increase line spacing.",
  },
  {
    icon: "🗂️",
    title: "Life-Skills Wallet",
    href: "/apps/life-skills-wallet",
    description: "Store local document notes and reminder cards without file upload.",
    example: "Add a passport renewal reminder or checklist card.",
  },
];

export const phase3InstitutionalMenu: Phase3MenuItem[] = [
  {
    icon: "💼",
    title: "Access to Work Readiness",
    href: "/institutional/access-to-work-readiness",
    description: "Prepare workplace support conversations without claiming approval or guaranteed funding.",
    example: "List your work barrier, support tool ideas and examples from your working day.",
  },
  {
    icon: "🎓",
    title: "Academic Licensing",
    href: "/institutional/academic-licensing",
    description: "Information for disability support teams, colleges, universities and learning support teams.",
    example: "Show a university how the reader and planner could support students.",
  },
  {
    icon: "🏢",
    title: "Corporate Neuroinclusion",
    href: "/institutional/corporate-neuroinclusion",
    description: "Workplace support positioning for HR, DEI, wellbeing and managers.",
    example: "Show HR how task decomposition can reduce friction when starting work.",
  },
  {
    icon: "💳",
    title: "Plans and Institutional Access",
    href: "/pricing",
    description: "Freemium and premium-ready structure without fake payment enforcement.",
    example: "Compare free local tools with future premium-ready features.",
  },
];

export const phase3MenuGroups: Phase3MenuGroup[] = [
  {
    title: "Apps",
    href: "/apps",
    description: "Practical NeuroBreath tools for planning, reading, task-starting and everyday organisation.",
    items: phase3AppsMenu,
  },
  {
    title: "Institutional",
    href: "/institutional/access-to-work-readiness",
    description: "Preparation pages for workplace support, education teams and organisational licensing.",
    items: phase3InstitutionalMenu,
  },
];

export const allPhase3Links: Phase3MenuItem[] = phase3MenuGroups.flatMap((group) => group.items);
