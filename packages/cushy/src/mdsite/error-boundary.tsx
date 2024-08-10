import React, { type ReactNode } from 'react';
import { canUseDOM } from './can-use-dom';

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  override componentDidCatch(error: Error): void {
    // Catch errors in any components below and re-render with error message
    if (canUseDOM) {
      this.setState({ error });
    }
  }

  override render(): ReactNode {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      const fallbackParams: FallbackParams = {
        error,
        tryAgain: () => this.setState({ error: null }),
      };
      const fallback: FallbackFunction = this.props.fallback ?? DefaultFallback;
      return fallback(fallbackParams);
    }

    // See https://github.com/facebook/docusaurus/issues/6337#issuecomment-1012913647
    return children ?? null;
  }
}

interface ErrorBoundaryProps {
  readonly fallback?: FallbackFunction;
  readonly children: ReactNode;
}

type FallbackFunction = (params: FallbackParams) => JSX.Element;

type FallbackParams = {
  readonly error: Error;
  readonly tryAgain: () => void;
};

type State = {
  error: Error | null;
};

const DefaultFallback: FallbackFunction = (params) => <ErrorDisplay {...params} />;

function ErrorDisplay({ error, tryAgain }: ErrorDisplayProps): JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '80ch',
        fontSize: '20px',
        margin: '0 auto',
        padding: '1rem',
      }}
    >
      <h1 style={{ fontSize: '3rem' }}>This page crashed</h1>
      <button
        type="button"
        onClick={tryAgain}
        style={{
          margin: '1rem 0',
          fontSize: '2rem',
          cursor: 'pointer',
          borderRadius: 20,
          padding: '1rem',
        }}
      >
        Try again
      </button>
      <ErrorBoundaryError error={error} />
    </div>
  );
}

interface ErrorDisplayProps extends FallbackParams {}

function ErrorBoundaryError({ error }: { error: Error }): JSX.Element {
  const causalChain = getErrorCausalChain(error);
  const fullMessage = causalChain.map((e) => e.message).join('\n\nCause:\n');
  return <p style={{ whiteSpace: 'pre-wrap' }}>{fullMessage}</p>;
}

type CausalChain = [Error, ...Error[]];

export function getErrorCausalChain(error: Error): CausalChain {
  if (error.cause) {
    return [error, ...getErrorCausalChain(error.cause as Error)];
  }
  return [error];
}
