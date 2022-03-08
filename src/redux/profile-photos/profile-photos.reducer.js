import ProfilePhotosActionTypes from './profile-photos.types';

const INITIAL_STATE = {
  listOfProfilePhotos: null,
  profile: {},
  photosCollection: null,
  followerCount: 0,
};

const profilePhotosReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ProfilePhotosActionTypes.SET_LIST_OF_PROFILE_PHOTOS:
      return {
        ...state,
        listOfProfilePhotos: action.payload,
      };

    case ProfilePhotosActionTypes.SET_PROFILE:
      return {
        ...state,
        profile: action.payload,
      };

    case ProfilePhotosActionTypes.SET_PHOTOS_COLLECTION:
      return {
        ...state,
        photosCollection: action.payload,
      };

    case ProfilePhotosActionTypes.SET_FOLLOWER_COUNT:
      return {
        ...state,
        followerCount: action.payload,
      };
    default:
      return state;
  }
};

export default profilePhotosReducer;
