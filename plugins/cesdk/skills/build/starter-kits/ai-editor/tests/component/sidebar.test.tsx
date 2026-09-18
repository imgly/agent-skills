// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AIProviders } from '../../src/app/ai-sidebar';
import { Sidebar } from '../../src/app/Sidebar/Sidebar';
import { Topbar } from '../../src/app/Topbar/Topbar';

function providers(): AIProviders {
  return {
    text2image: {
      name: 'Text to Image',
      supportedModes: ['Design', 'Video'],
      providers: [
        {
          modelId: 'vendor/one',
          name: 'Model One',
          label: 'Vendor',
          selected: true,
          provider: () => ({})
        },
        {
          modelId: 'vendor/two',
          name: 'Model Two',
          label: 'Vendor',
          selected: false,
          provider: () => ({})
        }
      ]
    }
  };
}

function applyButton(): HTMLButtonElement {
  return screen.getByRole('button', {
    name: 'Apply Changes'
  }) as HTMLButtonElement;
}

let onApplyChanges: ReturnType<typeof vi.fn>;

beforeEach(() => {
  onApplyChanges = vi.fn();
});

describe('AIE-C2 Sidebar', () => {
  it('starts collapsed and shows the selected count', () => {
    render(<Sidebar providers={providers()} onApplyChanges={onApplyChanges} />);

    const group = screen.getByRole('button', { name: /^Text to Image/ });
    expect(group.getAttribute('aria-expanded')).toBe('false');
    expect(group.textContent).toContain('1/2');
    expect(screen.queryByText('Model One')).toBeNull();
  });

  it('reveals its models when the group is opened', async () => {
    render(<Sidebar providers={providers()} onApplyChanges={onApplyChanges} />);
    await userEvent.click(
      screen.getByRole('button', { name: /^Text to Image/ })
    );

    expect(screen.getByText('Model One')).toBeDefined();
    expect(screen.getByText('Model Two')).toBeDefined();
  });

  it('keeps Apply Changes disabled until a flag differs', async () => {
    render(<Sidebar providers={providers()} onApplyChanges={onApplyChanges} />);
    expect(applyButton().disabled).toBe(true);

    await userEvent.click(
      screen.getByRole('button', { name: /^Text to Image/ })
    );
    await userEvent.click(screen.getByText('Model Two'));
    expect(applyButton().disabled).toBe(false);

    await userEvent.click(screen.getByText('Model Two'));
    expect(applyButton().disabled).toBe(true);
  });

  it('hands the edited selection to the host on Apply Changes', async () => {
    render(<Sidebar providers={providers()} onApplyChanges={onApplyChanges} />);
    await userEvent.click(
      screen.getByRole('button', { name: /^Text to Image/ })
    );
    await userEvent.click(screen.getByText('Model One'));
    await userEvent.click(
      screen.getByRole('button', { name: 'Apply Changes' })
    );

    expect(onApplyChanges).toHaveBeenCalledTimes(1);
    const applied = onApplyChanges.mock.calls[0][0] as AIProviders;
    expect(applied.text2image!.providers.map((p) => p.selected)).toEqual([
      false,
      false
    ]);
  });

  it('resets to the state the host supplies', async () => {
    const { rerender } = render(
      <Sidebar providers={providers()} onApplyChanges={onApplyChanges} />
    );
    await userEvent.click(
      screen.getByRole('button', { name: /^Text to Image/ })
    );
    await userEvent.click(screen.getByText('Model Two'));
    expect(applyButton().disabled).toBe(false);

    rerender(
      <Sidebar providers={providers()} onApplyChanges={onApplyChanges} />
    );
    expect(applyButton().disabled).toBe(true);
  });
});

describe('AIE-C3 Topbar', () => {
  it('marks the current mode active and reports only a real change', async () => {
    const onModeChange = vi.fn();
    render(
      <Topbar
        modes={['Design', 'Video', 'Photo']}
        currentMode="Design"
        onModeChange={onModeChange}
      />
    );

    // CSS module class names come through unscoped.
    expect(screen.getByRole('button', { name: 'Design' }).className).toContain(
      'active'
    );

    await userEvent.click(screen.getByRole('button', { name: 'Design' }));
    expect(onModeChange).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Video' }));
    expect(onModeChange).toHaveBeenCalledWith('Video');
  });
});
