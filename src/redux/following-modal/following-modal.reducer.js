import followingModalActionTypes from './following-modal.types';

const INITIAL_STATE = {
  followingModalOpen: false,
};

const followingModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case followingModalActionTypes.SET_FOLLOWING_MODAL_OPEN:
      return {
        ...state,
        followingModalOpen: !state.followingModalOpen,
      };

    default:
      return state;
  }
};

export default followingModalReducer;
