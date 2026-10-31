/*
 * The rule of thumb behind the game, as data: a core feature is the only thing that makes it an
 * MVP, proof features show investors evidence, and extras spend budget without answering anything.
 */

export type MvpFeatureKind = 'core' | 'proof' | 'support' | 'extra';

export interface MvpFeature {
  id: string;
  label: string;
  note: string;
  cost: number;
  kind: MvpFeatureKind;
}

export type MvpOutcome = 'empty' | 'fundable' | 'promising' | 'no-core' | 'feature-soup';

export interface MvpResult {
  /** Investor readiness, 0 to 100. */
  score: number;
  outcome: MvpOutcome;
  spent: number;
}

const CORE_POINTS = 45;
const PROOF_POINTS = 20;
const MAX_PROOF_POINTS = 40;
const SUPPORT_POINTS = 5;
const EXTRA_PENALTY = 14;
const FOCUS_BONUS_PER_POINT = 10;
const NO_CORE_CEILING = 40;
const FUNDABLE_THRESHOLD = 80;
const SOUP_EXTRAS = 2;

const clampScore = (value: number): number => Math.max(0, Math.min(100, value));

export function totalCost(features: readonly MvpFeature[]): number {
  return features.reduce((sum, feature) => sum + feature.cost, 0);
}

export function scoreMvp(picked: readonly MvpFeature[], budget: number): MvpResult {
  const spent = totalCost(picked);
  if (picked.length === 0) return { score: 0, outcome: 'empty', spent };

  const countOf = (kind: MvpFeatureKind) => picked.filter((f) => f.kind === kind).length;
  const hasCore = countOf('core') > 0;
  const extras = countOf('extra');

  const unspent = Math.max(0, budget - spent);
  const raw =
    (hasCore ? CORE_POINTS : 0) +
    Math.min(MAX_PROOF_POINTS, countOf('proof') * PROOF_POINTS) +
    countOf('support') * SUPPORT_POINTS -
    extras * EXTRA_PENALTY +
    (hasCore ? unspent * FOCUS_BONUS_PER_POINT : 0);

  const score = clampScore(hasCore ? raw : Math.min(raw, NO_CORE_CEILING));

  if (!hasCore) {
    return { score, outcome: extras >= SOUP_EXTRAS ? 'feature-soup' : 'no-core', spent };
  }
  if (extras >= SOUP_EXTRAS) return { score, outcome: 'feature-soup', spent };
  return { score, outcome: score >= FUNDABLE_THRESHOLD ? 'fundable' : 'promising', spent };
}
