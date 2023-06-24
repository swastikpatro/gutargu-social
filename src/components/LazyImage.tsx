import { useState, useEffect, useRef } from 'react';
import { Image } from '@chakra-ui/react';

const LazyImage = ({ src, alt }) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <Image
      objectFit='cover'
      w='full'
      h='full'
      ref={imgRef}
      src={isVisible ? src : ''}
      alt={alt}
    />
  );
};

export default LazyImage;
