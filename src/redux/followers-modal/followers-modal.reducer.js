import followersModalActionTypes from './followers-modal.types';

const INITIAL_STATE = {
  followersModalOpen: false,
};

const followersModalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case followersModalActionTypes.SET_FOLLOWERS_MODAL_OPEN:
      return {
        ...state,
        followersModalOpen: !state.followersModalOpen,
      };

    default:
      return state;
  }
};

export default followersModalReducer;
