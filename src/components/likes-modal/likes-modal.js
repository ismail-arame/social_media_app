//https://headlessui.dev and see there docs there
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { useContext } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  selectLikesModalOpen,
  selectPostLikesContent,
} from '../../redux/likes-modal/likes-modal.selectors';
import { setLikesModalOpen } from '../../redux/likes-modal/likes-modal.actions';
import usePostLikesUsers from '../../hooks/use-post-likes-users';
import UserFirestoreContext from '../../context/user-firestore';
import LikesDetail from './likes-detail';
import LikesModalSkeleton from './likes-modal-skeleton';

export default function LikesModal() {
  const { userFirestore } = useContext(UserFirestoreContext);
  const dispatch = useDispatch();

  const likesModalOpen = useSelector(selectLikesModalOpen, shallowEqual);
  const postLikesContent = useSelector(selectPostLikesContent, shallowEqual);

  const { postLikesUsers, isLoading } = usePostLikesUsers(
    postLikesContent?.dateCreated,
    postLikesContent?.imageSrc,
    postLikesContent?.activeUserId
  );
  console.log('postLikesUsers', postLikesUsers);

  // const [followed, setFollowed] = useState(false);

  return (
    <Transition.Root show={likesModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-hidden
        max-w-[410px]
        max-h-[400px] my-auto
        mx-auto"
        onClose={() => dispatch(setLikesModalOpen())}
      >
        <div className="flex items-end justify-center  h-full w-full  text-center">
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
          <span className="hidden  sm:align-middle" aria-hidden="true">
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
            <div className="inline-block h-full w-full max-w-sm  overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
              <div className="h-full grid auto-rows-min relative">
                <div className="border-b border-gray-transparent text-center py-[9px]">
                  <span className="text-black-light font-medium text-base tracking-wide-[0.01rem]">
                    Likes
                  </span>
                </div>
                <div className="absolute top-[43px] bottom-0 w-full pr-1.5">
                  <div className="h-full grid auto-rows-min overflow-y-scroll overflow-x-hidden">
                    {isLoading || !postLikesUsers || !userFirestore ? (
                      <>
                        <LikesModalSkeleton />
                        <LikesModalSkeleton />
                        <LikesModalSkeleton />
                        <LikesModalSkeleton />
                        <LikesModalSkeleton />
                      </>
                    ) : postLikesUsers.length > 0 ? (
                      postLikesUsers.map((likesUser, i) => (
                        <LikesDetail
                          key={i}
                          loggedInUser={userFirestore}
                          likesUser={likesUser}
                        />
                      ))
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
