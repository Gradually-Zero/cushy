import React from 'react';
import ReactDOM, { type ErrorInfo } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import { canUseDOM } from './can-use';

// import preload from './preload';

const hydrate = Boolean(process.env.HYDRATE_CLIENT_ENTRY);

// Client-side render (e.g: running in browser) to become single-page
// application (SPA).
if (canUseDOM) {
  const container = document.getElementById('__cushy_container')!;

  const app = (
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );

  const onRecoverableError = (error: unknown, errorInfo: ErrorInfo): void => {
    console.error('Docusaurus React Root onRecoverableError:', error, errorInfo);
  };

  const renderApp = () => {
    if (hydrate) {
      React.startTransition(() => {
        ReactDOM.hydrateRoot(container, app, {
          onRecoverableError,
        });
      });
    } else {
      const root = ReactDOM.createRoot(container, { onRecoverableError });
      React.startTransition(() => {
        root.render(app);
      });
    }
  };

  // preload(window.location.pathname).then(renderApp);
  renderApp();

  // Webpack Hot Module Replacement API
  if (module.hot) {
    // Self-accepting method/ trick
    // (https://github.com/webpack/webpack-dev-server/issues/100#issuecomment-290911036)
    module.hot.accept();
  }
}

declare global {
  interface NodeModule {
    hot?: { accept: () => void };
  }
}
