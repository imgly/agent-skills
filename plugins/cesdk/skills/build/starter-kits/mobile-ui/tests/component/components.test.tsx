// @vitest-environment jsdom
import {
  act,
  render,
  renderHook,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import AlignmentSelect from '../../src/app/components/AlignmentSelect/AlignmentSelect';
import Card from '../../src/app/components/Card/Card';
import IconButton from '../../src/app/components/IconButton/IconButton';
import InspectorBar from '../../src/app/components/InspectorBar/InspectorBar';
import Modal from '../../src/app/components/Modal/Modal';
import Select from '../../src/app/components/Select/Select';
import Slider from '../../src/app/components/Slider/Slider';
import SliderLabel from '../../src/app/components/SliderLabel/SliderLabel';
import useDebounceCallback from '../../src/app/components/UseDebounceCallback';

const Icon = () => <span>icon</span>;

// react-slider measures its track on mount; jsdom ships no ResizeObserver.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverStub as never;

describe('MB-C1 IconButton drops its children', () => {
  it('renders its children next to the icon', () => {
    render(
      <IconButton icon={<Icon />} isActive={false}>
        Delete
      </IconButton>
    );
    expect(screen.getByRole('button', { name: /Delete/ })).toBeTruthy();
  });

  it('marks the active button and reaches the icon colour', () => {
    const { container } = render(
      <IconButton icon={<Icon />} isActive iconColor="rgb(255, 0, 0)" />
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.className).toContain('wrapper--active');
    const iconWrapper = button.querySelector('span') as HTMLElement;
    expect(iconWrapper.style.color).toBe('rgb(255, 0, 0)');
  });

  it('applies the size and theme variants', () => {
    const { container } = render(
      <IconButton icon={<Icon />} size="sm" theme="primary" />
    );
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.className).toContain('wrapper--size-sm');
    expect(button.className).toContain('wrapper--theme-primary');
  });

  it('spreads the remaining button props', () => {
    render(<IconButton icon={<Icon />} title="download" disabled />);
    const button = screen.getByRole('button') as HTMLButtonElement;
    expect(button.getAttribute('title')).toBe('download');
    expect(button.disabled).toBe(true);
    // The icon's own text wins over the title, so the name is not "download".
    expect(button.textContent).toBe('icon');
  });
});

describe('MB-C2 InspectorBar', () => {
  const adjustments = [
    { id: 'left-one', Icon, align: 'left' as const },
    { id: 'middle-one', Icon },
    { id: 'right-one', Icon, align: 'right' as const }
  ];

  it('partitions the entries into left, middle and right', () => {
    const { container } = render(
      <InspectorBar
        adjustments={adjustments}
        onAdjustmentChange={vi.fn()}
        hasDeleteButton={false}
      />
    );
    const columns = container.querySelectorAll(':scope > div > div');
    expect(columns).toHaveLength(3);
    for (const column of columns) {
      expect(column.querySelectorAll('button')).toHaveLength(1);
    }
  });

  it('defaults an entry with no align to the middle column', () => {
    const { container } = render(
      <InspectorBar
        adjustments={[
          { id: 'a', Icon },
          { id: 'b', Icon }
        ]}
        onAdjustmentChange={vi.fn()}
        hasDeleteButton={false}
      />
    );
    const columns = container.querySelectorAll(':scope > div > div');
    expect(columns[1].querySelectorAll('button')).toHaveLength(2);
  });

  it('marks the active entry', () => {
    const { container } = render(
      <InspectorBar
        adjustments={adjustments}
        activeAdjustmentId="middle-one"
        onAdjustmentChange={vi.fn()}
        hasDeleteButton={false}
      />
    );
    const active = [...container.querySelectorAll('button')].filter((button) =>
      button.className.includes('wrapper--active')
    );
    expect(active).toHaveLength(1);
  });

  it('opens an inactive entry and closes the active one', async () => {
    const onAdjustmentChange = vi.fn();
    const { container } = render(
      <InspectorBar
        adjustments={adjustments}
        activeAdjustmentId="middle-one"
        onAdjustmentChange={onAdjustmentChange}
        hasDeleteButton={false}
      />
    );
    const [left, middle] = [...container.querySelectorAll('button')];

    await userEvent.click(middle);
    expect(onAdjustmentChange).toHaveBeenLastCalledWith();

    await userEvent.click(left);
    expect(onAdjustmentChange).toHaveBeenLastCalledWith('left-one');
  });

  it('names each entry from its label', () => {
    render(
      <InspectorBar
        adjustments={[{ id: 'font', label: 'Font', Icon }]}
        onAdjustmentChange={vi.fn()}
        hasDeleteButton={false}
      />
    );
    expect(screen.getByRole('button', { name: 'Font' })).toBeTruthy();
  });
});

