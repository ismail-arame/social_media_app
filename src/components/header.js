import { useContext, useState } from 'react';
import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { setOpenUploadModal } from '../redux/upload/upload.actions';

import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import UserFirestoreContext from '../context/user-firestore';
import * as ROUTES from '../constants/routes';

import { selectOpenUploadModal } from '../redux/upload/upload.selectors';
import { selectUploadProfileImageSrc } from '../redux/upload-profile/upload-profile.selectors';

import { LazyLoadImage } from 'react-lazy-load-image-component';

export default function Header() {
  const {
    userFirestore: { username, profileImageSrc },
  } = useContext(UserFirestoreContext);

  const { firebase } = useContext(FirebaseContext);

  const history = useHistory();

  const openUploadModal = useSelector(selectOpenUploadModal, shallowEqual);
  const uploadProfileImageSrc = useSelector(
    selectUploadProfileImageSrc,
    shallowEqual
  );
  const dispatch = useDispatch();

  const [isLazyLoading, setLazyLoading] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-gray-primary mb-8 fixed w-screen top-0 z-20">
      <div className=" container mx-auto max-w-screen-lg h-full px-10">
        <div className=" flex justify-between h-full">
          <div className="text-gray-700 text-center items-center cursor-pointer h-full">
            <h1 className="flex justify-center items-center w-full h-full">
              <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                <img
                  src="/images/logo.png"
                  alt="instagram logo"
                  className="w-6/12 "
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 text-center flex items-center ">
            {username ? (
              <>
                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </Link>
                <button
                  type="button"
                  title="upload"
                  onClick={() => {
                    dispatch(setOpenUploadModal());
                    console.log('upload photo***');
                  }}
                >
                  <svg
                    className="w-8 mr-6 cursor-pointer"
                    aria-label="New Post"
                    color="#262626"
                    fill="#262626"
                    height="28"
                    role="img"
                    viewBox="0 0 24 24"
                    width="28"
                  >
                    <path
                      d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="6.545"
                      x2="17.455"
                      y1="12.001"
                      y2="12.001"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="12.003"
                      x2="12.003"
                      y1="6.545"
                      y2="17.455"
                    ></line>
                  </svg>
                </button>
                <button
                  type="button"
                  title="Sign Out"
                  onClick={() => {
                    firebase.auth().signOut();
                    history.push(ROUTES.LOGIN);
                  }}
                  onKeyDown={event => {
                    if (event.key === 'Enter') {
                      firebase.auth().signOut();
                      history.push(ROUTES.LOGIN);
                    }
                  }}
                >
                  <svg
                    className="w-8 mr-6 text-black-light cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
                <div className="flex items-center cursor-pointer">
                  <Link to={`/p/${username}`}>
                    <div
                      className={`rounded-full h-8 w-8 transition-colors  ${
                        isLazyLoading
                          ? 'bg-gray-lazy2 animate-pulse-faster'
                          : ''
                      }`}
                    >
                      <LazyLoadImage
                        width="100%"
                        height="100%"
                        effect="opacity"
                        src={uploadProfileImageSrc}
                        className="flex rounded-full h-full w-full object-cover border border-gray-transparent"
                        alt={`${username} profile`}
                        beforeLoad={() => setLazyLoading(true)}
                        afterLoad={() => setLazyLoading(false)}
                        onError={e => {
                          e.target.src = '/images/avatars/default.png';
                        }}
                      />
                    </div>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className=" bg-blue-light font-semibold text-sm rounded text-white w-16 h-8 mr-2"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button
                    type="button"
                    className=" font-semibold text-sm rounded text-blue-light w-16 h-8"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
