import { useState, useEffect, useContext } from 'react';
import propTypes from 'prop-types';
import ProfileSkeleton from './profile-skeleton';

import UserFirestoreContext from '../../context/user-firestore';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { selectUploadProfileImageSrc } from '../../redux/upload-profile/upload-profile.selectors';
// import { setOpenUploadProfileModal } from '../redux/upload-profile/upload-profile.actions.js';
import { setOpenUploadProfileModal } from '../../redux/upload-profile/upload-profile.actions';
// const dispatch = useDispatch();

import { LazyLoadImage } from 'react-lazy-load-image-component';

import {
  // isUserFollowingProfile,
  //https://fond-ecran-manga.fr/wp-content/uploads/2020/06/heroes-450x253.jpg
  ///images/users/raphael/5.jpg
  toggleFollow,
} from '../../services/firebase';

export default function Header({
  photosCount,
  profile: {
    docId: profileDocId, //Destructuring for better naming
    userId: profileUserId,
    fullName: profileFullName,
    username: profileUsername,
    following: profileFollowing = [], //default value if it's undefined or null
    followers: profileFollowers = [],
    profileImageSrc,
  },
  followerCount,
  setFollowerCount,
}) {
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);

  const uploadProfileImageSrc = useSelector(
    selectUploadProfileImageSrc,
    shallowEqual
  );

  const dispatch = useDispatch();

  //we are reducing the following array by 1 because we don't wanna the user be following himself we did it only to show the posts of the active user in his own TimeLine

  //the Current Logged In User (To know whether the active user is following the searched User Profile or not)
  //Pulling active user data from the UserFirestoreContext Provider which is in the Profile Component  => ( ./src/pages/profile.js)
  const { userFirestore } = useContext(UserFirestoreContext);
  console.log('userFirestore', userFirestore);

  //whether to show the Follow UnFollow button or not (when going to the Active User we shouldn't show the Button)
  const activeBtnFollow =
    userFirestore.username && userFirestore.username !== profileUsername;
  console.log('activeBtnFollow', activeBtnFollow);

  //Handling Folloe Toggle
  const handleToggleFollow = async () => {
    setIsFollowingProfile(isFollowingProfile => !isFollowingProfile);

    //setFollowerCount is the dispatch function that we passed as props from profile index to Header Component
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });

    await toggleFollow(
      userFirestore.docId,
      profileUserId,
      profileDocId,
      userFirestore.userId, //followingUserID => logged in user is the one that follows the profile User
      isFollowingProfile
    );
  };

  useEffect(() => {
    //checking if the profileUserId exist in the LoggedInUser following array
    const isLoggedInUserFollowingProfile = () => {
      const isFollowing = userFirestore.following.includes(profileUserId);
      console.log('isFollowing', isFollowing);
      setIsFollowingProfile(isFollowing);
    };

    if (userFirestore.following && profileUserId) {
      console.log('userFirestore', userFirestore);
      console.log('profileUserId', profileUserId);
      isLoggedInUserFollowingProfile();
    }
  }, [userFirestore, profileUserId]);

  //WARNING : DO SOME SKELETON THEME TO Make it look Nice And Make better UI/UX
  const [isLazyLoading, setLazyLoading] = useState(false);
  return (
    <div className="grid grid-cols-3 gap-4 justify-between">
      {!userFirestore || !profileUsername ? (
        <ProfileSkeleton />
      ) : (
        <>
          <div className="container flex justify-center">
            <div
              className={`rounded-full h-40 w-40 transition-colors  ${
                isLazyLoading ? 'bg-gray-lazy2 animate-pulse-faster' : ''
              }`}
            >
              <LazyLoadImage
                width="100%"
                height="100%"
                effect="blur"
                className="rounded-full object-cover h-full w-full border border-gray-transparent"
                src={activeBtnFollow ? profileImageSrc : uploadProfileImageSrc}
                alt="profile img"
                beforeLoad={() => setLazyLoading(true)}
                afterLoad={() => setLazyLoading(false)}
                onError={e => {
                  e.target.src = '/images/avatars/default.png';
                }}
              />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center col-span-2">
            <div className="container flex items-center">
              <p className="text-[28px] font-light mr-4 text-black-light">
                {profileUsername}
              </p>
              {activeBtnFollow ? (
                <button
                  className="font-semibold text-sm bg-blue-light rounded text-white w-24 h-8 tracking-wide"
                  type="button"
                  onClick={handleToggleFollow}
                >
                  {isFollowingProfile ? 'UnFollow' : 'Follow'}
                </button>
              ) : (
                <button
                  className="font-semibold text-sm bg-blue-light rounded text-white w-44 h-8 tracking-wide"
                  type="button"
                  onClick={() => {
                    dispatch(setOpenUploadProfileModal());
                    console.log('upload Profile photo***');
                  }}
                >
                  Edit Profile Picture
                </button>
              )}
            </div>
            <div className="container flex mt-6">
              <p className="mr-10">
                <span className="font-semibold">
                  {photosCount}
                  <span className="text-black-light font-normal">
                    {` `}
                    {photosCount === 1 ? 'post' : 'posts'}
                  </span>
                </span>
              </p>
              <p className="mr-10">
                <span className="font-semibold">
                  {followerCount}{' '}
                  <span className="text-black-light font-normal">
                    {` `}
                    {followerCount === 1 ? 'follower' : 'followers'}
                  </span>
                </span>
              </p>
              <p className="mr-10">
                <span className="font-semibold">
                  {profileFollowing.length - 1}
                  <span className="text-black-light font-normal">
                    {` `}
                    following
                  </span>
                </span>
              </p>
            </div>
            <div className="container mt-6">
              <p className="font-semibold">{profileFullName}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

Header.propTypes = {
  photosCount: propTypes.number.isRequired,
  followerCount: propTypes.number.isRequired,
  setFollowerCount: propTypes.func.isRequired,
  profile: propTypes.shape({
    docId: propTypes.string,
    userId: propTypes.string,
    emailAddress: propTypes.string,
    followers: propTypes.array,
    following: propTypes.array,
    fullName: propTypes.string,
    username: propTypes.string,
  }).isRequired,
};
