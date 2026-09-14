export type ClusterId =
  | 'ai-agents'
  | 'devtools-compilers'
  | 'web-creative'
  | 'privacy-decentralized'
  | 'productivity-pkm'
  | 'systems-hardware';

export interface ClusterInfo {
  id: ClusterId;
  name: string;
  nameJa: string;
  color: string;
  hexColor: number;
  glowColor: string;
  centerPosition: [number, number, number];
  description: string;
}

export interface ShowHnProject {
  id: string | number;
  title: string;
  url: string;
  hnUrl: string;
  points: number;
  commentsCount: number;
  author: string;
  postedDate: string;
  cluster: ClusterId;
  position: [number, number, number];
  tags: string[];
  summary: {
    oneLiner: string;
    highlights: string[];
    targetAudience: string;
    hackIdea: string;
  };
  rawText?: string;
  isSupernova?: boolean;
}

export interface InnovationVoid {
  id: string;
  clusterA: ClusterId;
  clusterB: ClusterId;
  title: string;
  position: [number, number, number];
  opportunity: string;
  suggestedApp: string;
  potentialScore: number;
  difficulty: 'Quick MVP' | 'Moderate' | 'Deep Tech';
}
