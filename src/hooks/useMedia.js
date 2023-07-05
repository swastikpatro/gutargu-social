import { useState } from 'react';
import { TOAST_TYPE } from '../constants';
import { showToast } from '../utils/utils';

const useMedia = () => {
  const [isMediaUploading, setIsMediaUploading] = useState(false);

  const uploadMedia = async ({ media, updateMedia, toast }) => {
    const mediaType = media.type.split('/')[0];
    if (mediaType === 'video' && Math.round(media.size / 1024000) > 10) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Video size should be less than 10MB',
      });
      return;
    }

    if (Math.round(media.size / 1024000) > 4) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Video size should be less than 10MB',
      });
      return;
    }

    const data = new FormData();
    data.append('file', media);
    data.append('upload_preset', import.meta.env.VITE_REACT_UPLOAD_PRESET);
    data.append('cloud_name', import.meta.env.VITE_REACT_CLOUD_NAME);
    data.append('folder', 'Gutargu-social');

    const url =
      mediaType === 'video'
        ? `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_REACT_UPLOAD_PRESET
          }/video/upload`
        : `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_REACT_CLOUD_NAME
          }/image/upload`;

    setIsMediaUploading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: data,
      });

      const { url: cloudinaryURL } = await response.json();

      updateMedia(cloudinaryURL);
    } catch (error) {
      console.log(error);
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Media Uploading failed',
      });
    } finally {
      setIsMediaUploading(false);
    }
  };
  return { uploadMedia, isMediaUploading };
};

export default useMedia;
