import timelineActionTypes from './timeline.types';

const INITIAL_STATE = {
  listOfPhotos: null,
};

const timelineReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case timelineActionTypes.SET_LIST_OF_PHOTOS:
      return {
        ...state,
        listOfPhotos:
          state.listOfPhotos && action.payload
            ? [...state.listOfPhotos, ...action.payload]
            : action.payload,
      };

    default:
      return state;
  }
};

export default timelineReducer;
