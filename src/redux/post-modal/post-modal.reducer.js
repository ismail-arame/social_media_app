import postModalActionTypes from './post-modal.types';
const INITIAL_STATE = {
  postModalOpen: false,
  postModalContent: null,
  toggleLiked: false,
  likes: 0,
};

const postModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case postModalActionTypes.SET_POST_MODAL_OPEN:
      return {
        ...state,
        postModalOpen: !state.postModalOpen,
      };

    case postModalActionTypes.SET_POST_MODAL_CONTENT:
      return {
        ...state,
        postModalContent: action.payload,
      };

    case postModalActionTypes.SET_TOGGLE_LIKED:
      return {
        ...state,
        toggleLiked: action.payload,
      };

    case postModalActionTypes.SET_LIKES:
      return {
        ...state,
        likes: action.payload,
      };

    default:
      return state;
  }
};

export default postModalReducer;
