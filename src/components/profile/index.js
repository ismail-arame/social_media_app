import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import propTypes from 'prop-types';
import Header from './header';
import Photos from './photos';
import FirebaseContext from '../../context/firebase';

import { shallowEqual, useSelector, useDispatch } from 'react-redux';
import { selectUploadFileLoading } from '../../redux/upload/upload.selectors';
import { useParams } from 'react-router-dom';
import useProfilePhotos from '../../hooks/use-profile-photos';
import {
  getProfileFollowingUsers,
  getProfileFollowersUsers,
} from '../../services/firebase';
import {
  selectListOfProfilePhotos,
  selectProfile,
  selectPhotosCollection,
  selectFollowerCount,
} from '../../redux/profile-photos/profile-photos.selectors';
import {
  setListOfProfilePhotos,
  setProfile,
  setPhotosCollection,
  setFollowerCount,
} from '../../redux/profile-photos/profile-photos.actions';

//we pass in the user Profile that we are looking for (not the Active User the Profile Searched)
export default function UserProfile({ user }) {
  // /p/karl => params.username => karl
  const { photos } = useProfilePhotos(user.userId);
  const params = useParams();
  const { firebase } = useContext(FirebaseContext);
  const dispatch = useDispatch();

  const listOfProfilePhotos = useSelector(
    selectListOfProfilePhotos,
    shallowEqual
  );
  const profile = useSelector(selectProfile, shallowEqual);
  const photosCollection = useSelector(selectPhotosCollection, shallowEqual);
  const followerCount = useSelector(selectFollowerCount, shallowEqual);

  //uplading File Loading Status
  const uploadFileLoading = useSelector(selectUploadFileLoading, shallowEqual);
  const [listOfPhotos, setListOfPhotos] = useState(null);
  const [totalPhotosCount, setTotalPhotosCount] = useState(null);

  let lastDocument = useRef(null);

  //using this Ref t check if a photo uploaded is the same when i change the likes or comments on it (without it thae image uploaded creates another copy of itself (and the reason is setListOfPhotos doesn't set the state unless react re renders))
  let photoUploaded = useRef(null);

  const [nextPosts_loading, setNextPostsLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false); //is there any documents in the collection

  useEffect(() => {
    dispatch(setProfile(user));
    dispatch(setPhotosCollection(photos));
    dispatch(setFollowerCount(user.followers.length));

    // const getData = async () => {
    //   const response = await getProfileFollowingUsers(user.userId);
    //   console.log('response followers', response);
    // };
    // getData();

    //Number of profile User Photos (Number of Posts)
    const getTotalPhotosCount = async () => {
      const result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', '==', user.userId)
        .get();

      setTotalPhotosCount(result.docs.length);
      console.log('length', result.docs.length);
    };

    if (!totalPhotosCount) getTotalPhotosCount();

    if (photos && photos.length > 0) {
      console.log('fucka', photos);
      const photosLength = photos.length;
      const { lastDoc } = photos[photosLength - 1];
      //storing last Document
      lastDocument.current = lastDoc;
      // console.log(photos);
      //making realtime Timeline Posts (checking if the first image already exist in the listOfPhotos )
      //if it exists already do nothing else add it to the TimeLine Component

      const unSubscribeFromSnapshot = firebase
        .firestore()
        .collection('photos')
        .where('userId', '==', user.userId) //user.userId => profile User we visit
        .orderBy('dateCreated', 'desc')
        .limit(1)
        .onSnapshot(async snapshot => {
          if (listOfPhotos) {
            if (
              !listOfPhotos.some(
                photo => photo.docId === snapshot.docs[0].id
              ) &&
              !uploadFileLoading &&
              snapshot.docs[0].data().imageSrc &&
              photoUploaded.current !== snapshot.docs[0].id
            ) {
              photoUploaded.current = snapshot.docs[0].id;
              setListOfPhotos(listOfPhotos => [
                {
                  ...snapshot.docs[0].data(),
                  docId: snapshot.docs[0].id,
                },
                ...listOfPhotos,
              ]);
              setTotalPhotosCount(totalPhotosCount => totalPhotosCount + 1);
            }
          } else {
            if (
              !photos.some(photo => photo.docId === snapshot.docs[0].id) &&
              !uploadFileLoading &&
              snapshot.docs[0].data().imageSrc &&
              photoUploaded.current !== snapshot.docs[0].id
            ) {
              photoUploaded.current = snapshot.docs[0].id;
              setListOfPhotos(listOfPhotos => [
                {
                  ...snapshot.docs[0].data(),
                  docId: snapshot.docs[0].id,
                },
                ...listOfPhotos,
              ]);
              setTotalPhotosCount(totalPhotosCount => totalPhotosCount + 1);
            }
          }
          return () => unSubscribeFromSnapshot();
        });
    }

    setListOfPhotos(photos);
    console.log('ww', photos);
  }, [user, photos, photosCollection, firebase, dispatch]);

  //Intersection Observer (Infinite Scroll)
  const observer = useRef();
  //the last element fetched is being observed (To Perform Infinite Scrolling)
  const lastPostElementRef = useCallback(
    node => {
      console.log('fuck node', node);
      if (nextPosts_loading) return;
      const obsOptions = {
        root: null,
        threshold: 0, //scrolling 70% of the image and then it will be intersecting
        rootMargin: `0px`,
      };

      if (observer.current) observer.current.disconnect();
      //everything that it's watching as soon as they become visible they will be in the entries array
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          console.log('visible');
          console.log(isEmpty);
          if (!isEmpty) {
            fetchMore();
            console.log('yes');
          }
        }
      }, obsOptions);
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [nextPosts_loading, isEmpty]
  );

  //Fetching More (INFINTE SCROLL)
  const fetchMore = async () => {
    setNextPostsLoading(true); //loading State
    const result = await firebase
      .firestore()
      .collection('photos')
      .where('userId', '==', user.userId) //user.userId => profile User we visit
      .orderBy('dateCreated', 'desc')
      .startAfter(lastDocument.current)
      .limit(9)
      .get();

    //unAttach event Listeners when there is no more documents in the Firestore
    const isCollectionEmpty = result.size === 0;

    if (!isCollectionEmpty) {
      const profilePhotos = result.docs.map(photo => {
        return {
          ...photo.data(),
          docId: photo.id,
        };
      });

      const lastDoc = result.docs[result.docs.length - 1]; //Infinite Scrolling
      setListOfPhotos(listOfPhotos => [...listOfPhotos, ...profilePhotos]);

      lastDocument.current = lastDoc;
      console.log('profilePhotos', profilePhotos);
    } else {
      setIsEmpty(true);
    }
    setNextPostsLoading(false);
  };

  return (
    <>
      <Header
        photosCount={totalPhotosCount}
        profile={profile}
        followerCount={followerCount}
        // setFollowerCount={dispatch} //now setFollowerCount will be the dispatch function in the Profile Header Component
      />
      <Photos
        photos={listOfPhotos}
        lastPostElementRef={lastPostElementRef}
        nextPosts_loading={nextPosts_loading}
        isEmpty={isEmpty}
      />
    </>
  );
}

UserProfile.propTypes = {
  user: propTypes.shape({
    emailAddress: propTypes.string.isRequired,
    followers: propTypes.array.isRequired,
    following: propTypes.array.isRequired,
    fullName: propTypes.string.isRequired,
    userId: propTypes.string.isRequired,
    username: propTypes.string.isRequired,
  }),
};

// dateCreated: propTypes.number,
