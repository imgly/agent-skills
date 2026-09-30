// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import AlignmentSelect from '../../src/app/ui/AlignmentSelect/AlignmentSelect';
import AdjustmentsBarButton from '../../src/app/ui/AdjustmentsBarButton/AdjustmentsBarButton';
import IconButton from '../../src/app/ui/IconButton/IconButton';
import Stack from '../../src/app/ui/Stack/Stack';

// `AdjustmentsBar` reports its height into the single-page focus padding, which
// is engine state a component test has no business owning.
vi.mock('../../src/app/contexts/SinglePageModeContext', () => ({
  useSinglePageMode: () => ({ setPaddingBottom: vi.fn() })
}));

// `useToolbarHeight` observes the bar; jsdom ships no ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as never;

const Icon = () => <span>icon</span>;

describe('PB-C1 IconButton and AdjustmentsBarButton', () => {
  it('renders the label only when children are given', () => {
    const { rerender, container } = render(
      <IconButton icon={<Icon />} onClick={vi.fn()} />
    );
    expect(container.querySelector('button')?.textContent).toBe('icon');

    rerender(
      <IconButton icon={<Icon />} onClick={vi.fn()}>
        Theme
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'icon Theme' })).toBeTruthy();
  });

  it('applies the active class only when isActive', () => {
    const { container, rerender } = render(
      <IconButton icon={<Icon />} onClick={vi.fn()} />
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.className).not.toContain('wrapper--active');

    rerender(<IconButton icon={<Icon />} isActive onClick={vi.fn()} />);
    expect(button.className).toContain('wrapper--active');
  });

  it('reaches the icon colour through the inline style', () => {
    const { container } = render(
      <IconButton
        icon={<Icon />}
        iconColor="rgb(255, 0, 0)"
        onClick={vi.fn()}
      />
    );
    const iconWrapper = container.querySelector('span') as HTMLElement;
    expect(iconWrapper.style.color).toBe('rgb(255, 0, 0)');
  });

  it('spreads the extra props onto the button', async () => {
    const onClick = vi.fn();
    render(
      <IconButton icon={<Icon />} onClick={onClick} title="Change the theme" />
    );
    const button = screen.getByRole('button');
    expect(button.getAttribute('title')).toBe('Change the theme');

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders AdjustmentsBarButton with its label, colour and active state', () => {
    const { container } = render(
      <AdjustmentsBarButton
        isActive
        iconColor="rgb(0, 0, 255)"
        onClick={vi.fn()}
      >
        Layout
      </AdjustmentsBarButton>
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(screen.getByText('Layout')).toBeTruthy();
    expect(button.className).toContain('wrapper--active');
    expect(button.style.color).toBe('rgb(0, 0, 255)');
  });

  it('forwards a ref onto the AdjustmentsBarButton element', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(
      <AdjustmentsBarButton ref={ref} onClick={vi.fn()}>
        Theme
      </AdjustmentsBarButton>
    );
    expect(ref.current?.tagName).toBe('BUTTON');
  });
});

describe('PB-C3 AlignmentSelect', () => {
  it('offers exactly the three alignments and emits their engine values', async () => {
    const onClick = vi.fn();
    const { container } = render(
      <AlignmentSelect onClick={onClick} activeAlignment="Left" />
    );
    const buttons = [...container.querySelectorAll('button')];
    expect(buttons).toHaveLength(3);

    for (const button of buttons) {
      await userEvent.click(button);
    }
    expect(onClick.mock.calls.map(([value]) => value)).toEqual([
      'Left',
      'Center',
      'Right'
    ]);
  });
});

describe('PB-C6 Stack', () => {
  it('applies the default gap and an explicit one', () => {
    const { container, rerender } = render(
      <Stack>
        <span>child</span>
      </Stack>
    );
    const stack = container.firstElementChild as HTMLElement;
    expect(stack.className).toContain('stack--gap-md');

    rerender(
      <Stack gap="xl">
        <span>child</span>
      </Stack>
    );
    expect((container.firstElementChild as HTMLElement).className).toContain(
      'stack--gap-xl'
    );
  });
});
