import likesModalActionTypes from './likes-modal.types';

export const setLikesModalOpen = () => ({
  type: likesModalActionTypes.SET_LIKES_MODAL_OPEN,
});

export const setPostLikesContent = content => ({
  type: likesModalActionTypes.SET_POST_LIKES_CONTENT,
  payload: content,
});
