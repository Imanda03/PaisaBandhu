import React from 'react';
import SpendingEmptyState from './SpendingEmptyState';

interface State {
  hasError: boolean;
}

interface Props {
  children: React.ReactNode;
}

class SpendingErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('SpendingComposition error:', error);
  }

  render() {
    if (this.state.hasError) {
      return <SpendingEmptyState />;
    }
    return this.props.children;
  }
}

export default SpendingErrorBoundary;
