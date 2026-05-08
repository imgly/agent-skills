/**
 * Airtable Sidebar Component
 *
 * This component displays an embedded Airtable database view alongside
 * the editor, allowing users to see the source data while editing.
 *
 * @see https://airtable.com/developers/web/api
 */

import styles from './AirtableSidebar.module.css';

/**
 * Configuration options for the Airtable sidebar.
 */
// highlight-sidebar-config
export interface AirtableSidebarProps {
  /**
   * The Airtable embed URL for the sidebar.
   *
   * This is an embed share link from Airtable that displays your database
   * in a read-only view. To get this URL:
   * 1. Open your Airtable base
   * 2. Click "Share" > "Share view"
   * 3. Enable "Create a shared view link"
   * 4. Copy the embed URL (format: https://airtable.com/embed/shrXXXXXX)
   *
   * Default: 'https://airtable.com/embed/shr4x8s9jqaxiJxm5' (demo database)
   */
  embedUrl?: string;

  /**
   * Width of the sidebar in pixels.
   * Default: 280
   */
  width?: number;

  /**
   * Whether to show the sidebar.
   * Default: true
   */
  show?: boolean;
}
// highlight-sidebar-config

/**
 * Default Airtable embed URL for the demo database.
 */
const DEFAULT_AIRTABLE_EMBED_URL =
  'https://airtable.com/embed/shr4x8s9jqaxiJxm5';

/**
 * Default sidebar width in pixels.
 */
const DEFAULT_SIDEBAR_WIDTH = 280;

/**
 * Airtable Sidebar Component
 *
 * Displays an embedded Airtable database view with configurable options.
 */
// highlight-sidebar-component
export default function AirtableSidebar({
  embedUrl = DEFAULT_AIRTABLE_EMBED_URL,
  width = DEFAULT_SIDEBAR_WIDTH
}: AirtableSidebarProps = {}) {
  return (
    <div className={styles.airtableSidebar} style={{ flexBasis: `${width}px` }}>
      <iframe
        className={styles.airtableEmbed}
        src={embedUrl}
        title="Airtable Database"
      />
    </div>
  );
}
// highlight-sidebar-component
