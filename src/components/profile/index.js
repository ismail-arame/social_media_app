import { useReducer, useEffect } from 'react';
import propTypes from 'prop-types';
import Header from './header';
import { getUserPhotosByUserId } from '../../services/firebase';
import Photos from './photos';

// import { useDispatch } from 'react-redux';
// import { setUploadProfileImageSrc } from '../../redux/upload-profile/upload-profile.actions';
//using useReducer for better state handling
//we pass in the user Profile that we are looking for (not the Active User the Profile Searched)

export default function UserProfile({ user }) {
  const reducer = (state, newState) => ({ ...state, ...newState });

  const INITAIL_STATE = {
    profile: {},
    photosCollection: null,
    followerCount: 0,
  };

  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    INITAIL_STATE
  );
  // const dispatch = useDispatch();

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      const photos = await getUserPhotosByUserId(user.userId);

      console.log('photos', photos);
      console.log('user', user);

      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: user.followers.length,
      });
    }

    getProfileInfoAndPhotos();
  }, [user]);

  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch} //now setFollowerCount will be the dispatch function in the Profile Header Component
      />
      <Photos photos={photosCollection} />
    </>
  );
}

UserProfile.propTypes = {
  user: propTypes.shape({
    emailAddress: propTypes.string.isRequired,
    followers: propTypes.array.isRequired,
    following: propTypes.array.isRequired,
    fullName: propTypes.string.isRequired,
    userId: propTypes.string.isRequired,
    username: propTypes.string.isRequired,
  }),
};

// dateCreated: propTypes.number,
