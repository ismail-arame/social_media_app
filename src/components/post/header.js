import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

export default function Header({ username, profileImageSrc }) {
  return (
    // <div className="flex border-b border-gray-transparent h-4 p-4 py-8">
    <div className="flex h-4 p-4 py-8">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className=" flex items-center">
          <img
            src={profileImageSrc}
            alt={`${username} profile`}
            className="flex rounded-full h-8 w-8 mr-3 object-cover"
            onError={e => {
              e.target.src = '/images/avatars/default.png';
            }}
          />
          <p className="font-semibold text-sm">{username}</p>
        </Link>
      </div>
    </div>
  );
}

Header.propTypes = {
  username: propTypes.string.isRequired,
};
