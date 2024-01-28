import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from '@generated/routes';
import ErrorBoundary from './error-boundary';

export default function App(): JSX.Element {
  console.log('routes', routes);
  return (
    <ErrorBoundary>
      <RouterProvider router={createBrowserRouter(routes)} />
    </ErrorBoundary>
  );
}
