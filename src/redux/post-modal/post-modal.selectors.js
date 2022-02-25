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

export const selectPostModalToggleLiked = createSelector(
  [selectPostModal],
  postModal => postModal.toggleLiked
);

export const selectPostModalLikes = createSelector(
  [selectPostModal],
  postModal => postModal.likes
);
