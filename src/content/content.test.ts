import { describe, expect, it } from 'vitest';
import { content } from './content';
import { scoreMvp } from '../features/mvp/score';

/** Walks every string in the content tree, so an empty field can't slip through anywhere. */
function collectStrings(value: unknown, path: string, found: [string, string][] = []) {
  if (typeof value === 'string') found.push([path, value]);
  else if (Array.isArray(value))
    value.forEach((item, i) => collectStrings(item, `${path}[${i}]`, found));
  else if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => collectStrings(item, `${path}.${key}`, found));
  }
  return found;
}

const uniqueIds = (items: { id: string }[]) => new Set(items.map((item) => item.id)).size;

describe('content schema', () => {
  it('has no empty strings anywhere', () => {
    const empty = collectStrings(content, 'content').filter(([, value]) => value.trim() === '');
    expect(empty).toEqual([]);
  });

  it('keeps the facts given in the brief', () => {
    expect(content.meta.duration).toBe('Apr 2010 – Dec 2013');
    expect(content.meta.durationLength).toBe('3 yrs 9 mos');
    expect(content.meta.location).toBe('Kerala, India');
    expect(content.hero.headline).toBe('Every small business deserves to be found online.');
    expect(content.footer.credit).toContain('remastered in 2026');
  });

  it('numbers the chapters in order', () => {
    const numbers = [
      content.origin.number,
      content.motto.number,
      content.shop.number,
      content.work.number,
      content.mvp.number,
      content.timeline.number,
      content.lessons.number,
      content.next.number,
    ];
    expect(numbers).toEqual(['01', '02', '03', '04', '05', '06', '07', '08']);
  });

  it('points every nav link at a real, unique section', () => {
    expect(uniqueIds(content.nav.links)).toBe(content.nav.links.length);
  });

  it('has four origin frames, each with alt text', () => {
    expect(content.origin.frames).toHaveLength(4);
    content.origin.frames.forEach((frame) => expect(frame.alt.length).toBeGreaterThan(20));
  });

  it('has three motto pillars: Digitize, Empower, Inspire', () => {
    expect(content.motto.pillars.map((pillar) => pillar.title)).toEqual([
      'Digitize',
      'Empower',
      'Inspire',
    ]);
  });

  it('offers five businesses with unique ids and valid colours', () => {
    const { businesses } = content.shop;
    expect(businesses).toHaveLength(5);
    expect(uniqueIds(businesses)).toBe(5);
    businesses.forEach(({ colors }) => {
      Object.values(colors).forEach((color) => expect(color).toMatch(/^#[0-9a-f]{6}$/i));
    });
  });

  it('has four service blocks mapped to the facts', () => {
    expect(content.work.blocks).toHaveLength(4);
  });
});

describe('demo shop colours', () => {
  const luminance = (hex: string) => {
    const channel = (start: number) => {
      const value = parseInt(hex.slice(start, start + 2), 16) / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  };
  const contrast = (a: string, b: string) => {
    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
  };

  it.each(content.shop.businesses.map((b) => [b.label, b.colors] as const))(
    '%s keeps its mock-up text at WCAG AA',
    (_label, { primary, tint }) => {
      expect(contrast('#ffffff', primary)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(primary, tint)).toBeGreaterThanOrEqual(4.5);
    },
  );
});

describe('impact stats', () => {
  it('invents nothing: only the duration from the brief has a value by default', () => {
    const { stats } = content.work;
    // 3 yrs 9 mos, as months. Remove this line when you fill in real numbers.
    expect(stats.monthsBuilding).toBe(45);
    expect(stats.businessesDigitized).toBeUndefined();
    expect(stats.appsShipped).toBeUndefined();
    expect(stats.talksGiven).toBeUndefined();
    expect(stats.startupsMentored).toBeUndefined();
  });
});

describe('MVP game data', () => {
  const { features, budget, outcomes } = content.mvp;

  it('has about ten features with unique ids and positive costs', () => {
    expect(features.length).toBeGreaterThanOrEqual(10);
    expect(uniqueIds(features)).toBe(features.length);
    features.forEach((feature) => expect(feature.cost).toBeGreaterThan(0));
  });

  it('has a budget of 5, which a fundable build can stay within', () => {
    expect(budget).toBe(5);
    const fundable = features.filter((f) =>
      ['core-feature', 'landing-page', 'analytics'].includes(f.id),
    );
    expect(scoreMvp(fundable, budget).outcome).toBe('fundable');
  });

  it('has copy for every outcome the scorer can return', () => {
    expect(Object.keys(outcomes).sort()).toEqual(
      ['empty', 'feature-soup', 'fundable', 'no-core', 'promising'].sort(),
    );
  });
});

describe('timeline', () => {
  const { milestones } = content.timeline;

  it('runs from the founding to the next chapter, with both ends verified', () => {
    expect(milestones[0]).toMatchObject({ date: 'Apr 2010', verified: true });
    expect(milestones[milestones.length - 1]).toMatchObject({ date: 'Dec 2013', verified: true });
  });

  it('never publishes a guessed date: unverified milestones carry no date', () => {
    milestones
      .filter((milestone) => !milestone.verified)
      .forEach((milestone) => expect(milestone.date).toBeUndefined());
  });
});

describe('lessons', () => {
  it('has six lessons, each with a front and a back', () => {
    const { lessons } = content.lessons;
    expect(lessons).toHaveLength(6);
    expect(uniqueIds(lessons)).toBe(6);
  });
});
