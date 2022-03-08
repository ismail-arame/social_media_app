import { createSelector } from 'reselect';

const selectLikesModal = state => state.likesModal;

export const selectLikesModalOpen = createSelector(
  [selectLikesModal],
  likesModal => likesModal.likesModalOpen
);

export const selectPostLikesContent = createSelector(
  [selectLikesModal],
  likesModal => likesModal.postLikesContent
);
