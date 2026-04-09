import { useState, useEffect } from 'react';

// Delays updating a value until the user stops typing for `delay` ms.
// Without this fire a request on every single keystroke.
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}