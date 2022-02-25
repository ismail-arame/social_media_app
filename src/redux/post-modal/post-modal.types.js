const postModalActionTypes = {
  SET_POST_MODAL_OPEN: 'SET_POST_MODAL_OPEN',

  //only for Dashboard
  SET_POST_MODAL_CONTENT: 'SET_POST_MODAL_CONTENT', //we pass the post data to show it in the modal

  //actions (like and comment functionality) (one SINGLE SOURCE of Truth)
  SET_TOGGLE_LIKED: 'SET_TOGGLE_LIKED',
  SET_LIKES: 'SET_LIKES',
};

export default postModalActionTypes;
