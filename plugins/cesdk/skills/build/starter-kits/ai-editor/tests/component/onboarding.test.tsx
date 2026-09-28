// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getUserApiKey,
  OnboardingScreen,
  setUserApiKey
} from '../../src/app/ai-credentials';

describe('AIE-C1 OnboardingScreen', () => {
  it('walks a developer through creating a key when none is configured', () => {
    render(<OnboardingScreen reason="missing" mode="unconfigured" />);

    expect(
      screen.getByRole('heading', { name: 'Set up your IMG.LY API key' })
    ).toBeDefined();
    expect(screen.getByText('Setup required')).toBeDefined();
    expect(screen.getByText(/VITE_AI_API_KEY=/)).toBeDefined();
    expect(
      screen
        .getByRole('link', { name: /Open IMG.LY Dashboard/ })
        .getAttribute('href')
    ).toBe('https://img.ly/dashboard');
  });

  it('says the key was rejected when the gateway refused it', () => {
    render(<OnboardingScreen reason="invalid" mode="apiKey" />);

    expect(
      screen.getByRole('heading', { name: 'Your API key was rejected' })
    ).toBeDefined();
    expect(screen.getByText('Invalid API key')).toBeDefined();
  });

  it('points an embedded session at the host, not at a local .env', () => {
    render(<OnboardingScreen reason="invalid" mode="embedded" />);

    expect(
      screen.getByRole('heading', {
        name: /session token was rejected/
      })
    ).toBeDefined();
    expect(screen.queryByText(/VITE_AI_API_KEY=/)).toBeNull();
  });

  it('offers a reload on every variant, and it reloads', async () => {
    const reload = vi.fn();
    const location = Object.getOwnPropertyDescriptor(
      window,
      'location'
    ) as PropertyDescriptor;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload }
    });
    render(<OnboardingScreen reason="missing" mode="unconfigured" />);

    await userEvent.click(screen.getByRole('button', { name: 'Reload' }));

    expect(reload).toHaveBeenCalled();
    Object.defineProperty(window, 'location', location);
  });
});

describe('AIE-C5 the onboarding a deployed bundle shows', () => {
  const reload = vi.fn();
  const location = Object.getOwnPropertyDescriptor(
    window,
    'location'
  ) as PropertyDescriptor;

  beforeEach(() => {
    vi.stubEnv('PROD', true as never);
    window.localStorage.clear();
    reload.mockClear();
    // jsdom's `location.reload` is not configurable, so the whole object is
    // replaced for the span of these cases.
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload }
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    Object.defineProperty(window, 'location', location);
  });

  it('AIE-C5 asks for a key and saves it', async () => {
    render(<OnboardingScreen reason="missing" mode="unconfigured" />);

    expect(
      screen.getByRole('heading', { name: 'Set up your IMG.LY API key' })
    ).toBeDefined();
    expect(screen.getByText('Setup required')).toBeDefined();
    const save = screen.getByRole('button', { name: 'Save and reload' });
    expect((save as HTMLButtonElement).disabled).toBe(true);
    expect(
      screen.queryByRole('button', { name: 'Clear stored key' })
    ).toBeNull();

    await userEvent.type(screen.getByLabelText(/API key/), '  sk_pasted  ');
    await userEvent.click(save);

    expect(getUserApiKey()).toBe('sk_pasted');
    expect(reload).toHaveBeenCalled();
  });

  it('AIE-C5 says the stored key was rejected and offers to clear it', async () => {
    setUserApiKey('sk_stored');
    render(<OnboardingScreen reason="invalid" mode="apiKey" />);

    expect(
      screen.getByRole('heading', { name: 'Your API key was rejected' })
    ).toBeDefined();
    expect(screen.getByText('Invalid API key')).toBeDefined();
    // The stored key is already in the field, so saving it again is a no-op.
    expect(
      (
        screen.getByRole('button', {
          name: 'Save and reload'
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true);

    await userEvent.click(
      screen.getByRole('button', { name: 'Clear stored key' })
    );

    expect(getUserApiKey()).toBeUndefined();
    expect(reload).toHaveBeenCalled();
  });

  it('AIE-C5 points at the dashboard and the gateway guide', () => {
    render(<OnboardingScreen reason="missing" mode="unconfigured" />);

    expect(
      screen
        .getByRole('link', { name: 'IMG.LY Dashboard' })
        .getAttribute('href')
    ).toBe('https://img.ly/dashboard');
    expect(
      screen.getByRole('link', { name: 'Gateway Provider guide' })
    ).toBeDefined();
  });
});
