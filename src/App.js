import { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom/cjs/react-router-dom.min';

//react-loader-spinner LIBRARY
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Triangle } from 'react-loader-spinner';

// import Spinner from './components/spinner/spinner.component';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUploadProfileImageSrc } from './redux/upload-profile/upload-profile.actions';
import { getUserByUserId } from './services/firebase';

import * as ROUTES from './constants/routes';
import ProtectedRoute from './helpers/protected-route';
import IsUserLoggedIN from './helpers/is-user-logged-in';

import useAuthListener from './hooks/use-auth-listener';
import UserContext from './context/user';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';

// => Code Splitting :
const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/sign-up'));
const NotFound = lazy(() => import('./pages/not-found'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));

export default function App() {
  const { user } = useAuthListener();
  const dispatch = useDispatch();

  useEffect(() => {
    const getUserData = async () => {
      const [userFirestoreData] = await getUserByUserId(user?.uid);
      //updating user Profile Image on initial render of profile page
      dispatch(setUploadProfileImageSrc(userFirestoreData.profileImageSrc));
    };
    getUserData();
  }, [user, dispatch]);

  return (
    <UserContext.Provider value={{ user }}>
      <Router>
        <Suspense
          fallback={
            <div className="h-screen w-screen flex flex-col gap-2 items-center justify-center">
              <Triangle
                height="200"
                width="200"
                color="#4b5563"
                ariaLabel="loading"
              />
              <p className="text-2xl font-semibold text-black-light animate-pulse-fast">
                LOADING...
              </p>
            </div>
          }
        >
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
