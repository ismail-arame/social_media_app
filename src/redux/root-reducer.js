import { combineReducers } from 'redux';
import uploadReducer from './upload/upload.reducer';
import uploadProfileReducer from './upload-profile/upload-profile.reducer';
import timelineReducer from './timeline/timeline.reducer';

export default combineReducers({
  upload: uploadReducer,
  uploadProfile: uploadProfileReducer,
  timeline: timelineReducer,
});

//upload => is the key that represents the slice of state (uploadReducer)
