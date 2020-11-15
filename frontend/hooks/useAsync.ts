import { useCallback, useEffect, useState } from 'react';

/**
 * Source https://usehooks.com/useAsync/
 */
export default function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true,
): {
  execute: () => Promise<void>;
  status: 'idle' | 'pending' | 'success' | 'error';
  value: T | null;
  error: E | null;
} {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const [value, setValue] = useState<T | null>(null);

  const [error, setError] = useState<E | null>(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setStatus('pending');

    setValue(null);

    setError(null);
    return asyncFunction()
      .then((response: any) => {
        setValue(response);

        setStatus('success');
      })

      .catch((innerError: any) => {
        setError(innerError);

        setStatus('error');
      });
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}
