import { useState } from 'react';

const TiltedCard = ({
  imageSrc,
  altText,
  captionText,
  containerHeight = "300px",
  containerWidth = "300px",
  imageHeight = "300px",
  imageWidth = "300px",
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
  showMobileWarning = false,
  showTooltip = false,
  displayOverlayContent = false,
  overlayContent
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
        style={{
          height: containerHeight,
          width: containerWidth,
          transform: isHovered ? `scale(${scaleOnHover}) rotate(${Math.random() * rotateAmplitude - rotateAmplitude/2}deg)` : 'scale(1) rotate(0deg)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="object-cover w-full h-full"
          style={{
            height: imageHeight,
            width: imageWidth
          }}
        />
        
        {displayOverlayContent && (
          <div className={`absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="text-white text-center">
              {overlayContent}
            </div>
          </div>
        )}
      </div>
      
      <p className="mt-4 text-center font-medium text-gray-900">{captionText}</p>
    </div>
  );
};

export default TiltedCard;