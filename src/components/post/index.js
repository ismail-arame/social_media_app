import { useRef } from 'react';
import propTypes from 'prop-types';
import Header from './header';
import Image from './image';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';

export default function Post({ content }) {
  const commentInput = useRef(null);

  const handleFocus = () => commentInput.current.focus();

  const {
    username,
    imageSrc,
    caption,
    docId,
    userLikedPhoto,
    likes,
    dateCreated,
    comments,
  } = content;

  return (
    <div className="rounded  border bg-white border-gray-transparent mb-6">
      <Header username={username} />
      <Image imageSrc={imageSrc} caption={caption} />
      <Actions
        photoDocId={docId}
        userLikedPhoto={userLikedPhoto}
        totalLikes={likes.length}
        handleFocus={handleFocus}
      />
      <Footer username={username} caption={caption} />
      <Comments
        photoDocId={docId}
        comments={comments}
        posted={dateCreated}
        commentInput={commentInput}
      />
    </div>
  );
}

Post.prototype = {
  content: propTypes.shape({
    username: propTypes.string.isRequired,
    caption: propTypes.string.isRequired,
    docId: propTypes.string.isRequired,
    imageSrc: propTypes.string.isRequired,
    userId: propTypes.string.isRequired,
    // photoId: propTypes.number.isRequired,
    dateCreated: propTypes.number.isRequired,
    userLikedPhoto: propTypes.bool.isRequired,
    comments: propTypes.array.isRequired,
    likes: propTypes.array.isRequired,
  }),
};
