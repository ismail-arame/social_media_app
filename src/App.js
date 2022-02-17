import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';

import Spinner from './components/spinner/spinner.component';

import * as ROUTES from './constants/routes';
import ProtectedRoute from './helpers/protected-route';
import IsUserLoggedIN from './helpers/is-user-logged-in';

import useAuthListener from './hooks/use-auth-listener';
import UserContext from './context/user';

// => Code Splitting :
const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/sign-up'));
const NotFound = lazy(() => import('./pages/not-found'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));

export default function App() {
  const { user } = useAuthListener();

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense fallback={<Spinner />}>
          <Switch>
            <IsUserLoggedIN
              user={user}
              loggedInPath={ROUTES.DASHBOARD}
              exact
              path={ROUTES.LOGIN}
            >
              <Login />
            </IsUserLoggedIN>
            <IsUserLoggedIN
              user={user}
              loggedInPath={ROUTES.DASHBOARD}
              exact
              path={ROUTES.SIGN_UP}
            >
              <SignUp />
            </IsUserLoggedIN>
            <Route path={ROUTES.PROFILE} component={Profile} />
            <ProtectedRoute user={user} exact path={ROUTES.DASHBOARD}>
              <Dashboard />
            </ProtectedRoute>
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </Router>
    </UserContext.Provider>
  );
}
