import { Container, Factory } from '../types';

export function loadComponent(scope: string, module: string) {
  return async <T>(): Promise<T> => {
    if (window[scope] && window[scope].initialized) {
      const factory: Factory = await window[scope].get(module);
      const Module = factory();
      return Module;
    }

    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__('default');

    const container: Container = window[scope]; // or get the container somewhere else

    if (!container) return null;
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    if (module.startsWith('/') || module.startsWith('./')) {
      module = module.slice(1);
    }
    const factory: Factory = await container.get(`./${module}`);
    const Module = factory();
    window[scope].initialized = true;
    return Module;
  };
}
