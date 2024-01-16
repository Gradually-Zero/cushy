import ErrorBoundary from './error-boundary';

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <div>123</div>
    </ErrorBoundary>
  );
}
