import React from 'react';

interface ImageComponentProps {
  imageUrl: string;
}

const ImageComponent: React.FC<ImageComponentProps> = ({ imageUrl }) => {
  return (
      <img src={imageUrl} alt="Image" style={{ width: '300px', height: '300px' }}  />
  );
};

export default ImageComponent;
