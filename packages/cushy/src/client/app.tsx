import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouteNodes } from '@generated/routes';
import ErrorBoundary from './error-boundary';

const router = createBrowserRouter([{ path: '*', Component: () => RouteNodes }]);

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
