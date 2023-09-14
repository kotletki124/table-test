import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

function useAsync(options = {}) {
  const { promiseFn, deferFn, args, onResolve, initValue = false } = options;

  const [data, setData] = useState(initValue);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(false);
  const prevController = useRef(new AbortController());

  const formCallback =
    func =>
    async (...callbackArgs) => {
      if (isPending) {
        prevController.current.abort();
        prevController.current = new AbortController();
      }
      setIsPending(true);
      setError(false);
      try {
        const res = await func(...callbackArgs, {
          signal: prevController.current.signal,
        });
        if (onResolve) onResolve(res);
        setData(res);
        setIsPending(false);
        return res;
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
          setIsPending(false);
        }
        return err;
      }
    };

  const argsMemoized = useMemo(() => args, args);

  const run = useCallback(formCallback(deferFn), [deferFn, argsMemoized]);

  const callback = useCallback(formCallback(promiseFn), [
    promiseFn,
    argsMemoized,
  ]);

  useEffect(() => {
    if (promiseFn) {
      callback(...(argsMemoized || []));
    }
  }, [callback, argsMemoized]);

  return [data, isPending, error, run];
}

export default useAsync;
