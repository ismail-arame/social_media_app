import { lazy } from 'react';
import {
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from 'react-router-dom/cjs/react-router-dom.min';

// import Spinner from './components/spinner/spinner.component';
import './app.css';

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

import PostModal from './components/post-modal/post-modal';

// => Code Splitting :
const Login = lazy(() => import('./pages/login'));
const SignUp = lazy(() => import('./pages/sign-up'));
const NotFound = lazy(() => import('./pages/not-found'));
const Dashboard = lazy(() => import('./pages/dashboard'));
const Profile = lazy(() => import('./pages/profile'));

export default function App() {
  const { user } = useAuthListener();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const location = useLocation();
  const background = location.state && location.state.background;

  useEffect(() => {
    const getUserData = async () => {
      const [userFirestoreData] = await getUserByUserId(user?.uid);
      //updating user Profile Image on initial render of profile page
      dispatch(setUploadProfileImageSrc(userFirestoreData.profileImageSrc));
    };
    getUserData();
  }, [user, dispatch]);

  // location={postModalOpen ? background : location} => not good it will re render the Dshboard ROUTE once we remove the modal
  return (
    <UserContext.Provider value={{ user }}>
      <Switch location={background || location}>
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

      {/* check GOOGLE => HOW TO MAKE ROUTABLE MODALS (NOBODY KNOWS EVERYTHING hhhh) */}
      {background && <Route path={ROUTES.POST} children={<PostModal />} />}
    </UserContext.Provider>
  );
}
