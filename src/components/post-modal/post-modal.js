import { useState, useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { useRef, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
// import UserFirestoreContext from '../context/user-firestore';
import { setPostModalOpen } from '../../redux/post-modal/post-modal.actions';
import {
  selectPostModalOpen,
  selectPostModalContent,
} from '../../redux/post-modal/post-modal.selectors';

import { getUserByUserId, toggleFollow } from '../../services/firebase';

//https://headlessui.dev and see there docs there
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import PostModalImage from './post-image';

//Skeleton
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useUser from '../../hooks/use-user';
import PostModalHeader from './post-header';
import PostModalCaptionComment from './post-caption-comment';

//Date Formatting
import { formatDistance } from 'date-fns';

export default function PostModal() {
  //getting the post Owner DATA
  const [postUser, setPostUser] = useState(null);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);

  const { user: userFirestore } = useUser();

  const dispatch = useDispatch();
  const history = useHistory();

  const postModalOpen = useSelector(selectPostModalOpen, shallowEqual);
  const postModalContent = useSelector(selectPostModalContent, shallowEqual);

  //whether to show the btn Follow or not
  const activeBtnFollow =
    userFirestore?.username && userFirestore?.username !== postUser?.username;

  const handleToggleFollow = async () => {
    setIsFollowingProfile(isFollowingProfile => !isFollowingProfile);

    await toggleFollow(
      userFirestore.docId,
      postModalContent.userId, //profileUserId
      postModalContent.docId, //profileDocId
      userFirestore.userId, //followingUserID => logged in user is the one that follows the profile User
      isFollowingProfile
    );
  };

  useEffect(() => {
    const getPostUser = async () => {
      const [response] = await getUserByUserId(postModalContent.userId);

      setPostUser(response);
    };

    if (postModalContent?.userId) getPostUser();

    const isLoggedInUserFollowingProfile = () => {
      const isFollowing = userFirestore.following.includes(
        postModalContent.userId
      );
      console.log('isFollowing', isFollowing);
      setIsFollowingProfile(isFollowing);
    };

    if (userFirestore.following && postModalContent.userId) {
      console.log('userFirestore', userFirestore);
      console.log('profileUserId', postModalContent.userId);
      isLoggedInUserFollowingProfile();
    }
  }, [postModalContent, userFirestore]);

  return (
    <Transition.Root show={postModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-y-hidden max-w-5xl my-auto max-h-postModalHeight mx-auto px-6"
        onClose={() => {
          dispatch(setPostModalOpen());
          history.goBack();
        }}
      >
        <div className="flex items-end justify-center mx-auto h-full  text-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className=" fixed inset-0 bg-black-light backdrop-blur-[2px] bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 scale-95"
          >
            <div className="inline-block w-full h-full overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-tr-md rounded-br-md">
              {/* everything about the POST MODAL will be written here  */}
              <div className="w-full h-full grid grid-cols-10">
                <div className="col-span-5 h-full">
                  <PostModalImage
                    imageSrc={postModalContent.imageSrc}
                    username={postModalContent.username}
                  />
                </div>
                <div className="col-span-5 h-full">
                  {!postUser || !userFirestore ? (
                    <Skeleton count={1} width={100} height={60} />
                  ) : (
                    <div className="flex flex-col h-full">
                      <PostModalHeader
                        postUserUsername={postUser.username}
                        postUserFullName={postUser.fullName}
                        postUserProfileImageSrc={postUser.profileImageSrc}
                        activeBtnFollow={activeBtnFollow}
                        isFollowingProfile={isFollowingProfile}
                        handleToggleFollow={handleToggleFollow}
                      />
                      <PostModalCaptionComment
                        postUserProfileImageSrc={postUser.profileImageSrc}
                        postUserUsername={postUser.username}
                        caption={postModalContent.caption}
                        posted={postModalContent.dateCreated}
                        comments={postModalContent.comments}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
