import {
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';

import { FaRegSmile } from 'react-icons/fa';

import EmojiPicker from 'emoji-picker-react';

const EmojiPopover = ({ onEmojiClick }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const colorModeValue = useColorModeValue('light', 'dark');
  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose} closeOnBlur={true}>
      <PopoverTrigger>
        <IconButton
          onClick={onOpen}
          fontSize={'1.25rem'}
          bg='transparent'
          _hover={{ bg: 'transparent' }}
        >
          <Icon as={FaRegSmile} />
        </IconButton>
      </PopoverTrigger>

      {isOpen && (
        <PopoverContent w='90vw' maxW='300px'>
          <PopoverArrow />
          <EmojiPicker
            onEmojiClick={({ emoji }) => {
              onEmojiClick(emoji);
              onClose();
            }}
            theme={colorModeValue}
            emojiStyle='native'
            emojiVersion='1.0'
            searchDisabled
            lazyLoadEmojis
            skinTonesDisabled
            suggestedEmojisMode='recent'
            previewConfig={{
              showPreview: false,
            }}
            width={'100%'}
            height='240px'
          />
        </PopoverContent>
      )}
    </Popover>
  );
};

export default EmojiPopover;
