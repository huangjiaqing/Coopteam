import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'ctx';
import App from './app';

const render = (Component) => {
  ReactDOM.render(
    <Provider>
      <Component />
    </Provider>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept(['./app'], async () => {
    const { default: next } = await import('./app');
    render(next);
  });
}
