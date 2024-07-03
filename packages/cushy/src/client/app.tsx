import { MDXProvider } from '@mdx-js/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouteNodes } from '@generated/routes';
import ErrorBoundary from './error-boundary';
import { getComponents } from '../client_mdx/mdx_component';
import type { JSX /* , ClassAttributes, HTMLAttributes */ } from 'react';
import './css/styles.css';

const router = createBrowserRouter([{ path: '*', Component: () => RouteNodes }]);

export default function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <MDXProvider components={getComponents({ components: {} })}>
        <RouterProvider router={router} />
      </MDXProvider>
    </ErrorBoundary>
  );
}

// function CustomP(props: JSX.IntrinsicAttributes & ClassAttributes<HTMLDivElement> & HTMLAttributes<HTMLDivElement>) {
//   const { children } = props;
//   console.log('CustomP props', props);
//   return <div style={{ color: 'red', backgroundColor: 'green' }}>{children}</div>;
// }

// const components = {
//   p: CustomP,
// };
