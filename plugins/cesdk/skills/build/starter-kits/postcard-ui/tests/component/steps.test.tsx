// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChooseTemplateStep from '@/app/steps/ChooseTemplateStep/ChooseTemplateStep';
import ProcessNavigation from '@/app/layout/ProcessNavigation/ProcessNavigation';
import { POSTCARD_TEMPLATES } from '@/imgly/postcard-catalog';

const editor = {
  currentStep: 'Style' as string,
  setCurrentStep: vi.fn(),
  setPostcardTemplateId: vi.fn(),
  postcardTemplate: undefined as unknown
};

vi.mock('@/app/contexts/EditorContext', () => ({
  DEMO_ASSETS_BASE_URL: 'https://assets.example/postcard',
  useEditor: () => editor
}));

beforeEach(() => {
  editor.currentStep = 'Style';
  editor.postcardTemplate = undefined;
  vi.clearAllMocks();
});

describe('PC-C1 ChooseTemplateStep', () => {
  it('PC-C1 renders the four templates in catalogue order', () => {
    const { container } = render(<ChooseTemplateStep />);
    const alts = Array.from(container.querySelectorAll('img')).map((img) =>
      img.getAttribute('alt')
    );
    expect(alts).toEqual(
      Object.values(POSTCARD_TEMPLATES).map(
        (template) => `Choose ${template.name} Template`
      )
    );
    expect(
      container.querySelector('[data-cy="choose-thank_you-template"]')
    ).toBeTruthy();
  });

  it('PC-C1 picks the template and moves to Design', async () => {
    render(<ChooseTemplateStep />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Choose Bonjour Paris Template' })
    );
    expect(editor.setPostcardTemplateId).toHaveBeenCalledWith('bonjour_paris');
    expect(editor.setCurrentStep).toHaveBeenCalledWith('Design');
  });
});

// `.buttonText` is `display: none` below a 450px viewport, and jsdom applies no
// media query, so the step labels carry no accessible name here. The three
// buttons are read in render order instead: Style, Design, Write.
describe('PC-C2 ProcessNavigation', () => {
  const steps = () => screen.getAllByRole('button', { hidden: true });

  it('PC-C2 locks Design and Write until a template is chosen', () => {
    render(<ProcessNavigation />);
    const [style, design, write] = steps();
    expect(style.textContent).toContain('Style');
    expect(style.hasAttribute('disabled')).toBe(false);
    expect(design.hasAttribute('disabled')).toBe(true);
    expect(write.hasAttribute('disabled')).toBe(true);
  });

  it('PC-C2 unlocks every step once a template is chosen', () => {
    editor.postcardTemplate = POSTCARD_TEMPLATES.thank_you;
    render(<ProcessNavigation />);
    for (const button of steps()) {
      expect(button.hasAttribute('disabled')).toBe(false);
    }
  });

  it('PC-C2 disables every step while `disabled` is set', () => {
    editor.postcardTemplate = POSTCARD_TEMPLATES.thank_you;
    render(<ProcessNavigation disabled />);
    for (const button of steps()) {
      expect(button.hasAttribute('disabled')).toBe(true);
    }
  });

  it('PC-C2 marks the active step by class only', async () => {
    editor.postcardTemplate = POSTCARD_TEMPLATES.thank_you;
    editor.currentStep = 'Design';
    render(<ProcessNavigation />);
    const [style, design, write] = steps();

    expect(design.className).toContain('button--active');
    expect(design.getAttribute('aria-current')).toBeNull();
    expect(style.className).not.toContain('button--active');

    await userEvent.click(write);
    expect(editor.setCurrentStep).toHaveBeenCalledWith('Write');
  });
});
