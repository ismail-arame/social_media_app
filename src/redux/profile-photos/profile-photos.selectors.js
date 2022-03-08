import { createSelector } from 'reselect';

const selectProfilePhotos = state => state.profilePhotos;

export const selectListOfProfilePhotos = createSelector(
  [selectProfilePhotos],
  profilePhotos => profilePhotos.listOfProfilePhotos
);

export const selectProfile = createSelector(
  [selectProfilePhotos],
  profilePhotos => profilePhotos.profile
);

export const selectPhotosCollection = createSelector(
  [selectProfilePhotos],
  profilePhotos => profilePhotos.photosCollection
);

export const selectFollowerCount = createSelector(
  [selectProfilePhotos],
  profilePhotos => profilePhotos.followerCount
);
