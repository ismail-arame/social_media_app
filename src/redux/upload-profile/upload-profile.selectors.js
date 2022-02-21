import { createSelector } from 'reselect';

const selectUploadProfile = state => state.uploadProfile;

export const selectOpenUploadProfileModal = createSelector(
  [selectUploadProfile],
  uploadProfile => uploadProfile.openUploadProfileModal
);

export const selectSelectedUploadProfileFile = createSelector(
  [selectUploadProfile],
  uploadProfile => uploadProfile.selectedUploadProfileFile
);

export const selectUploadProfileFileLoading = createSelector(
  [selectUploadProfile],
  uploadProfile => uploadProfile.uploadProfileFileLoading
);

export const selectUploadProfileImageSrc = createSelector(
  [selectUploadProfile],
  uploadProfile => uploadProfile.uploadProfileImageSrc
);
