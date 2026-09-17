// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import RoleSwitcher from '../../src/app/RoleSwitcher/RoleSwitcher';

describe('VPL-U8 RoleSwitcher', () => {
  it('offers both roles and marks the current one active', () => {
    render(<RoleSwitcher value="Creator" onChange={vi.fn()} />);

    const creator = screen.getByRole('button', { name: 'Creator' });
    const adopter = screen.getByRole('button', { name: 'Adopter' });

    expect(creator.className).toContain('active');
    expect(adopter.className).not.toContain('active');
  });

  it('reports the other role once when it is clicked', async () => {
    const onChange = vi.fn();
    render(<RoleSwitcher value="Creator" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Adopter' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('Adopter');
  });

  it('reports the active role again when it is clicked', async () => {
    const onChange = vi.fn();
    render(<RoleSwitcher value="Creator" onChange={onChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Creator' }));

    expect(onChange).toHaveBeenCalledWith('Creator');
  });
});
