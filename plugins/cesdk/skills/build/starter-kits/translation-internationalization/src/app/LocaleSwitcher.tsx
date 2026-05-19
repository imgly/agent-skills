/**
 * Locale Switcher Component - Language Editor Starterkit
 *
 * A segmented control that allows users to switch between available locales.
 * When a locale is selected, the parent component re-renders the editor with
 * the new locale.
 */

import classNames from 'classnames';

import styles from './LocaleSwitcher.module.css';

/**
 * Available locale options with their display labels
 */
const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'de', label: 'German' }
] as const;

export type Locale = (typeof LOCALES)[number]['value'];

interface LocaleSwitcherProps {
  /** Currently selected locale */
  selectedLocale: Locale;
  /** Callback when locale is changed */
  onLocaleChange: (locale: Locale) => void;
}

/**
 * LocaleSwitcher Component
 *
 * Renders a segmented control for locale selection. When a locale is selected,
 * calls the onLocaleChange callback to notify the parent component.
 */
export function LocaleSwitcher({
  selectedLocale,
  onLocaleChange
}: LocaleSwitcherProps) {
  return (
    <div className={styles.localeSwitcherWrapper}>
      <div className={styles.segmentedControlWrapper}>
        <div className={styles.segmentedControl}>
          {LOCALES.map((locale) => (
            <button
              key={locale.value}
              type="button"
              className={classNames({
                [styles.active]: selectedLocale === locale.value
              })}
              onClick={() => onLocaleChange(locale.value)}
            >
              {locale.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
