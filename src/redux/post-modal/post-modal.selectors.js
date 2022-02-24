import { createSelector } from 'reselect';

const selectPostModal = state => state.postModal;

export const selectPostModalOpen = createSelector(
  [selectPostModal],
  postModal => postModal.postModalOpen
);

export const selectPostModalContent = createSelector(
  [selectPostModal],
  postModal => postModal.postModalContent
);
