import { useState, useEffect, useRef } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { selectListOfProfilePhotos } from '../../redux/profile-photos/profile-photos.selectors';
import { setListOfProfilePhotos } from '../../redux/profile-photos/profile-photos.actions';
import { getUserPhotosByUserId } from '../../services/firebase';

export default function InputSearchCardlist({
  users, //filterd users
  searchedUserQuery,
  loading,
  setClickedOutsideCardlist,
}) {
  const dispatch = useDispatch();
  const listOfProfilePhotos = useSelector(
    selectListOfProfilePhotos,
    shallowEqual
  );

  const [isLazyLoading, setLazyLoading] = useState(false);
  const wrapperRef = useRef(null); //Cardlist Ref

  //detecting when the user clicks outside the card list wrapper
  useEffect(() => {
    const handleClickOutsideWrapper = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setClickedOutsideCardlist(true); //clicked outside cardlist wrapper
      }
    };

    document.addEventListener('mousedown', handleClickOutsideWrapper);

    //Component Will Unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideWrapper);
    };
  }, [wrapperRef, setClickedOutsideCardlist]);

  console.log('loading', loading);
  return (
    <div
      className="absolute top-[64px] right-1/2 translate-x-[50%] w-[375px] h-[362px] bg-white shadow-[0_0_5px_1px_rgba(0,0,0,0.05)] rounded-md overflow-x-hidden z-30"
      ref={wrapperRef}
    >
      <div className="h-full w-full">
        {searchedUserQuery === '' ? (
          <div className="flex h-full w-full items-center justify-center text-black-light font-medium">
            <span>Search For Users</span>
          </div>
        ) : loading ? (
          <div className="flex h-full w-full items-center justify-center text-black-light font-medium">
            <svg
              role="status"
              className="inline w-6 h-6 text-[#343a40] animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          </div>
        ) : users?.length > 0 ? (
          <div className="flex flex-col pt-2.5">
            {users.map((user, i) => (
              <div key={i}>
                <Link
                  to={`/p/${user.username}`}
                  onClick={async () => {
                    setClickedOutsideCardlist(true);
                    const photos = await getUserPhotosByUserId(user.userId);
                    dispatch(setListOfProfilePhotos(photos));
                  }}
                >
                  <div className="flex items-center hover:bg-gray-searchHover transition-colors p-[6.5px] px-3">
                    <div
                      className={`rounded-full w-12 h-12 mr-3 transition-colors  ${
                        isLazyLoading
                          ? 'bg-gray-lazy2 animate-pulse-faster'
                          : ''
                      }`}
                    >
                      <LazyLoadImage
                        width="100%"
                        height="100%"
                        effect="opacity"
                        src={user.profileImageSrc}
                        alt="user profile"
                        className="rounded-full w-full h-full flex object-cover border border-gray-transparent"
                        beforeLoad={() => setLazyLoading(true)}
                        afterLoad={() => setLazyLoading(false)}
                        onError={e => {
                          e.target.src = '/images/avatars/default.png';
                        }}
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className=" font-semibold text-sm text-black-light">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-light">{user.fullName}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-black-light font-medium">
            <span>No User Found</span>
          </div>
        )}
      </div>
    </div>
  );
}
