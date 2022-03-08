import { createSelector } from 'reselect';

const selectFollowingModal = state => state.followingModal;

export const selectFollowingModalOpen = createSelector(
  [selectFollowingModal],
  followingModal => followingModal.followingModalOpen
);
