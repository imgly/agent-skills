/**
 * Moderation Tooltip Component
 *
 * Displays detailed moderation information in a positioned tooltip
 * using Floating UI React for positioning.
 */

import { useRef } from 'react';
import { createPortal } from 'react-dom';

import { arrow, flip, offset, shift, useFloating } from '@floating-ui/react';

import type { ModerationResult } from '../../types';

interface TooltipProps {
  result: ModerationResult;
  referenceElement: HTMLElement;
}

export function Tooltip({ result, referenceElement }: TooltipProps) {
  const arrowRef = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles, placement, middlewareData } = useFloating({
    elements: {
      reference: referenceElement
    },
    placement: 'top',
    middleware: [
      offset(12),
      flip({ fallbackPlacements: ['bottom', 'left', 'right'] }),
      shift({ padding: 8 }),
      arrow({ element: arrowRef })
    ]
  });

  // Calculate arrow position
  const staticSide = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right'
  }[placement.split('-')[0]] as string;

  const arrowX = middlewareData.arrow?.x;
  const arrowY = middlewareData.arrow?.y;

  const arrowStyles: React.CSSProperties = {
    left: arrowX != null ? `${arrowX}px` : '',
    top: arrowY != null ? `${arrowY}px` : '',
    [staticSide]: '-8px'
  };

  return createPortal(
    <div
      ref={refs.setFloating}
      style={floatingStyles}
      className="moderation-tooltip"
      data-placement={placement}
    >
      <div className="moderation-tooltip-body">
        <span className="moderation-tooltip-title">{result.name}</span>
        <span className="moderation-tooltip-desc">{result.description}</span>
      </div>
      <div className="moderation-tooltip-footer">
        <span>Probability:</span>
        <span className="moderation-tooltip-footer-indicators">
          <span className="moderation-status-dot moderation-status-dot--failed" />
          <span>Certain</span>
          <span className="moderation-status-dot moderation-status-dot--warning" />
          <span>Likely</span>
        </span>
      </div>
      <div
        ref={arrowRef}
        className="moderation-tooltip-arrow"
        style={arrowStyles}
      />
    </div>,
    document.body
  );
}
