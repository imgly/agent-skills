// @vitest-environment jsdom
import {
  render,
  renderHook,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { describe, expect, it } from 'vitest';
import AddBlockBar from '../../src/app/ui/AddBlockBar/AddBlockBar';
import BlockBar from '../../src/app/ui/BlockBar/BlockBar';
import { useBlockBar } from '../../src/app/ui/BlockBarContext/BlockBarContext';

const ITEMS = [
  {
    id: 'one',
    label: 'One',
    Icon: <span />,
    Component: <p>panel one</p>
  },
  {
    id: 'two',
    label: 'Two',
    Icon: <span />,
    Component: <p>panel two</p>
  }
];

describe('AP-C3 BlockBar and BlockBarContext', () => {
  it('AP-C3 renders only the selected item’s component', async () => {
    render(<BlockBar items={ITEMS} />);
    expect(screen.queryByText('panel one')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByText('panel one')).toBeTruthy();
    expect(screen.queryByText('panel two')).toBeNull();

    await userEvent.click(screen.getByRole('button', { name: 'Two' }));
    expect(screen.queryByText('panel one')).toBeNull();
    expect(screen.getByText('panel two')).toBeTruthy();
  });

  it('AP-C3 deselects when the selected item is clicked again', async () => {
    render(<BlockBar items={ITEMS} />);
    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.queryByText('panel one')).toBeNull();
  });

  it('AP-C3 marks every item active while nothing is selected', async () => {
    render(<BlockBar items={ITEMS} />);
    for (const name of ['One', 'Two']) {
      expect(screen.getByRole('button', { name }).className).toContain(
        'wrapper--active'
      );
    }

    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByRole('button', { name: 'One' }).className).toContain(
      'wrapper--active'
    );
    expect(screen.getByRole('button', { name: 'Two' }).className).not.toContain(
      'wrapper--active'
    );
  });

  it('AP-C3 clones its children with isActive while nothing is selected', async () => {
    render(
      <BlockBar items={ITEMS}>
        <ChildProbe />
      </BlockBar>
    );
    expect(screen.getByTestId('child').textContent).toBe('active');

    await userEvent.click(screen.getByRole('button', { name: 'One' }));
    expect(screen.getByTestId('child').textContent).toBe('inactive');
  });

  it('AP-C3 throws when useBlockBar runs outside the provider', () => {
    expect(() => renderHook(() => useBlockBar())).toThrow(
      'useBlockBar must be used within a BlockBarProvider'
    );
  });
});

function ChildProbe({ isActive }: { isActive?: boolean }) {
  return <span data-testid="child">{isActive ? 'active' : 'inactive'}</span>;
}

// Only the labels: selecting an entry renders its panel, and every panel needs
// the engine provider. AP-C3 covers the selection behaviour without one.
describe('AP-C6 AddBlockBar', () => {
  it('AP-C6 offers Text, Image, Shape and Sticker', () => {
    render(<AddBlockBar />);
    for (const label of ['Text', 'Image', 'Shape', 'Sticker']) {
      expect(screen.getByRole('button', { name: label })).toBeTruthy();
    }
  });
});
