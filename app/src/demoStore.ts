/** Local simulated crumbs — $0 demo path when COOK/bridge would cost money. */

export type DemoCrumb = {
  id: string;
  message: string;
  tipCook: number;
  at: number; // epoch ms
  simulated: true;
  author: string;
};

const KEY = "cookie-crumb-board:demo-crumbs:v1";
const MODE_KEY = "cookie-crumb-board:demo-mode";

export function isDemoModePreferred(): boolean {
  try {
    const v = localStorage.getItem(MODE_KEY);
    if (v === null) return true; // default ON for free demo
    return v === "1";
  } catch {
    return true;
  }
}

export function setDemoModePreferred(on: boolean) {
  try {
    localStorage.setItem(MODE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function loadDemoCrumbs(): DemoCrumb[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedIfEmpty();
    const parsed = JSON.parse(raw) as DemoCrumb[];
    return Array.isArray(parsed) ? parsed : seedIfEmpty();
  } catch {
    return seedIfEmpty();
  }
}

function seedIfEmpty(): DemoCrumb[] {
  const seed: DemoCrumb[] = [
    {
      id: "seed-1",
      message: "Welcome to Cookie Crumb Board — free demo (no COOK spent).",
      tipCook: 0,
      at: Date.now() - 86_400_000,
      simulated: true,
      author: "demo-seed",
    },
    {
      id: "seed-2",
      message: "Live chain health below is real Cookie RPC read-only.",
      tipCook: 0,
      at: Date.now() - 3_600_000,
      simulated: true,
      author: "demo-seed",
    },
  ];
  saveDemoCrumbs(seed);
  return seed;
}

export function saveDemoCrumbs(items: DemoCrumb[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, 50)));
  } catch {
    /* ignore quota */
  }
}

export function addDemoCrumb(message: string, tipCook = 0, author = "local-demo"): DemoCrumb {
  const crumb: DemoCrumb = {
    id: `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message: message.trim().slice(0, 280),
    tipCook: Math.max(0, tipCook),
    at: Date.now(),
    simulated: true,
    author,
  };
  const next = [crumb, ...loadDemoCrumbs()];
  saveDemoCrumbs(next);
  return crumb;
}

export function clearDemoCrumbs() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
