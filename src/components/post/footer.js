import propTypes from 'prop-types';

export default function Footer({ caption, username }) {
  return (
    <div className=" p-4 pt-2 pb-0 ">
      <span className="font-semibold mr-1 text-sm">{username}</span>
      <span className="text-sm text-black-light">{caption}</span>
    </div>
  );
}

Footer.propTypes = {
  caption: propTypes.string.isRequired,
  username: propTypes.string.isRequired,
};
