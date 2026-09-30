/**
 * Content Moderation Sidebar
 *
 * Manages the moderation sidebar UI including:
 * - Validate button with loading state
 * - Results list with status indicators
 * - Block selection on click
 */

import { useCallback, useState } from 'react';

import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { checkImageContent } from '../../moderation';
import { selectBlocks } from '../../utils';
import type { ModerationResult } from '../../types';
import { ResultItem } from './ResultItem';
import './Sidebar.css';
import { DEMO_ASSETS_BASE_URL } from '../../../imgly/demo-assets';

interface SidebarProps {
  cesdk: CreativeEditorSDK | null;
}

export function Sidebar({ cesdk }: SidebarProps) {
  const [results, setResults] = useState<ModerationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unsuccessfulResults = results.filter((r) => r.state !== 'success');

  const handleValidate = useCallback(async () => {
    if (!cesdk) return;
    setIsLoading(true);
    setError(null);
    try {
      const newResults = await checkImageContent(cesdk.engine);
      setResults(newResults);
    } catch {
      setError('The moderation check failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  }, [cesdk]);

  const handleSelectBlock = useCallback(
    (blockId: number) => {
      if (!cesdk) return;
      if (cesdk.engine.block.isAllowedByScope(blockId, 'editor/select')) {
        selectBlocks(cesdk.engine, [blockId]);
      }
    },
    [cesdk]
  );

  return (
    <div className="moderation-sidebar">
      <div className="moderation-header">
        <button
          className="moderation-validate-btn"
          onClick={handleValidate}
          disabled={!cesdk || isLoading}
        >
          <img
            src={`${DEMO_ASSETS_BASE_URL}/assets/icons/refresh.svg`}
            alt=""
            width="16"
            height="16"
          />
          <span>{isLoading ? 'Checking...' : 'Validate Content'}</span>
        </button>
        <span className="moderation-header-info">
          {unsuccessfulResults.length} result
          {unsuccessfulResults.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="moderation-list">
        {error != null && (
          <div className="moderation-status-text moderation-error" role="alert">
            {error}
          </div>
        )}
        {unsuccessfulResults.length === 0 ? (
          <div
            className="moderation-status-text"
            dangerouslySetInnerHTML={{
              __html:
                results.length === 0
                  ? 'No check has been performed yet.'
                  : 'No content violations found.<br/>Add possibly offensive content and run it again.'
            }}
          />
        ) : (
          unsuccessfulResults.map((result) => (
            <ResultItem
              key={`${result.blockId}-${result.name}`}
              result={result}
              onSelect={handleSelectBlock}
            />
          ))
        )}
      </div>
    </div>
  );
}
