import { useState } from 'react';
import propTypes from 'prop-types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useDispatch } from 'react-redux';
import {
  setPostModalOpen,
  setPostModalContent,
} from '../../redux/post-modal/post-modal.actions';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';

export default function Image({ content }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const match = useRouteMatch();

  const [isLazyLoading, setLazyLoading] = useState(false);
  return (
    <Link
      to={{
        pathname: `/post/${content.docId}`,
        //we store the Previous Location in the background
        state: { background: location },
      }}
    >
      <div
        className={`h-[650px] w-full transition-colors ${
          isLazyLoading ? 'bg-gray-lazy animate-pulse-faster' : ''
        }`}
      >
        <LazyLoadImage
          onClick={() => {
            dispatch(setPostModalOpen());
            //once we click on the post Image we get all the Info about that specific POST to show it more in detail in the PostModal Component
            dispatch(setPostModalContent(content));
          }}
          src={content.imageSrc}
          alt="post"
          className=" object-cover h-full w-full bg-gray-base z-20 cursor-pointer"
          width="100%"
          height="100%"
          effect="blur"
          threshold={500}
          beforeLoad={() => setLazyLoading(true)}
          afterLoad={() => setLazyLoading(false)}
        />
      </div>
    </Link>
  );
}

Image.propTypes = {
  content: propTypes.shape({
    username: propTypes.string.isRequired,
    caption: propTypes.string.isRequired,
    docId: propTypes.string.isRequired,
    imageSrc: propTypes.string.isRequired,
    userId: propTypes.string.isRequired,
    dateCreated: propTypes.number.isRequired,
    userLikedPhoto: propTypes.bool.isRequired,
    comments: propTypes.array.isRequired,
    likes: propTypes.array.isRequired,
  }),
};
// <img src={imageSrc} alt="post" className=" object-cover h-full w-full" />
