import ProfilePhotosActionTypes from './profile-photos.types';

export const setListOfProfilePhotos = listOfPhotos => ({
  type: ProfilePhotosActionTypes.SET_LIST_OF_PROFILE_PHOTOS,
  payload: listOfPhotos,
});

export const setProfile = profile => ({
  type: ProfilePhotosActionTypes.SET_PROFILE,
  payload: profile,
});

export const setPhotosCollection = photos => ({
  type: ProfilePhotosActionTypes.SET_PHOTOS_COLLECTION,
  payload: photos,
});

export const setFollowerCount = followerCount => ({
  type: ProfilePhotosActionTypes.SET_FOLLOWER_COUNT,
  payload: followerCount,
});
