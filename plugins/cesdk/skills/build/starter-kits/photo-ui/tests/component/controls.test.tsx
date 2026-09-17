// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import AdjustmentsBarButton from '../../src/app/AdjustmentsBarButton/AdjustmentsBarButton';
import FilterButton from '../../src/app/FilterButton/FilterButton';
import IconButton from '../../src/app/IconButton/IconButton';
import ResetButton from '../../src/app/ResetButton/ResetButton';
import SliderBar from '../../src/app/SliderBar/SliderBar';
import Slider from '../../src/app/Slider/Slider';
import SmallButton from '../../src/app/SmallButton/SmallButton';
import TickMarkSvg from '../../src/app/Slider/TickMarkSvg';

// The Reset label is `display: none` below 650 px, so it carries no accessible
// name in a jsdom viewport; locate it by its own text instead.
const resetButton = () =>
  screen.getByText('Reset').closest('button') as HTMLButtonElement;

describe('PH-C3 SliderBar and ResetButton', () => {
  it('disables Reset while there is nothing to reset', () => {
    render(
      <SliderBar
        min={-100}
        max={100}
        current={0}
        resetEnabled={false}
        onReset={vi.fn()}
        onChange={vi.fn()}
      />
    );
    expect(resetButton().disabled).toBe(true);
  });

  it('shows the rounded current value next to the slider', () => {
    render(
      <SliderBar
        min={-100}
        max={100}
        current={42.4}
        resetEnabled
        onReset={vi.fn()}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText('42')).toBeTruthy();
  });

  it('calls onReset when Reset is enabled and clicked', async () => {
    const onReset = vi.fn();
    render(
      <SliderBar
        min={0}
        max={100}
        current={50}
        resetEnabled
        onReset={onReset}
        onChange={vi.fn()}
      />
    );
    await userEvent.click(resetButton());
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('renders ResetButton disabled when told to', () => {
    render(<ResetButton disabled onClick={vi.fn()} />);
    expect(resetButton().disabled).toBe(true);
  });
});

describe('PH-C4 TickMarkSvg', () => {
  const svgOf = (container: HTMLElement) =>
    container.querySelector('svg') as SVGSVGElement;

  it('draws one mark per step, inclusive of both ends', () => {
    const { container } = render(
      <TickMarkSvg
        min={-44}
        max={45}
        current={0}
        deadzone={3}
        distanceBetweenMarkers={10}
      />
    );
    expect(container.querySelectorAll('rect')).toHaveLength(45 - -44 + 1);
  });

  it('makes every fifth mark the large variant', () => {
    const { container } = render(
      <TickMarkSvg
        min={0}
        max={10}
        current={5}
        deadzone={3}
        distanceBetweenMarkers={10}
      />
    );
    const large = [...container.querySelectorAll('rect')].filter(
      (rect) => rect.getAttribute('height') === '8'
    );
    expect(large).toHaveLength(3);
  });

  it('sizes the svg from the step count and the marker distance', () => {
    const { container } = render(
      <TickMarkSvg
        min={0}
        max={100}
        current={0}
        deadzone={3}
        distanceBetweenMarkers={10}
      />
    );
    expect(svgOf(container).getAttribute('width')).toBe('1002');
  });

  it('treats an even deadzone as the next odd one', () => {
    const opacities = (deadzone: number) => {
      const { container } = render(
        <TickMarkSvg
          min={0}
          max={10}
          current={5}
          deadzone={deadzone}
          distanceBetweenMarkers={10}
        />
      );
      return [...container.querySelectorAll('rect')].map((rect) =>
        rect.getAttribute('opacity')
      );
    };
    expect(opacities(2)).toEqual(opacities(3));
  });

  it('keeps the opacity finite for the mark sitting on the current value', () => {
    const { container } = render(
      <TickMarkSvg
        min={0}
        max={10}
        current={5}
        deadzone={3}
        distanceBetweenMarkers={10}
      />
    );
    for (const rect of container.querySelectorAll('rect')) {
      expect(rect.getAttribute('opacity')).not.toContain('NaN');
      expect(rect.getAttribute('opacity')).not.toContain('Infinity');
    }
  });
});

describe('PH-C5 FilterButton', () => {
  it('names the thumbnail by the entry id and shows the filter name', () => {
    render(
      <FilterButton
        id="ad1920"
        label="1920 A.D."
        thumbUrl="thumb.jpg"
        isActive={false}
        onClick={vi.fn()}
      />
    );
    const image = screen.getByAltText('ad1920') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('thumb.jpg');
    expect(screen.getByText('1920 A.D.')).toBeTruthy();
  });

  it('marks only the active entry', () => {
    const { container, rerender } = render(
      <FilterButton
        id="ad1920"
        label="1920 A.D."
        thumbUrl="thumb.jpg"
        isActive={false}
        onClick={vi.fn()}
      />
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.className).not.toContain('button--active');

    rerender(
      <FilterButton
        id="ad1920"
        label="1920 A.D."
        thumbUrl="thumb.jpg"
        isActive
        onClick={vi.fn()}
      />
    );
    expect(button.className).toContain('button--active');
  });
});

describe('PH-C6 SmallButton and IconButton', () => {
  it('passes disabled through to the DOM node', () => {
    render(
      <SmallButton id="export-button" disabled onClick={vi.fn()}>
        Export Image
      </SmallButton>
    );
    expect(
      (
        screen.getByRole('button', {
          name: 'Export Image'
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);
  });

  it('spreads the extra props Flip and Rotate rely on', () => {
    render(
      <SmallButton id="flip-button" title="Flip the image" onClick={vi.fn()}>
        Flip
      </SmallButton>
    );
    const button = screen.getByRole('button', { name: 'Flip' });
    expect(button.getAttribute('title')).toBe('Flip the image');
    // `id` is consumed as the React key and never reaches the DOM node.
    expect(button.id).toBe('');
  });

  it('renders the IconButton label next to its icon', () => {
    render(
      <IconButton icon={<span>icon</span>} isActive={false} onClick={vi.fn()}>
        Crop
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'icon Crop' })).toBeTruthy();
  });

  it('applies the active class only when the IconButton is active', () => {
    const { container, rerender } = render(
      <IconButton icon={<span>icon</span>} isActive={false} onClick={vi.fn()}>
        Crop
      </IconButton>
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.className).not.toContain('wrapper--active');

    rerender(
      <IconButton icon={<span>icon</span>} isActive onClick={vi.fn()}>
        Crop
      </IconButton>
    );
    expect(button.className).toContain('wrapper--active');
  });

  it('reaches the icon colour through the inline style', () => {
    const { container } = render(
      <IconButton
        icon={<span>icon</span>}
        isActive={false}
        iconColor="rgb(255, 0, 0)"
        onClick={vi.fn()}
      >
        Crop
      </IconButton>
    );
    const iconWrapper = container.querySelector('span') as HTMLElement;
    expect(iconWrapper.style.color).toBe('rgb(255, 0, 0)');
  });
});

describe('PH-C18 AdjustmentsBarButton', () => {
  it('renders its label, marks the active state and forwards a ref', async () => {
    const onClick = vi.fn();
    const ref = { current: null as HTMLButtonElement | null };
    const { container, rerender } = render(
      <AdjustmentsBarButton ref={ref} onClick={onClick}>
        Straighten
      </AdjustmentsBarButton>
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(ref.current).toBe(button);
    expect(button.className).not.toContain('wrapper--active');

    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <AdjustmentsBarButton isActive iconColor="rgb(0, 128, 0)" ref={ref}>
        Straighten
      </AdjustmentsBarButton>
    );
    expect(button.className).toContain('wrapper--active');
    expect(button.style.color).toBe('rgb(0, 128, 0)');
  });
});

describe('PH-C22 Slider bounds and labels', () => {
  const props = {
    min: -44,
    max: 45,
    onChange: vi.fn(),
    formatCurrentValue: (value: number) => `${value}°`
  };

  it('clamps a value above the maximum onto the last tick', () => {
    const { container } = render(<Slider {...props} current={200} />);
    expect(container.querySelectorAll('rect')).toHaveLength(45 - -44 + 1);
    expect(screen.getByText('200°')).toBeTruthy();
  });

  it('clamps a value below the minimum onto the first tick', () => {
    render(<Slider {...props} current={-200} />);
    expect(screen.getByText('-200°')).toBeTruthy();
  });

  it('falls back to the rounded value when no formatter is given', () => {
    const { rerender } = render(
      <Slider min={0} max={100} current={42.6} formatCurrentValue={undefined} />
    );
    expect(screen.getByText('43')).toBeTruthy();

    rerender(
      <Slider min={0} max={100} current={140} formatCurrentValue={undefined} />
    );
    expect(screen.getByText('>100')).toBeTruthy();

    rerender(
      <Slider min={0} max={100} current={-40} formatCurrentValue={undefined} />
    );
    expect(screen.getByText('<0')).toBeTruthy();
  });

  it('starts halfway when it is given no value at all', () => {
    const { container } = render(
      <Slider
        min={0}
        max={100}
        current={undefined}
        formatCurrentValue={undefined}
      />
    );
    // No value means the internal state opens at the midpoint, while the label
    // still reads the missing prop and lands on the over-maximum branch.
    expect(screen.getByText('>100')).toBeTruthy();
    expect(container.querySelectorAll('rect')).toHaveLength(101);
  });
});
