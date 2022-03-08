import likesModalActionTypes from './likes-modal.types';

const INITIAL_STATE = {
  likesModalOpen: false,
  postLikesContent: null,
};

const likesModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case likesModalActionTypes.SET_LIKES_MODAL_OPEN:
      return {
        ...state,
        likesModalOpen: !state.likesModalOpen,
      };

    case likesModalActionTypes.SET_POST_LIKES_CONTENT:
      return {
        ...state,
        postLikesContent: action.payload,
      };

    default:
      return state;
  }
};

export default likesModalReducer;
