import postModalActionTypes from './post-modal.types';

export const setPostModalOpen = () => ({
  type: postModalActionTypes.SET_POST_MODAL_OPEN,
});

export const setPostModalContent = content => ({
  type: postModalActionTypes.SET_POST_MODAL_CONTENT,
  payload: content,
});
