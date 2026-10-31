import { describe, expect, it } from 'vitest';
import { scoreMvp, totalCost } from './score';
import type { MvpFeature, MvpFeatureKind } from './score';

const feature = (id: string, kind: MvpFeatureKind, cost = 1): MvpFeature => ({
  id,
  label: id,
  note: '',
  cost,
  kind,
});

const core = feature('core', 'core', 2);
const landing = feature('landing', 'proof');
const analytics = feature('analytics', 'proof');
const payments = feature('payments', 'proof', 2);
const login = feature('login', 'support');
const chat = feature('chat', 'extra', 2);
const admin = feature('admin', 'extra', 2);
const push = feature('push', 'extra');

describe('totalCost', () => {
  it('adds up feature costs', () => {
    expect(totalCost([core, landing, payments])).toBe(5);
    expect(totalCost([])).toBe(0);
  });
});

describe('scoreMvp', () => {
  it('scores an empty build as zero with its own outcome', () => {
    expect(scoreMvp([], 5)).toEqual({ score: 0, outcome: 'empty', spent: 0 });
  });

  it('rewards a focused build: core, proof, and budget left over', () => {
    const result = scoreMvp([core, landing, analytics], 5);
    expect(result.outcome).toBe('fundable');
    expect(result.score).toBe(95);
    expect(result.spent).toBe(4);
  });

  it('calls a core feature plus payment proof fundable even with nothing unspent', () => {
    expect(scoreMvp([core, landing, payments], 5).outcome).toBe('fundable');
  });

  it('rewards leaving budget unspent, because focus is the point', () => {
    const spendAll = scoreMvp([core, landing, analytics, login], 5);
    const keepOne = scoreMvp([core, landing, analytics], 5);
    expect(keepOne.score).toBeGreaterThan(spendAll.score);
  });

  it('marks a core feature with one distraction as promising', () => {
    const result = scoreMvp([core, landing, push], 5);
    expect(result.outcome).toBe('promising');
    expect(result.score).toBeLessThan(80);
  });

  it('caps any build without a core feature, however much proof it has', () => {
    const result = scoreMvp([landing, analytics, payments], 5);
    expect(result.outcome).toBe('no-core');
    expect(result.score).toBeLessThanOrEqual(40);
  });

  it('calls two or more extras feature soup, with or without a core feature', () => {
    expect(scoreMvp([core, chat, push], 5).outcome).toBe('feature-soup');
    expect(scoreMvp([chat, admin, push], 5).outcome).toBe('feature-soup');
  });

  it('never leaves the 0 to 100 range', () => {
    expect(scoreMvp([chat, admin, push], 5).score).toBe(0);
    expect(scoreMvp([core], 20).score).toBeLessThanOrEqual(100);
  });

  it('does not reward an over-budget build with a focus bonus', () => {
    const atBudget = scoreMvp([core, payments, login], 5);
    const overBudget = scoreMvp([core, payments, login], 4);
    expect(overBudget.score).toBe(atBudget.score);
  });

  it('is pure: same input, same output, input untouched', () => {
    const picked = [core, landing];
    const snapshot = [...picked];
    expect(scoreMvp(picked, 5)).toEqual(scoreMvp(picked, 5));
    expect(picked).toEqual(snapshot);
  });
});
