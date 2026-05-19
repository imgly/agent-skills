import { RefObject, useEffect } from 'react';

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
        e.isTrusted
      ) {
        callback();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [ref, callback]);
}
