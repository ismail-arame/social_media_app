import { useRef } from 'react';
import propTypes from 'prop-types';
import Header from './header';
import Image from './image';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';

export default function Post({ content, activeUserId }) {
  console.log(content);
  const commentInput = useRef(null);

  const handleFocus = () => {
    commentInput.current.focus();
    // commentInput.current.value = `@${content.username} `; //for reply Component (Important)
  };

  //Post Modal when user Clicks on the image (like instagram modal)
  return (
    <div className="rounded  border bg-white border-gray-transparent mb-6">
      <Header
        username={content.username}
        profileImageSrc={content.profileImageSrc}
      />
      <Image content={content} />
      <Actions
        photoDocId={content.docId}
        userLikedPhoto={content.userLikedPhoto}
        totalLikes={content.likes.length}
        handleFocus={handleFocus}
        activeUserId={activeUserId}
      />
      <Footer username={content.username} caption={content.caption} />
      <Comments
        photoDocId={content.docId}
        comments={content.comments}
        posted={content.dateCreated}
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
