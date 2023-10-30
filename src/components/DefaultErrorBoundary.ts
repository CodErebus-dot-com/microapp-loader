import { Component } from 'react';
import { DefaultErrorBoundaryProps, DefaultErrorBoundaryState } from '../types';

class DefaultErrorBoundary extends Component<DefaultErrorBoundaryProps, DefaultErrorBoundaryState> {
  constructor(props: DefaultErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    } else {
      console.error(error);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error);
      } else {
        return this.props.fallback;
      }
    }

    return this.props.children;
  }
}

export default DefaultErrorBoundary;
