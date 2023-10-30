import {
  Suspense,
  lazy,
  useState,
  useEffect,
  ComponentType,
  createElement,
  ReactElement,
} from 'react';
import useDynamicScript from '../hooks/useDynamicScript';
import { RemoteModuleProps } from '../types';
import { loadComponent, buildRemoteUrl } from '../scripts';
import DefaultErrorBoundary from './DefaultErrorBoundary';
import DefaultErrorFallback from './DefaultErrorFallback';
import DefaultSuspenseFallback from './DefaultSuspenseFallback';
import { LOCAL_ENV } from '../constants';

// Default fallbacks
const defaultSuspenseFallback = createElement(DefaultSuspenseFallback);
const defaultErrorFallback = (error: Error) => createElement(DefaultErrorFallback, { error });

// Log the error to console
const logError = (error: Error) => {
  console.log('Caught an Error: ', error);
};

// Cache the loaded component to avoid loading the same component multiple times
const componentCache: Map<string, ComponentType | null> = new Map();

function ModuleLoader(props: RemoteModuleProps): ReactElement {
  const {
    module,
    scope,
    remoteUrl,
    suspenseFallback = defaultSuspenseFallback,
    errorFallback = defaultErrorFallback,
    ErrorBoundary = DefaultErrorBoundary,
    ...restProps
  } = props;

  const { ready, failed } = useDynamicScript(module && remoteUrl);
  const [Component, setComponent] = useState<ComponentType | null>(null);
  const url = buildRemoteUrl(remoteUrl);
  const key = `${url}-${scope}-${module}`;

  useEffect(() => {
    if (ready && !failed && !Component) {
      if (componentCache.has(key)) {
        setComponent(componentCache.get(key));
      } else {
        const component = lazy(loadComponent(scope, module));
        componentCache.set(key, component);
        setComponent(component);
      }
    }
  }, [Component, ready, failed]);

  if (LOCAL_ENV) {
    if (!ready) {
      console.info('Loading dynamic script: ', url);
    }

    if (failed || !scope || !module) {
      const baseMsg = `Failed to load dynamic script: ${url}`;
      const errorMsg = [
        !scope && 'Scope cannot be empty',
        !module && 'Module cannot be empty',
        scope && module && 'Please check if the provided scope, module and remoteUrl are correct',
      ]
        .filter(Boolean)
        .join('\n');
      console.error(baseMsg, '\n', errorMsg);
      return createElement(
        'div',
        { role: 'alert' },
        baseMsg,
        createElement('br'),
        'Check console for more details',
      );
    }
  }

  const ErrorBoundaryComponent = ErrorBoundary || DefaultErrorBoundary;

  return createElement(
    ErrorBoundaryComponent,
    { fallback: errorFallback, onError: logError },
    Component &&
      createElement(
        Suspense,
        {
          fallback: typeof suspenseFallback === 'function' ? suspenseFallback() : suspenseFallback,
        },
        createElement(Component, { ...restProps }),
      ),
  );
}

export default ModuleLoader;
