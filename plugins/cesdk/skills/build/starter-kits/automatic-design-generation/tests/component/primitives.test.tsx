// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import type React from 'react';

import { Button } from '../../src/app/Button/Button';
import { CaretBottom } from '../../src/app/CustomizationPanel/CaretBottom';
import { Spinner } from '../../src/app/Spinner/Spinner';
import { StepIndicator } from '../../src/app/StepIndicator/StepIndicator';

// ADG-C1
describe('Button', () => {
  it('is a primary medium button by default', () => {
    render(<Button>Generate</Button>);
    const button = screen.getByRole('button', { name: 'Generate' });

    expect(button.className).toContain('primary');
    expect(button.className).not.toContain('small');
    expect((button as HTMLButtonElement).disabled).toBe(false);
  });

  it('takes the variant, the size and an extra class from its props', () => {
    render(
      <Button variant="secondary" size="small" className="wide">
        Back
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Back' });

    expect(button.className).toContain('secondary');
    expect(button.className).toContain('small');
    expect(button.className).toContain('wide');
  });

  it('never calls back while it is disabled', async () => {
    // A disabled button has `pointer-events: none`, which user-event refuses to
    // click unless the check is switched off.
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Next
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls back on a click when it is enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Next</Button>);

    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

// ADG-C2
describe('Spinner and CaretBottom', () => {
  it('renders the spinner inside its own wrapper', () => {
    const { container } = render(<Spinner />);

    expect(container.querySelector('[class*="loadingSpinner"]')).not.toBeNull();
    expect(container.querySelector('[class*="spinner"]')).not.toBeNull();
  });

  it('renders the caret as an svg that inherits the text colour', () => {
    const { container } = render(<CaretBottom />);
    const svg = container.querySelector('svg');

    expect(svg?.getAttribute('viewBox')).toBe('0 0 8 4');
    expect(svg?.querySelector('path')?.getAttribute('fill')).toBe(
      'currentColor'
    );
  });
});

// ADG-C3
describe('StepIndicator', () => {
  function renderSteps(
    overrides: Partial<React.ComponentProps<typeof StepIndicator>> = {}
  ) {
    const props: React.ComponentProps<typeof StepIndicator> = {
      currentStep: 2,
      onStepClick: vi.fn(),
      onBack: vi.fn(),
      onNext: vi.fn(),
      ...overrides
    };
    render(<StepIndicator {...props} />);
    return props;
  }

  it('marks the current step active, the ones before it complete and the rest inactive', () => {
    renderSteps();
    const className = (label: string) =>
      screen.getByText(label).className + screen.getByText(label).className;

    expect(className('Select')).toContain('labelCompleted');
    expect(className('Customize')).toContain('labelActive');
    expect(className('Generate')).toContain('labelInactive');
  });

  it('lets the user go back to a step they have reached, and no further', () => {
    renderSteps();

    expect(
      (screen.getByText('Generate').closest('button') as HTMLButtonElement)
        .disabled
    ).toBe(true);
    expect(
      (screen.getByText('Select').closest('button') as HTMLButtonElement)
        .disabled
    ).toBe(false);
  });

  it('reports the step a user picks', async () => {
    const user = userEvent.setup();
    const props = renderSteps();

    await user.click(screen.getByText('Select'));

    expect(props.onStepClick).toHaveBeenCalledWith(1);
  });

  it('disables Back on the first step and Next on the last', () => {
    renderSteps({ currentStep: 1 });
    expect(
      (screen.getByRole('button', { name: 'Back' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);

    renderSteps({ currentStep: 3 });
    expect(
      (
        screen.getAllByRole('button', {
          name: 'Next'
        })[1] as HTMLButtonElement
      ).disabled
    ).toBe(true);
  });

  it('disables Next while the step is incomplete', () => {
    renderSteps({ canGoNext: false });

    expect(
      (screen.getByRole('button', { name: 'Next' }) as HTMLButtonElement)
        .disabled
    ).toBe(true);
  });

  it('moves one step at a time with Back and Next', async () => {
    const user = userEvent.setup();
    const props = renderSteps();

    await user.click(screen.getByRole('button', { name: 'Back' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(props.onBack).toHaveBeenCalledTimes(1);
    expect(props.onNext).toHaveBeenCalledTimes(1);
  });
});
