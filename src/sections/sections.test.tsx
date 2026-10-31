import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentType, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { RetroSkin } from '../components/RetroSkin';
import { content } from '../content/content';
import { CursorProvider } from '../providers/CursorProvider';
import { SmoothScrollProvider } from '../providers/SmoothScrollProvider';
import { ThemeProvider } from '../providers/ThemeProvider';
import Footer from './Footer';
import Hero from './Hero';
import Lessons from './Lessons';
import Motto from './Motto';
import MvpBuilder from './MvpBuilder';
import NextChapter from './NextChapter';
import Origin from './Origin';
import Preloader, { shouldShowPreloader } from './Preloader';
import ShopOnline from './ShopOnline';
import Timeline from './Timeline';
import WhatWeDid, { visibleStats } from './WhatWeDid';

// src/test/setup.ts reports prefers-reduced-motion, so all of this runs the static experience.

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SmoothScrollProvider>
        <CursorProvider>{children}</CursorProvider>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

const renderWithProviders = (ui: ReactNode) => render(<Providers>{ui}</Providers>);

const SECTIONS: [string, ComponentType, string][] = [
  ['Hero', Hero, content.hero.headline],
  ['Origin', Origin, content.origin.title],
  ['Motto', Motto, content.motto.text],
  ['ShopOnline', ShopOnline, content.shop.title],
  ['WhatWeDid', WhatWeDid, content.work.title],
  ['MvpBuilder', MvpBuilder, content.mvp.title],
  ['Timeline', Timeline, content.timeline.title],
  ['Lessons', Lessons, content.lessons.title],
  ['NextChapter', NextChapter, content.next.title],
  ['Footer', Footer, content.footer.title],
];

describe('every section with reduced motion', () => {
  it.each(SECTIONS)('%s renders its heading without errors', (_name, Section, heading) => {
    const consoleError = vi.spyOn(console, 'error');
    renderWithProviders(<Section />);
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });
});

describe('Preloader', () => {
  it('never shows with reduced motion', () => {
    expect(shouldShowPreloader(true)).toBe(false);
  });

  it('shows on the first visit of a session, and not after', () => {
    sessionStorage.clear();
    expect(shouldShowPreloader(false)).toBe(true);
    sessionStorage.setItem('addin:booted', '1');
    expect(shouldShowPreloader(false)).toBe(false);
    sessionStorage.clear();
  });

  it('still mounts cleanly if asked to', () => {
    renderWithProviders(<Preloader onDone={vi.fn()} />);
    expect(screen.getByRole('status', { name: content.preloader.statusLabel })).toBeInTheDocument();
  });
});

describe('Hero', () => {
  it('uses the SVG network when WebGL is not available', () => {
    const { container } = renderWithProviders(<Hero />);
    expect(container.querySelector('canvas')).toBeNull();
    expect(container.querySelector('svg circle')).not.toBeNull();
  });
});

describe('Origin', () => {
  it('gives each frame a described drawing and readable text', () => {
    renderWithProviders(<Origin />);
    content.origin.frames.forEach((frame) => {
      expect(screen.getByRole('img', { name: frame.alt })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: frame.title })).toBeInTheDocument();
    });
  });
});

describe('WhatWeDid', () => {
  it('hides every stat that has no value', () => {
    renderWithProviders(<WhatWeDid />);
    expect(screen.queryByText(content.work.statLabels.appsShipped)).not.toBeInTheDocument();
    expect(screen.queryByText(content.work.statLabels.businessesDigitized)).not.toBeInTheDocument();
    expect(screen.getByText(content.work.statLabels.monthsBuilding)).toBeInTheDocument();
  });

  it('shows a stat as soon as it gets a number, including zero', () => {
    const keys = visibleStats({ appsShipped: 3, talksGiven: 0 }).map((stat) => stat.key);
    expect(keys).toEqual(['appsShipped', 'talksGiven']);
    expect(visibleStats({})).toEqual([]);
  });
});

describe('ShopOnline', () => {
  it('labels itself as a demo', () => {
    renderWithProviders(<ShopOnline />);
    expect(screen.getByText(content.shop.demoNotice)).toBeInTheDocument();
  });

  it('draws a typed name into the mock-ups', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ShopOnline />);
    await user.type(screen.getByLabelText(content.shop.nameLabel), 'Amma Stores');
    expect(screen.getAllByText('Amma Stores').length).toBeGreaterThan(1);
    expect(screen.getByText('www.amma-stores.example')).toBeInTheDocument();
  });

  it('switches business from the choices', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ShopOnline />);
    await user.click(screen.getByRole('radio', { name: 'Bakery' }));
    expect(screen.getAllByText('Puthiya Bakery').length).toBeGreaterThan(0);
  });

  it('has a keyboard-operable slider with correct aria values', () => {
    renderWithProviders(<ShopOnline />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-valuenow', '50');
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '100');

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(slider).toHaveAttribute('aria-valuenow', '55');
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(slider).toHaveAttribute('aria-valuenow', '45');
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(slider).toHaveAttribute('aria-valuenow', '0');
    fireEvent.keyDown(slider, { key: 'End' });
    expect(slider).toHaveAttribute('aria-valuenow', '100');
  });

  it('goes live straight away with reduced motion, and can start over', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ShopOnline />);
    await user.click(screen.getByRole('button', { name: content.shop.deployLabel }));
    expect(screen.getByText(content.shop.liveMessage)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: content.shop.deployAgainLabel }));
    expect(screen.queryByText(content.shop.liveMessage)).not.toBeInTheDocument();
  });
});

