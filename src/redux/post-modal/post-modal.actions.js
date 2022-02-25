import postModalActionTypes from './post-modal.types';

export const setPostModalOpen = () => ({
  type: postModalActionTypes.SET_POST_MODAL_OPEN,
});

//we pass the post data to show it in the modal
export const setPostModalContent = content => ({
  type: postModalActionTypes.SET_POST_MODAL_CONTENT,
  payload: content,
});

//actions (like and comment functionality) (one SINGLE SOURCE of Truth)
export const setPostModalToggleLiked = userLikedPhoto => ({
  type: postModalActionTypes.SET_TOGGLE_LIKED,
  payload: userLikedPhoto,
});

// userLikedPhoto => boolean
export const setPostModalLikes = totalLikes => ({
  type: postModalActionTypes.SET_LIKES,
  payload: totalLikes,
});
