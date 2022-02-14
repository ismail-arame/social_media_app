import { memo } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

//showing nice layout of Skeleton when username and fullName are not defined
const User = ({ username, fullName }) => {
  // #EFEFEF   ==>  baseColor
  // #FAFAFA   ==>  highlightColor
  console.log('i am rendered || User');
  return !username || !fullName ? (
    <div className="grid grid-cols-4 gap-4  mb-12 items-center">
      <div className=" flex justify-between items-center col-span-1">
        <Skeleton count={1} height={61} width={61} circle="true" />
      </div>
      <div className=" col-span-3">
        <SkeletonTheme baseColor="#f1f3f5" highlightColor="#f8f9fa">
          <p>
            <Skeleton count={2} height={20} className=" mb-0.5" />
          </p>
        </SkeletonTheme>
      </div>
    </div>
  ) : (
    <Link
      to={`/p/${username}`}
      className="grid grid-cols-4 gap-4 mb-6 items-center"
    >
      <div className=" flex justify-between items-center col-span-1">
        <img
          src={`/images/avatars/${username}.jpg`}
          alt={`${username} profile`}
          className=" rounded-full w-32 flex mr-3 "
        />
      </div>
      <div className=" col-span-3 ">
        <p className="text-md text-black-light font-bold">{username}</p>
        <p className=" text-sm text-gray-light">{fullName}</p>
      </div>
    </Link>
  );
};

//saving re renders with memo because we're passing the same props to User component
export default memo(User);

//PropTypes are a mechanism to ensure that components use the correct data type and pass the right data, and that components use the right type of props, and that receiving components receive the right type of props.17 août 2020
User.propTypes = {
  username: propTypes.string,
  fullName: propTypes.string,
};

//to Track Functional components
// User.whyDidYouRender = true;
