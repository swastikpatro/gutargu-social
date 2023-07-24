import { useEffect } from 'react';

const useBlur = ({ searchRef, onClose }) => {
  const handleClick = (e) => {
    if (e.target !== searchRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);
};

export default useBlur;