describe('MB-C4 Modal and Card', () => {
  it('renders the modal title as a heading and closes', async () => {
    const onClose = vi.fn();
    render(
      <Modal title="Size" onClose={onClose}>
        <p>body</p>
      </Modal>
    );
    expect(screen.getByRole('heading', { name: 'Size' })).toBeTruthy();
    expect(screen.getByText('body')).toBeTruthy();

    await userEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders a Card as a button and omits the image when none is given', () => {
    const { container } = render(<Card>content</Card>);
    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(container.querySelector('img')).toBeNull();
  });

  it('names the Card image with its ariaLabel', () => {
    render(<Card backgroundImage="sticker.png" ariaLabel="a sticker" />);
    const image = screen.getByAltText('a sticker') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe('sticker.png');
  });
});

describe('MB-C5 AlignmentSelect and Select', () => {
  it('offers exactly the three alignments the engine takes', async () => {
    const onClick = vi.fn();
    const { container } = render(<AlignmentSelect onClick={onClick} />);
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

  it('marks the active alignment', () => {
    const { container } = render(
      <AlignmentSelect onClick={vi.fn()} activeAlignment="Center" />
    );
    const active = [...container.querySelectorAll('button')].filter((button) =>
      button.className.includes('wrapper--active')
    );
    expect(active).toHaveLength(1);
  });

  it('hands Select consumers the value, not the event', async () => {
    const onChange = vi.fn();
    render(
      <Select onChange={onChange} aria-label="group">
        <option value="">All</option>
        <option value="emoji">Emoji</option>
      </Select>
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'group' }),
      'emoji'
    );
    expect(onChange).toHaveBeenCalledWith('emoji');
  });
});

describe('MB-C6 Slider and SliderLabel', () => {
  it('forwards its react-slider props and strips trackStartValue', () => {
    const { container } = render(
      <Slider min={0} max={100} value={50} trackStartValue={10} />
    );
    const slider = container.querySelector('[aria-valuenow]');
    expect(slider?.getAttribute('aria-valuenow')).toBe('50');
    expect(container.innerHTML).not.toContain('trackStartValue');
  });

  it('renders the label beside the control, as a span rather than a label', () => {
    const { container } = render(
      <SliderLabel label="Opacity">
        <input aria-label="opacity" />
      </SliderLabel>
    );
    expect(screen.getByText('Opacity').tagName).toBe('SPAN');
    expect(container.querySelector('label')).toBeNull();
  });
});

describe('MB-C8 useDebounceCallback', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires once after the delay', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounceCallback(callback, 200));

    act(() => result.current());
    expect(callback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(200));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('restarts the timer on a repeated call', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounceCallback(callback, 200));

    act(() => result.current());
    act(() => vi.advanceTimersByTime(150));
    act(() => result.current());
    act(() => vi.advanceTimersByTime(150));
    expect(callback).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(60));
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('uses the latest callback', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback }) => useDebounceCallback(callback, 200),
      { initialProps: { callback: first } }
    );

    act(() => result.current());
    rerender({ callback: second });
    act(() => vi.advanceTimersByTime(200));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});
