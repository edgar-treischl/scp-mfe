import { useEffect, useRef } from 'react';

interface UseAutosaveOptions {
  data: unknown;
  onSave: (data: unknown) => Promise<void>;
  delay?: number;
}

export function useAutosave({ data, onSave, delay = 2000 }: UseAutosaveOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onSave(data);
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, delay]);
}
