import { createSelector } from 'reselect';

const selectFollowersModal = state => state.followersModal;

export const selectFollowersModalOpen = createSelector(
  [selectFollowersModal],
  followersModal => followersModal.followersModalOpen
);
