import { combineReducers } from 'redux';
import uploadReducer from './upload/upload.reducer';
import uploadProfileReducer from './upload-profile/upload-profile.reducer';
import timelineReducer from './timeline/timeline.reducer';
import postModalReducer from './post-modal/post-modal.reducer';
import profilePhotosReducer from './profile-photos/profile-photos.reducer';
import followingModalReducer from './following-modal/following-modal.reducer';
import followersModalReducer from './followers-modal/followers-modal.reducer';

export default combineReducers({
  upload: uploadReducer,
  uploadProfile: uploadProfileReducer,
  timeline: timelineReducer,
  postModal: postModalReducer,
  profilePhotos: profilePhotosReducer,
  followingModal: followingModalReducer,
  followersModal: followersModalReducer,
});

//upload => is the key that represents the slice of state (uploadReducer)
