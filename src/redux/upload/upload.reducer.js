import uploadActionTypes from './upload.types';

const INITIAL_STATE = {
  openUploadModal: false,
  selectedUploadFile: null,
  uploadFileLoading: false,
};

const uploadReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case uploadActionTypes.SET_OPEN_UPLOAD_MODAL:
      return {
        ...state,
        openUploadModal: !state.openUploadModal,
      };

    case uploadActionTypes.SET_SELECTED_UPLOAD_FILE:
      return {
        ...state,
        selectedUploadFile: action.payload,
      };

    case uploadActionTypes.SET_UPLOAD_FILE_LOADING:
      return {
        ...state,
        uploadFileLoading: !state.uploadFileLoading,
      };
    default:
      return state;
  }
};

export default uploadReducer;
