import classNames from 'classnames';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode
} from 'react';
import { useEditor } from '../../contexts/EditorContext';
import CaretDownIcon from '../../icons/CaretDown.svg';
import IconButton from '../IconButton/IconButton';
import classes from './SlideUpPanel.module.css';

interface SlideUpContextValue {
  isExpanded: boolean;
  defaultHeadline?: string;
  setIsExpanded: (value: boolean) => void;
}

const SlideUpContext = createContext<SlideUpContextValue | undefined>(
  undefined
);

export const useSlideUp = () => {
  const context = useContext(SlideUpContext);
  if (context === undefined) {
    throw new Error('useSlideUp must be used within a SlideUpProvider');
  }
  return context;
};

type SlideUpPanelProps = {
  children?: ReactNode;
  isExpanded: boolean;
  onExpandedChanged?: (value: boolean) => void;
  defaultHeadline?: string;
  InspectorBar?: ReactNode;
};

const SlideUpPanel = ({
  children,
  isExpanded,
  onExpandedChanged,
  defaultHeadline,
  InspectorBar = null
}: SlideUpPanelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { engine, setZoomPaddingBottom } = useEditor();
  useEffect(() => {
    const containerNode = containerRef.current;
    const defaultZoomPaddingBottom = 8;

    const ro = new ResizeObserver(() => {
      const containerBB = containerNode.getBoundingClientRect();
      const canvasBB = engine.element.getBoundingClientRect();
      const paddingNeeded = canvasBB.height - (containerBB.top - canvasBB.top);
      if (isExpanded) {
        setZoomPaddingBottom(paddingNeeded + defaultZoomPaddingBottom);
      } else {
        setZoomPaddingBottom(defaultZoomPaddingBottom);
      }
    });

    ro.observe(containerNode);

    return () => {
      ro.unobserve(containerNode);
      setZoomPaddingBottom(defaultZoomPaddingBottom);
    };
  }, [isExpanded, engine.element, setZoomPaddingBottom]);

  return (
    <SlideUpContext.Provider
      value={{
        isExpanded,
        defaultHeadline,
        setIsExpanded: (value) => {
          onExpandedChanged && onExpandedChanged(value);
        }
      }}
    >
      <div
        ref={containerRef}
        className={classNames(classes.wrapper, {
          [classes['wrapper--expanded']]: isExpanded
        })}
      >
        {InspectorBar && (
          <div className={classes.inspectorBar}>{InspectorBar}</div>
        )}
        {!isExpanded && <SlideUpPanelHeader headline={defaultHeadline} />}
        {children}
      </div>
    </SlideUpContext.Provider>
  );
};

type SlideUpPanelBodyProps = {
  children?: ReactNode;
};

const SlideUpPanelBody = ({ children }: SlideUpPanelBodyProps) => {
  const { isExpanded } = useSlideUp();
  return (
    <div
      className={classNames(classes.body, {
        [classes['body--visible']]: isExpanded
      })}
    >
      {children}
    </div>
  );
};

type SlideUpPanelHeaderProps = {
  children?: ReactNode;
  headline?: string;
  closeComponent?: ReactNode;
};

const SlideUpPanelHeader = ({
  children,
  headline,
  closeComponent = <CaretDownIcon />
}: SlideUpPanelHeaderProps) => {
  const { setIsExpanded, isExpanded, defaultHeadline } = useSlideUp();
  return (
    <div className={classes.header}>
      <div>{children}</div>
      <span className={classes.headline}>{headline ?? defaultHeadline}</span>
      <div>
        {isExpanded && (
          <IconButton
            icon={closeComponent}
            onClick={() => setIsExpanded(false)}
            size="sm"
          ></IconButton>
        )}
      </div>
    </div>
  );
};

export { SlideUpPanelBody, SlideUpPanelHeader };

export default SlideUpPanel;
