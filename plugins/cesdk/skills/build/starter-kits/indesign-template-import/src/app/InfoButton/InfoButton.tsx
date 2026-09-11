/**
 * InfoButton - Warning/Error badge with popover
 */
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { Popover } from 'react-tiny-popover';
import { resolveAssetPath } from '../resolveAssetPath';
import classes from './InfoButton.module.css';

interface InfoButtonProps {
  messages: string[];
  type: 'error' | 'warning';
}

const TYPE_CONFIG = {
  error: {
    icon: resolveAssetPath('/icons/error.svg'),
    className: classes.error,
    label: 'Error'
  },
  warning: {
    icon: resolveAssetPath('/icons/warning.svg'),
    className: classes.warning,
    label: 'Warning'
  }
};

export function InfoButton({ messages, type }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { icon, label, className } = TYPE_CONFIG[type];

  // Group messages by message string
  const groupedMessages = useMemo(
    () =>
      messages.reduce((acc, message) => {
        const count = acc.get(message) || 0;
        acc.set(message, count + 1);
        return acc;
      }, new Map<string, number>()),
    [messages]
  );

  const messagesArray = useMemo(
    () => Array.from(groupedMessages.entries()),
    [groupedMessages]
  );

  if (messages.length === 0) return null;

  return (
    <Popover
      isOpen={isOpen}
      positions={['bottom', 'left', 'right', 'top']}
      padding={8}
      onClickOutside={() => setIsOpen(false)}
      content={
        <div className={classes.popoverContent}>
          <ul className={classes.messages}>
            {messagesArray.map(([message, count], i) => (
              <li key={i}>
                {message} ({count} {count > 1 ? 'occurrences' : 'occurrence'})
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <button
        className={classNames(classes.button, className)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img src={icon} alt={label} className={classes.iconImg} />
        {messages.length} {label}
        {messages.length > 1 ? 's' : ''}
      </button>
    </Popover>
  );
}
