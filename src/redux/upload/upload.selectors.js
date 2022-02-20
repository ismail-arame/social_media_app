import { createSelector } from 'reselect';

const selectUpload = state => state.upload;

export const selectOpenUploadModal = createSelector(
  [selectUpload],
  upload => upload.openUploadModal
);

export const selectSelectedUploadFile = createSelector(
  [selectUpload],
  upload => upload.selectedUploadFile
);

export const selectUploadFileLoading = createSelector(
  [selectUpload],
  upload => upload.uploadFileLoading
);
