//https://headlessui.dev and see there docs there
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

import { useContext } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { selectFollowersModalOpen } from '../../redux/followers-modal/followers-modal.selectors';
import { setFollowersModalOpen } from '../../redux/followers-modal/followers-modal.actions';
import useProfileFollowersUsers from '../../hooks/use-profile-followers-users.js';
import UserFirestoreContext from '../../context/user-firestore';
import FollowersDetail from './followers-detail';
import FollowersModalSkeleton from './followers-modal-skeleton';

export default function FollowersModal({ user }) {
  const { userFirestore } = useContext(UserFirestoreContext);
  const dispatch = useDispatch();
  const followersModalOpen = useSelector(
    selectFollowersModalOpen,
    shallowEqual
  );

  const { profileFollowersUsers } = useProfileFollowersUsers(user.userId);
  console.log('profileFollowersUsers', profileFollowersUsers);

  // const [followed, setFollowed] = useState(false);

  return (
    <Transition.Root show={followersModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-hidden
        max-w-[410px]
        max-h-[400px] my-auto
        mx-auto"
        onClose={() => dispatch(setFollowersModalOpen())}
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
                    Followers
                  </span>
                </div>
                <div className="absolute top-[43px] bottom-0 w-full pr-1.5">
                  <div className="h-full grid auto-rows-min overflow-y-scroll overflow-x-hidden">
                    {!profileFollowersUsers || !userFirestore ? (
                      <>
                        <FollowersModalSkeleton />
                        <FollowersModalSkeleton />
                        <FollowersModalSkeleton />
                        <FollowersModalSkeleton />
                        <FollowersModalSkeleton />
                      </>
                    ) : profileFollowersUsers.length > 0 ? (
                      profileFollowersUsers.map((followerUser, i) => (
                        <FollowersDetail
                          key={i}
                          loggedInUser={userFirestore}
                          followerUser={followerUser}
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
