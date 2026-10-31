import { fireEvent, render, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KONAMI_CODE, useKeySequence } from './useKeySequence';

const SEQUENCE = ['2', '0', '1', '0'];
const press = (keys: readonly string[], target: Element | Window = window) =>
  keys.forEach((key) => fireEvent.keyDown(target, { key }));

describe('useKeySequence', () => {
  it('fires when the keys arrive in order', () => {
    const onMatch = vi.fn();
    renderHook(() => useKeySequence(SEQUENCE, onMatch));
    press(['2', '0', '1', '0']);
    expect(onMatch).toHaveBeenCalledTimes(1);
  });

  it('does not fire for a partial or wrong sequence', () => {
    const onMatch = vi.fn();
    renderHook(() => useKeySequence(SEQUENCE, onMatch));
    press(['2', '0', '1']);
    press(['1', '0', '2', '0']);
    expect(onMatch).not.toHaveBeenCalled();
  });

  it('still matches after stray keys come first', () => {
    const onMatch = vi.fn();
    renderHook(() => useKeySequence(SEQUENCE, onMatch));
    press(['x', '2', '2', '0', '1', '0']);
    expect(onMatch).toHaveBeenCalledTimes(1);
  });

  it('can fire again after a match', () => {
    const onMatch = vi.fn();
    renderHook(() => useKeySequence(SEQUENCE, onMatch));
    press(['2', '0', '1', '0', '2', '0', '1', '0']);
    expect(onMatch).toHaveBeenCalledTimes(2);
  });

  it('ignores letter case, so the Konami code works with caps lock on', () => {
    const onMatch = vi.fn();
    renderHook(() => useKeySequence(KONAMI_CODE, onMatch));
    press([...KONAMI_CODE.slice(0, 8), 'B', 'A']);
    expect(onMatch).toHaveBeenCalledTimes(1);
  });

  it('ignores typing in form fields, so a shop named "2010" stays harmless', () => {
    const onMatch = vi.fn();
    renderHook(() => useKeySequence(SEQUENCE, onMatch));
    const { getByRole } = render(<input aria-label="name" />);
    press(['2', '0', '1', '0'], getByRole('textbox'));
    expect(onMatch).not.toHaveBeenCalled();
  });

  it('always calls the latest callback without re-subscribing', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ callback }) => useKeySequence(SEQUENCE, callback), {
      initialProps: { callback: first },
    });
    rerender({ callback: second });
    press(['2', '0', '1', '0']);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('stops listening after unmount', () => {
    const onMatch = vi.fn();
    const { unmount } = renderHook(() => useKeySequence(SEQUENCE, onMatch));
    unmount();
    press(['2', '0', '1', '0']);
    expect(onMatch).not.toHaveBeenCalled();
  });
});
