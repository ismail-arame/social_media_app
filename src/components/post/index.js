import { useRef } from 'react';
import propTypes from 'prop-types';
import Header from './header';
import Image from './image';

export default function Post({ content }) {
  const { username, imageSrc, caption } = content;

  return (
    <div className="rounded  border bg-white border-gray-transparent mb-6">
      <Header username={username} />
      <Image imageSrc={imageSrc} caption={caption} />
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
