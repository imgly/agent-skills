// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it } from 'vitest';

import { InfoButton } from '../../src/app/InfoButton/InfoButton';

const SUBSTITUTED = 'Font Helvetica substituted';
const DROPPED = 'Layer effect dropped';

describe('IDML-U7 the warning badge groups repeated messages', () => {
  it('shows nothing when the parser reported no message of that type', () => {
    const { container } = render(<InfoButton messages={[]} type="warning" />);
    expect(container.innerHTML).toBe('');
  });

  it('counts the messages in the badge label', () => {
    render(<InfoButton messages={[SUBSTITUTED]} type="warning" />);
    expect(screen.getByRole('button', { name: /1 Warning$/ })).toBeDefined();
  });

  it('pluralises the badge label', () => {
    render(<InfoButton messages={[SUBSTITUTED, DROPPED]} type="warning" />);
    expect(screen.getByRole('button', { name: /2 Warnings$/ })).toBeDefined();
  });

  it('names the error type on an error badge', () => {
    render(<InfoButton messages={[DROPPED]} type="error" />);
    expect(screen.getByRole('button', { name: /1 Error$/ })).toBeDefined();
    expect(screen.getByAltText('Error')).toBeDefined();
  });

  it('lists each distinct message once with its occurrence count', async () => {
    render(
      <InfoButton
        messages={[SUBSTITUTED, DROPPED, SUBSTITUTED]}
        type="warning"
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /3 Warnings$/ }));

    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent)
    ).toEqual([`${SUBSTITUTED} (2 occurrences)`, `${DROPPED} (1 occurrence)`]);
  });

  it('closes the list when the user clicks elsewhere', async () => {
    render(<InfoButton messages={[SUBSTITUTED]} type="warning" />);

    await userEvent.click(screen.getByRole('button', { name: /1 Warning$/ }));
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    await userEvent.click(document.body);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('closes the list again on a second click', async () => {
    render(<InfoButton messages={[SUBSTITUTED]} type="warning" />);
    const badge = screen.getByRole('button', { name: /1 Warning$/ });

    await userEvent.click(badge);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);

    await userEvent.click(badge);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
