import { useState, useEffect } from 'react';

const urlCache = new Set();
const useDynamicScript = (
  url: string,
): {
  ready: boolean;
  failed: boolean;
} => {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }

    if (urlCache.has(url)) {
      setReady(true);
      setFailed(false);
      return;
    }

    setReady(false);
    setFailed(false);

    const scriptId = `dynamic-script-${url}`;
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.id = scriptId;
    script.type = 'text/javascript';

    const onScriptLoad = () => {
      urlCache.add(url);
      setReady(true);
      setFailed(false);
    };

    const onScriptError = () => {
      urlCache.delete(url);
      script.remove();
      setReady(false);
      setFailed(true);
    };

    script.addEventListener(`load`, onScriptLoad);
    script.addEventListener(`error`, onScriptError);

    document.head.appendChild(script);
  }, [url]);

  return {
    ready,
    failed,
  };
};

export default useDynamicScript;
