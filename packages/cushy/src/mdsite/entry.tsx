import React from 'react';
import ReactDOM, { type ErrorInfo } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './app';
import { canUseDOM } from './can-use-dom';

// 暂时先不处理 hydrate
const hydrate = /* Boolean(process.env.HYDRATE_MDSITE_ENTRY) */ false;

// Client-side render (e.g: running in browser) to become single-page
// application (SPA).
if (canUseDOM) {
  const container = document.getElementById('__cushy_container')!;

  const app = (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );

  const onRecoverableError = (error: unknown, errorInfo: ErrorInfo): void => {
    console.error('Cushy React Root onRecoverableError:', error, errorInfo);
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

  Promise.resolve().then(() => {
    renderApp();
  });

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
