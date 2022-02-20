import propTypes from 'prop-types';

export default function Image({ imageSrc, caption }) {
  return <img src={imageSrc} alt="post" className=" h-[777px] w-full" />;
}

Image.propTypes = {
  imageSrc: propTypes.string.isRequired,
  caption: propTypes.string.isRequired,
};
