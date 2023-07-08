import {
  Avatar,
  Box,
  FormControl,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverTrigger,
  Spinner,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { useRef } from 'react';

import { FaCamera, FaUpload, FaUserCircle } from 'react-icons/fa';

// internals
import { useMedia } from '../hooks';
import AvatarListPopover from './AvatarListPopover';

const ProfileImageEdit = ({ handlePicChange, activePic, fullName }) => {
  const toast = useToast();
  const fileInputRef = useRef();

  const { uploadMedia, isMediaUploading } = useMedia();

  const {
    isOpen: isImageMenuOpen,
    onOpen: onImageMenuOpen,
    onClose: onImageMenuClose,
  } = useDisclosure();

  const {
    isOpen: isAvatarPopOpen,
    onOpen: onAvatarPopOpen,
    onClose: onAvatarPopClose,
  } = useDisclosure();

  const menuBtnToggle = () => {
    if (isImageMenuOpen) {
      onImageMenuClose();
      return;
    }

    if (isAvatarPopOpen) {
      onAvatarPopClose();
    }

    onImageMenuOpen();
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];

    await uploadMedia({
      media: file,
      updateMedia: handlePicChange,
      toast,
    });

    e.target.value = null;
  };

  const userAvatarEditJSX = (
    <>
      <Avatar
        size='lg'
        name={fullName}
        src={activePic}
        opacity={isMediaUploading ? '.5' : 1}
        mb='1rem'
      />
      {isMediaUploading && (
        <Spinner pos='absolute' top='1.5rem' left='1.5rem' size='sm' />
      )}
    </>
  );

  return (
    <Box as='div' pos='relative' w='fit-content'>
      {userAvatarEditJSX}

      <Menu isOpen={isImageMenuOpen} isLazy placement='right-end'>
        <MenuButton
          pos='absolute'
          bottom='0'
          right='-1.5rem'
          variant='ghost'
          colorScheme='gray'
          borderRadius='50%'
          aria-label='Options'
          as={IconButton}
          icon={<FaCamera />}
          onClick={menuBtnToggle}
        />
        {isImageMenuOpen && (
          <MenuList minW='10rem' p='0' boxShadow='xl' zIndex={11}>
            <Popover
              placement='bottom'
              isLazy
              isOpen={isAvatarPopOpen}
              closeOnBlur={true}
            >
              <PopoverTrigger>
                <MenuItem
                  p='1rem'
                  fontSize={'1rem'}
                  icon={<FaUserCircle fontSize={'1.15rem'} />}
                  onClick={isAvatarPopOpen ? onAvatarPopClose : onAvatarPopOpen}
                >
                  Choose Avatar
                </MenuItem>
              </PopoverTrigger>

              {isAvatarPopOpen && (
                <AvatarListPopover
                  handlePicChange={handlePicChange}
                  activePic={activePic}
                  onAvatarPopClose={onAvatarPopClose}
                  onImageMenuClose={onImageMenuClose}
                  menuBtnToggle={menuBtnToggle}
                />
              )}
            </Popover>

            <FormControl>
              <MenuItem
                icon={<FaUpload fontSize={'1.15rem'} />}
                onClick={() => {
                  fileInputRef.current.click();
                  isAvatarPopOpen && onAvatarPopClose();
                }}
                p='1rem'
                fontSize={'1rem'}
              >
                Upload
              </MenuItem>

              <Input
                ref={fileInputRef}
                type='file'
                display='none'
                accept='.jpeg, .jpg, .png'
                onChange={async (e) => {
                  onImageMenuClose();
                  await handleImageSelect(e);
                }}
              />
            </FormControl>
          </MenuList>
        )}
      </Menu>
    </Box>
  );
};

export default ProfileImageEdit;
