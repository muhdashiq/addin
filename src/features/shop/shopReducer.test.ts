import { describe, expect, it } from 'vitest';
import { content } from '../../content/content';
import { displayName, initialShopState, MAX_NAME_LENGTH, shopReducer, toSlug } from './shopReducer';

const start = initialShopState('bakery');

describe('shopReducer', () => {
  it('walks through a deploy', () => {
    let state = shopReducer(start, { type: 'startDeploy' });
    expect(state.status).toBe('deploying');
    state = shopReducer(state, { type: 'advanceStep' });
    expect(state.stepIndex).toBe(1);
    state = shopReducer(state, { type: 'finishDeploy' });
    expect(state.status).toBe('live');
  });

  it('returns to idle when the shop changes after going live', () => {
    const live = { ...start, status: 'live' as const };
    expect(shopReducer(live, { type: 'selectBusiness', id: 'coir-maker' }).status).toBe('idle');
    expect(shopReducer(live, { type: 'setName', name: 'New' }).status).toBe('idle');
  });

  it('caps the name length', () => {
    const state = shopReducer(start, { type: 'setName', name: 'x'.repeat(100) });
    expect(state.customName).toHaveLength(MAX_NAME_LENGTH);
  });

  it('does not restart a deploy that is already running', () => {
    const running = { ...start, status: 'deploying' as const, stepIndex: 2 };
    expect(shopReducer(running, { type: 'startDeploy' })).toBe(running);
  });
});

describe('displayName', () => {
  const business = content.shop.businesses[0];

  it('prefers the typed name and ignores whitespace-only input', () => {
    expect(business).toBeDefined();
    if (!business) return;
    expect(displayName({ ...start, customName: '  Amma Stores ' }, business)).toBe('Amma Stores');
    expect(displayName({ ...start, customName: '   ' }, business)).toBe(business.sampleName);
  });
});

describe('toSlug', () => {
  it('makes a readable address', () => {
    expect(toSlug("Ammachi's Bakery & Cafe!", 'x')).toBe('ammachi-s-bakery-cafe');
  });

  it('falls back when nothing latin is left', () => {
    expect(toSlug('മലയാളം', 'your-shop')).toBe('your-shop');
  });
});
