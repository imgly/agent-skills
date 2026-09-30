// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';
import IconButton from '../../src/app/ui/IconButton/IconButton';
import SegmentedControl from '../../src/app/ui/SegmentedControl/SegmentedControl';

const OPTIONS = [
  { label: 'Edit', value: 'edit' },
  { label: 'Preview', value: 'preview' }
];

describe('AP-C1 SegmentedControl', () => {
  const renderControl = (props: Record<string, unknown> = {}) => {
    const onChange = vi.fn();
    render(
      <SegmentedControl
        options={OPTIONS}
        value="edit"
        name="step"
        buttonStyle={{}}
        size="sm"
        onChange={onChange}
        {...props}
      />
    );
    return onChange;
  };

  it('AP-C1 renders one button per option', () => {
    renderControl();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Preview' })).toBeTruthy();
  });

  it('AP-C1 reports a change only for the inactive option', async () => {
    const onChange = renderControl();
    await userEvent.click(screen.getByRole('button', { name: 'Preview' }));
    expect(onChange).toHaveBeenCalledWith('preview');

    onChange.mockClear();
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('AP-C1 renders the label only when it is not empty', () => {
    const { unmount } = render(
      <SegmentedControl
        options={OPTIONS}
        value="edit"
        name="step"
        label=""
        buttonStyle={{}}
        size="sm"
        onChange={vi.fn()}
      />
    );
    expect(screen.queryByText('Step')).toBeNull();
    unmount();

    renderControl({ label: 'Step' });
    expect(screen.getByText('Step')).toBeTruthy();
  });

  it('AP-C1 disables an option that asks for it', () => {
    renderControl({
      options: [OPTIONS[0], { ...OPTIONS[1], disabled: true }]
    });
    expect(
      screen.getByRole('button', { name: 'Preview' }).hasAttribute('disabled')
    ).toBe(true);
  });
});

describe('AP-C2 IconButton', () => {
  const icon = <span data-icon="yes" />;

  it('AP-C2 renders the label span only when children are given', () => {
    const { unmount } = render(<IconButton icon={icon} />);
    expect(screen.getByRole('button').textContent).toBe('');
    unmount();

    render(<IconButton icon={icon}>Delete</IconButton>);
    expect(screen.getByRole('button', { name: 'Delete' })).toBeTruthy();
  });

  it('AP-C2 applies the active class only when isActive', () => {
    const { unmount } = render(<IconButton icon={icon}>A</IconButton>);
    expect(screen.getByRole('button').className).not.toContain('active');
    unmount();

    render(
      <IconButton icon={icon} isActive>
        A
      </IconButton>
    );
    expect(screen.getByRole('button').className).toContain('wrapper--active');
  });

  it('AP-C2 puts iconColor on the icon wrapper', () => {
    render(
      <IconButton icon={icon} iconColor="red">
        A
      </IconButton>
    );
    const wrapper = screen.getByRole('button').firstElementChild as HTMLElement;
    expect(wrapper.style.color).toBe('red');
  });

  // `disabled` also reaches the button, but `IconButtonProps` extends
  // `HTMLAttributes` rather than `ButtonHTMLAttributes`, so it does not type
  // check; the kit passes it with a `@ts-expect-error`. Known issue 17.
  it('AP-C2 forwards the remaining props to the button', () => {
    render(
      <IconButton icon={icon} title="Remove">
        A
      </IconButton>
    );
    expect(screen.getByRole('button').getAttribute('title')).toBe('Remove');
  });
});
