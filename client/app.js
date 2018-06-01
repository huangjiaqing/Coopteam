import React from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import routes from './routes';

const Router = () => (
  <BrowserRouter>
    <Switch>
      {
        routes.map(({name, path, exact=true, component}) => (
          <Route key={name} path={path} exact={exact} component={component} />
        ))
      }
    </Switch>
  </BrowserRouter>
);

export default Router;
