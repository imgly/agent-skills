import { useEffect, RefObject } from 'react';

export const useOnClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) => {
  const handleClick = (e: MouseEvent) => {
    // Use isTrusted to check if the event is coming from a real user, or is coming from a script.
    if (ref.current && !ref.current.contains(e.target as Node) && e.isTrusted) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
};