describe('MvpBuilder', () => {
  const addButton = (label: string) =>
    screen.getByRole('button', { name: `${content.mvp.addLabel} ${label}` });

  it('builds with the click alternative and shows the fundable result', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MvpBuilder />);

    await user.click(addButton('The one core feature'));
    await user.click(addButton('Landing page'));
    await user.click(addButton('Analytics'));
    expect(screen.getByText(`4 / 5 ${content.mvp.budgetLabel}`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: content.mvp.submitLabel }));
    expect(
      screen.getByRole('heading', { name: content.mvp.outcomes.fundable.title }),
    ).toHaveFocus();
    expect(screen.getByRole('meter', { name: content.mvp.gaugeLabel })).toHaveAttribute(
      'aria-valuenow',
      '95',
    );
    expect(screen.getByText(content.mvp.lesson)).toBeInTheDocument();
  });

  it('refuses to go over budget and says why', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MvpBuilder />);
    await user.click(addButton('Native mobile app'));
    await user.click(addButton('Payments'));
    await user.click(addButton('Chat'));
    expect(screen.getByText(content.mvp.overBudget)).toBeInTheDocument();
    expect(screen.getByText(`5 / 5 ${content.mvp.budgetLabel}`)).toBeInTheDocument();
  });

  it('removes a feature with the same control, and Try again starts over', async () => {
    const user = userEvent.setup();
    renderWithProviders(<MvpBuilder />);
    await user.click(addButton('Login'));
    const tileToggle = screen.getAllByRole('button', {
      name: `${content.mvp.removeLabel} Login`,
    })[0];
    expect(tileToggle).toBeDefined();
    if (tileToggle) await user.click(tileToggle);
    expect(screen.getByText(`0 / 5 ${content.mvp.budgetLabel}`)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: content.mvp.submitLabel }));
    await user.click(screen.getByRole('button', { name: content.mvp.tryAgainLabel }));
    expect(screen.getByText(content.mvp.zoneEmpty)).toBeInTheDocument();
  });
});

describe('Timeline', () => {
  it('uses the disclosure pattern for each milestone', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Timeline />);
    const first = content.timeline.milestones[0];
    expect(first).toBeDefined();
    if (!first) return;

    const trigger = screen.getByRole('button', { name: first.title });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const panel = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
    expect(panel).toHaveTextContent(first.detail);

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Enter}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows a date only where one is confirmed', () => {
    renderWithProviders(<Timeline />);
    expect(screen.getByText('Apr 2010')).toBeInTheDocument();
    expect(screen.getByText('Dec 2013')).toBeInTheDocument();
    const dated = content.timeline.milestones.filter((milestone) => milestone.date);
    expect(dated).toHaveLength(2);
  });
});

describe('Lessons', () => {
  it('shows every lesson and reflection at once with reduced motion', () => {
    renderWithProviders(<Lessons />);
    const list = screen.getByRole('list');
    content.lessons.lessons.forEach((lesson) => {
      expect(within(list).getByRole('heading', { name: lesson.front })).toBeInTheDocument();
      expect(within(list).getByText(lesson.back)).toBeInTheDocument();
    });
  });
});

describe('NextChapter', () => {
  it('ends on the closing line', () => {
    renderWithProviders(<NextChapter />);
    expect(screen.getByText(content.next.closing)).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('links out and has a working back-to-top control', async () => {
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    const user = userEvent.setup();
    renderWithProviders(<Footer />);

    content.footer.links.forEach((link) => {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.href);
    });
    expect(screen.getByText(content.footer.credit)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: content.footer.backToTop }));
    expect(scrollTo).toHaveBeenCalledWith(0, 0);
  });
});

describe('Retro skin easter egg', () => {
  it('toggles data-skin on <html> when 2010 is typed, with a toast to exit', async () => {
    const user = userEvent.setup();
    render(<RetroSkin />);
    expect(document.documentElement).not.toHaveAttribute('data-skin');

    await user.keyboard('2010');
    expect(document.documentElement).toHaveAttribute('data-skin', 'retro');
    expect(screen.getByRole('status')).toHaveTextContent(content.easterEgg.onMessage);

    await user.click(screen.getByRole('button', { name: content.easterEgg.exitLabel }));
    expect(document.documentElement).not.toHaveAttribute('data-skin');
    expect(screen.getByRole('status')).toHaveTextContent(content.easterEgg.offMessage);
  });
});
