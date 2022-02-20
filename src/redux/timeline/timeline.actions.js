import timelineActionTypes from './timeline.types';

export const setListOfPhotos = listOfPhotos => ({
  type: timelineActionTypes.SET_LIST_OF_PHOTOS,
  payload: listOfPhotos,
});
