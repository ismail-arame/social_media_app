import uploadProfileActionTypes from './upload-profile.types';

//ACTION CREATORS
export const setOpenUploadProfileModal = () => ({
  type: uploadProfileActionTypes.SET_OPEN_UPLOAD_PROFILE_MODAL,
});

export const setSelectedUploadProfileFile = selectedUploadFile => ({
  type: uploadProfileActionTypes.SET_SELECTED_UPLOAD_PROFILE_FILE,
  payload: selectedUploadFile,
});

export const setUploadProfileFileLoading = () => ({
  type: uploadProfileActionTypes.SET_UPLOAD_PROFILE_FILE_LOADING,
});

export const setUploadProfileImageSrc = uploadProfileImageSrc => ({
  type: uploadProfileActionTypes.SET_UPLOAD_PROFILE_IMAGE_SRC,
  payload: uploadProfileImageSrc,
});
