import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouteNodes } from '@generated/routes';
import ErrorBoundary from './error-boundary';
import { MDXProvider } from '@mdx-js/react';
import { JSX, ClassAttributes, HTMLAttributes } from 'react';

const router = createBrowserRouter([{ path: '*', Component: () => RouteNodes }]);

const components = {
  p: CustomP,
};

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <MDXProvider components={components}>
        <RouterProvider router={router} />
      </MDXProvider>
    </ErrorBoundary>
  );
}

function CustomP(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) {
  const { children } = props;
  console.log('CustomP props', props);
  return <div style={{ color: 'red', backgroundColor: 'green' }}>{children}</div>;
}
