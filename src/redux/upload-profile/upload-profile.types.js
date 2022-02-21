const uploadProfileActionTypes = {
  SET_OPEN_UPLOAD_PROFILE_MODAL: 'SET_OPEN_UPLOAD_PROFILE_MODAL',
  SET_SELECTED_UPLOAD_PROFILE_FILE: 'SET_SELECTED_UPLOAD_PROFILE_FILE',
  SET_UPLOAD_PROFILE_FILE_LOADING: 'SET_UPLOAD_PROFILE_FILE_LOADING',

  //Realtime Updating Profile Image using OnSnapshot (firebase)
  //whenever we upload a profile photo we need to update the placeholder all over our app in realtime
  SET_UPLOAD_PROFILE_IMAGE_SRC: 'SET_UPLOAD_PROFILE_IMAGE_SRC',
};

export default uploadProfileActionTypes;
