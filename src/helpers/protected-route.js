import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import propTypes from 'prop-types';
import * as ROUTES from '../constants/routes';

export default function ProtectedRoute({ user, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (user) return children;

        if (!user) {
          return <Redirect to={ROUTES.LOGIN} />;
        }

        return null;
      }}
    />
  );
}

ProtectedRoute.propTypes = {
  user: propTypes.object,
  children: propTypes.object.isRequired,
};
