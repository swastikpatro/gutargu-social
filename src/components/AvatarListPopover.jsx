import {
  Avatar,
  Box,
  Button,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
} from '@chakra-ui/react';

import { useState } from 'react';

import { avatarsList } from '../constants';

const AvatarListPopover = ({
  handlePicChange,
  activePic,
  onAvatarPopClose,
  onImageMenuClose,
  menuBtnToggle,
}) => {
  // is any avatar is set as image place holder inside the edit modal
  const avatarIfSet = avatarsList.find((avatar) => avatar === activePic);
  const [activeAvatar, setActiveAvatar] = useState(avatarIfSet);

  return (
    <PopoverContent zIndex={12}>
      <PopoverHeader fontWeight='semibold'>Choose</PopoverHeader>

      <PopoverArrow />

      <PopoverCloseButton
        onClick={() => {
          onAvatarPopClose();

          if (avatarIfSet) {
            onImageMenuClose();
          }
        }}
      />

      <PopoverBody p='.75rem' boxShadow={'lg'}>
        <Box
          display={'grid'}
          gridTemplateColumns={'repeat(4, 1fr)'}
          gap={'1rem'}
          mb='1rem'
        >
          {avatarsList.map((avatarImg, index) => (
            <Avatar
              {...(activeAvatar === avatarImg && {
                border: '2px solid #1d9bf0',
                p: '.1rem',
              })}
              cursor='pointer'
              size='md'
              key={index}
              src={avatarImg}
              onClick={() => setActiveAvatar(avatarImg)}
            />
          ))}
        </Box>

        <Button
          display={'block'}
          colorScheme='blue'
          m='auto'
          onClick={() => {
            handlePicChange(activeAvatar);
            menuBtnToggle();
          }}
        >
          Done
        </Button>
      </PopoverBody>
    </PopoverContent>
  );
};

export default AvatarListPopover;
