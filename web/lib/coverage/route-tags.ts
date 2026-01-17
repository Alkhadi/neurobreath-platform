import routeTags from './route-tags.json';

export interface RouteTagEntry {
  match?: string;
  matchPrefix?: string;
  type?: 'pillar' | 'cluster' | 'tool' | 'trust' | 'blog' | 'other';
  conditions?: string[];
  supportNeeds?: string[];
}

export interface RouteTagsConfig {
  routes: RouteTagEntry[];
}

export const ROUTE_TAGS = routeTags as RouteTagsConfig;
