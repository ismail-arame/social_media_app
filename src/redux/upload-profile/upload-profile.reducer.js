import uploadProfileActionTypes from './upload-profile.types';

const INITIAL_STATE = {
  openUploadProfileModal: false,
  selectedUploadProfileFile: null,
  uploadProfileFileLoading: false,
  uploadProfileImageSrc: null,
};

const uploadProfileReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case uploadProfileActionTypes.SET_OPEN_UPLOAD_PROFILE_MODAL:
      return {
        ...state,
        openUploadProfileModal: !state.openUploadProfileModal,
      };

    case uploadProfileActionTypes.SET_SELECTED_UPLOAD_PROFILE_FILE:
      return {
        ...state,
        selectedUploadProfileFile: action.payload,
      };

    case uploadProfileActionTypes.SET_UPLOAD_PROFILE_FILE_LOADING:
      return {
        ...state,
        uploadProfileFileLoading: !state.uploadProfileFileLoading,
      };

    case uploadProfileActionTypes.SET_UPLOAD_PROFILE_IMAGE_SRC:
      return {
        ...state,
        uploadProfileImageSrc: action.payload,
      };

    default:
      return state;
  }
};

export default uploadProfileReducer;
