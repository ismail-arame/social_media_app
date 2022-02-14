import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

export default function Header({ username }) {
  return (
    // <div className="flex border-b border-gray-transparent h-4 p-4 py-8">
    <div className="flex h-4 p-4 py-8">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className=" flex items-center">
          <img
            src={`/images/avatars/${username}.jpg`}
            alt={`${username} profile`}
            className="flex rounded-full h-8 w-8 mr-3"
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
