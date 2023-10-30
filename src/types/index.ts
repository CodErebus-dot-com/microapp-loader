import { ComponentType, ReactNode } from 'react';

export type DefaultErrorBoundaryProps = {
  fallback: ((error: Error) => JSX.Element) | ReactNode;
  children?: ReactNode;
  onError?: (error: Error) => void;
};

export type DefaultErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export interface RemoteModulePropsBase {
  module: string;
  scope: string;
  remoteUrl: string;
  suspenseFallback?: ReactNode | (() => JSX.Element);
  [key: string]: unknown;
}
export interface RemoteModulePropsWithFallback extends RemoteModulePropsBase {
  errorFallback?: ((error: Error) => JSX.Element) | ReactNode;
  ErrorBoundary?: never;
}
export interface RemoteModulePropsWithErrorBoundary extends RemoteModulePropsBase {
  ErrorBoundary: ComponentType<any>;
  errorFallback?: never;
}

export type RemoteModuleProps = RemoteModulePropsWithFallback | RemoteModulePropsWithErrorBoundary;

export type Container = {
  init(shareScope: string): void;
  get(module: string): Factory;
};

export type Factory = () => any;
