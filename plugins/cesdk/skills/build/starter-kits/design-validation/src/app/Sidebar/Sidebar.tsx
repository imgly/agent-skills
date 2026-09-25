/**
 * Validation Sidebar Component
 *
 * Displays validation results and allows selecting blocks with issues.
 * Auto-updates when the design changes via history listener.
 */

import { useCallback, useEffect, useState } from 'react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';

import { type BlockValidationResult } from '../../imgly/types';
import {
  validateOutsideBlocks,
  validateProtrudingBlocks,
  validatePartiallyHiddenTexts,
  validateLowResolution
} from '../../imgly/validation';
import { resolveAssetPath } from '../resolveAssetPath';
import { ResultItem } from '../ResultItem/ResultItem';

import classes from './Sidebar.module.css';

// ============================================================================
// Types
// ============================================================================

export interface ValidationResult extends BlockValidationResult {
  validationName: string;
  validationDescription: string;
}

// ============================================================================
// Validation Configuration
// ============================================================================

interface ValidationConfig {
  name: string;
  description: string;
  validate: (
    cesdk: CreativeEditorSDK
  ) => BlockValidationResult[] | Promise<BlockValidationResult[]>;
}

const VALIDATIONS: ValidationConfig[] = [
  {
    name: 'Outside of page',
    description: 'Some elements are outside of the visible area.',
    validate: validateOutsideBlocks
  },
  {
    name: 'Protrudes from page',
    description: 'Some elements are protruding the visible area.',
    validate: validateProtrudingBlocks
  },
  {
    name: 'Text partially hidden',
    description:
      'Some text elements are partially obstructed by other elements.',
    validate: validatePartiallyHiddenTexts
  },
  {
    name: 'Low resolution',
    description:
      'Some elements have a low resolution. This will lead to suboptimal results.',
    validate: validateLowResolution
  }
];

/**
 * Runs all validation checks and returns results with presentation metadata.
 */
async function runValidationChecks(
  cesdk: CreativeEditorSDK
): Promise<ValidationResult[]> {
  const allResults: ValidationResult[] = [];

  for (const validation of VALIDATIONS) {
    const checkResults = await validation.validate(cesdk);
    for (const result of checkResults) {
      allResults.push({
        ...result,
        validationName: validation.name,
        validationDescription: validation.description
      });
    }
  }

  return allResults;
}

// ============================================================================
// Presentation Helpers
// ============================================================================

interface SidebarProps {
  cesdk: CreativeEditorSDK | null;
}

/**
 * Gets the display name for a block.
 * This is presentation logic - kept at the app level.
 */
function getBlockDisplayName(
  cesdk: CreativeEditorSDK,
  blockId: number
): string {
  const layerName = cesdk.engine.block.getName(blockId);
  if (layerName && !['Text'].includes(layerName)) {
    return layerName;
  }
  const kind = cesdk.engine.block.getKind(blockId);
  switch (kind) {
    case 'text': {
      const textContent = cesdk.engine.block.getString(blockId, 'text/text');
      const truncated =
        textContent.length > 25
          ? textContent.substring(0, 22) + '...'
          : textContent;
      return truncated || 'Text';
    }
    case 'image':
      return 'Image';
    case 'sticker':
      return 'Sticker';
    case 'shapes':
      return 'Shape';
    default:
      return kind || 'Unknown';
  }
}

// ============================================================================
// Component
// ============================================================================

export function Sidebar({ cesdk }: SidebarProps) {
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [isReady, setIsReady] = useState(false);

  const unsuccessfulResults = results.filter((r) => r.state !== 'success');

  const runValidation = useCallback(async () => {
    if (!cesdk) return;
    const newResults = await runValidationChecks(cesdk);
    setResults(newResults);
    setIsReady(true);
  }, [cesdk]);

  useEffect(() => {
    if (!cesdk) return;

    // Run initial validation
    runValidation();

    // Subscribe to history updates to auto-revalidate
    const unsubscribe = cesdk.engine.editor.onHistoryUpdated(() => {
      runValidation();
    });

    return () => {
      unsubscribe();
    };
  }, [cesdk, runValidation]);

  const handleSelectBlock = useCallback(
    (blockId: number) => {
      if (!cesdk) return;
      if (!cesdk.engine.block.isAllowedByScope(blockId, 'editor/select'))
        return;

      // Deselect all blocks
      cesdk.engine.block
        .findAllSelected()
        .forEach((block) => cesdk.engine.block.setSelected(block, false));

      // Select the target block
      cesdk.engine.block.setSelected(blockId, true);
    },
    [cesdk]
  );

  return (
    <aside className={classes.sidebar}>
      <div className={classes.header}>
        <span className={classes.headerTitle}>
          <span>{isReady ? 'Check performed' : 'Check pending'}</span>
          {isReady && (
            <img
              src={resolveAssetPath('/assets/icons/check-complete.svg')}
              alt=""
              className={classes.checkIcon}
              width={16}
              height={16}
            />
          )}
        </span>
        <span className={classes.headerInfo}>
          {unsuccessfulResults.length} results
        </span>
      </div>
      <div className={classes.list}>
        {!isReady ? (
          <div className={classes.statusText}>Loading...</div>
        ) : unsuccessfulResults.length === 0 ? (
          <div className={classes.statusText}>
            <span>No design errors found.</span>
            <span>Move elements around to see a different result.</span>
          </div>
        ) : (
          unsuccessfulResults.map((result) => (
            <ResultItem
              key={`${result.blockId}-${result.validationName}`}
              result={result}
              blockDisplayName={
                cesdk ? getBlockDisplayName(cesdk, result.blockId) : ''
              }
              onSelect={handleSelectBlock}
            />
          ))
        )}
      </div>
    </aside>
  );
}
