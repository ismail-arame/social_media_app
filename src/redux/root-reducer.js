import { combineReducers } from 'redux';
import uploadReducer from './upload/upload.reducer';

export default combineReducers({
  upload: uploadReducer,
});

//upload => is the key that represents the slice of state (uploadReducer)
