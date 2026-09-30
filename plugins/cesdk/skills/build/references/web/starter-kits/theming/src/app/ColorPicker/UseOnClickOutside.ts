import { useEffect, type RefObject } from 'react';

export const useOnClickOutside = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) => {
  const handleClick = (e: MouseEvent) => {
    const target = e.target as Node | null;
    if (ref.current && target && !ref.current.contains(target) && e.isTrusted) {
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
