import uploadActionTypes from './upload.types';

//ACTION CREATORS
export const setOpenUploadModal = () => ({
  type: uploadActionTypes.SET_OPEN_UPLOAD_MODAL,
});

export const setSelectedUploadFile = selectedUploadFile => ({
  type: uploadActionTypes.SET_SELECTED_UPLOAD_FILE,
  payload: selectedUploadFile,
});

export const setUploadFileLoading = () => ({
  type: uploadActionTypes.SET_UPLOAD_FILE_LOADING,
});
