import { createSelector } from 'reselect';

const selectTimeline = state => state.timeline;

export const selectListOfPhotos = createSelector(
  [selectTimeline],
  timeline => timeline.listOfPhotos
);
