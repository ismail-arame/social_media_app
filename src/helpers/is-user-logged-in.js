import { Route, Redirect } from 'react-router-dom';
import propTypes from 'prop-types';

export default function IsUserLoggedIn({
  user,
  loggedInPath,
  children,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (!user) return children;

        if (user) {
          return <Redirect to={loggedInPath} />;
        }

        return null;
      }}
    />
  );
}

IsUserLoggedIn.propTypes = {
  user: propTypes.object,
  loggedInPath: propTypes.string.isRequired,
  children: propTypes.object.isRequired,
};
