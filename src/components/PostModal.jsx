import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import { useRef, useState } from 'react';
import { useAddNewPostMutation, useEditPostMutation } from '../store/api';
import { LIMIT, TOAST_TYPE } from '../constants';
import { hasEqualProperties, showToast } from '../utils/utils';
import { FaImage, FaTimes } from 'react-icons/fa';
import { useMedia } from '../hooks';
import EmojiPopover from './EmojiPopover';
import GifPopover from './GifPopover';

const PostModal = ({
  isOpen,
  onClose,
  isAddingAndMainUserData = null,
  isEditingAndMainUserData = null,
}) => {
  const textareaRef = useRef(null);
  const toast = useToast();
  const { uploadMedia, isMediaUploading } = useMedia();
  const fileInputRef = useRef(null);

  const [addNewPost, { isLoading: isLoadingOnAdd }] = useAddNewPostMutation();
  const [editPost, { isLoading: isLoadingOnEdit }] = useEditPostMutation();

  const isSubmitting = isLoadingOnAdd || isLoadingOnEdit;

  const { firstName, lastName, pic } = isAddingAndMainUserData
    ? isAddingAndMainUserData
    : isEditingAndMainUserData.author;

  const postIdToUpdate = isEditingAndMainUserData?._id;
  const limitAsPerVerifiedStatus =
    isAddingAndMainUserData?.verified ||
    isEditingAndMainUserData?.author?.verified
      ? LIMIT.VERIFIED_CONTENT_LIMIT
      : LIMIT.CONTENT_LIMIT;

  const [inputs, setInputs] = useState(
    isEditingAndMainUserData
      ? {
          imageUrl: isEditingAndMainUserData.imageUrl,
          content: isEditingAndMainUserData.content,
        }
      : {
          imageUrl: '',
          content: '',
        }
  );

  let isPostNotToUpdate = false;
  if (isEditingAndMainUserData) {
    // if the state has similar properties to isEditingAndMainUserData or (there is no content and image at a single time on the screen), just close modal
    isPostNotToUpdate = hasEqualProperties({
      stateData: inputs,
      dataObj: isEditingAndMainUserData,
    });
  }

  const isContentOverLimit = inputs.content.length > limitAsPerVerifiedStatus;

  const handleContent = (e) =>
    setInputs({ ...inputs, content: e.target.value });

  const handleImageUrl = (url) => setInputs({ ...inputs, imageUrl: url });

  const handleEmojiClick = (emojiClicked) =>
    setInputs({ ...inputs, content: `${inputs.content}${emojiClicked}` });

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];

    await uploadMedia({
      media: file,
      updateMedia: handleImageUrl,
      toast,
    });

    e.target.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedContent = inputs.content.trim();

    if (!trimmedContent.length) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Please fill the post details',
      });
      return;
    }

    if (isPostNotToUpdate) {
      onClose();
      return;
    }

    // if user enables from devtools and try to submit with more content
    if (isContentOverLimit) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Content is over limit',
      });
      return;
    }

    try {
      let message = '';
      if (isAddingAndMainUserData) {
        const response = await addNewPost({
          ...inputs,
          content: trimmedContent,
        }).unwrap();
        message = response.message;
      }

      if (isEditingAndMainUserData) {
        const response = await editPost({
          ...inputs,
          content: trimmedContent,
          postIdToUpdate,
        }).unwrap();
        message = response.message;
      }

      showToast({ toast, type: TOAST_TYPE.Success, message });

      onClose();
    } catch (error) {
      console.log({ error: error.message });
      showToast({ toast, type: TOAST_TYPE.Error, message: error.message });
    }
  };

  return (
    <Modal
      initialFocusRef={textareaRef}
      closeOnOverlayClick={!isSubmitting}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(8px)' />
      <ModalContent w='90vw' maxW='550px'>
        <ModalHeader>
          {isAddingAndMainUserData ? 'New' : 'Edit'} Post
        </ModalHeader>

        <ModalCloseButton isDisabled={isSubmitting} />

        {/* form starts here */}
        <Box as='form' onSubmit={handleSubmit}>
          <ModalBody p={4} py='.75rem'>
            <Flex gap={'.5rem'} alignItems={{ md: 'flex-start' }}>
              <Avatar
                size='md'
                name={`${firstName} ${lastName}`}
                src={pic}
                cursor='pointer'
                mt={{ base: '.5rem' }}
              />

              <Textarea
                ref={textareaRef}
                letterSpacing={{ base: 'wider', md: 'widest' }}
                h='10rem'
                pl='.5rem'
                overflow={'auto'}
                _disabled={{ cursor: 'text' }}
                isDisabled={isSubmitting}
                resize='none'
                name='content'
                placeholder={`What's in your mind, ${firstName} ?`}
                value={inputs.content}
                onChange={handleContent}
                outline='none'
                border='none'
                focusBorderColor='transparent'
              />
            </Flex>

            {!!inputs.imageUrl && (
              <Container
                p='0'
                m='0'
                mt='1rem'
                pos='relative'
                w={{ base: '12rem', md: '15rem' }}
                borderRadius={'base'}
                overflow={'hidden'}
              >
                {!inputs.imageUrl.includes('.mp4') ? (
                  <Image
                    objectFit='cover'
                    w='full'
                    h='full'
                    bg={'#fff'}
                    src={inputs.imageUrl}
                    alt='post image'
                  />
                ) : (
                  <video controls src={inputs.imageUrl} />
                )}

                <IconButton
                  borderRadius={'50%'}
                  bg='red.400'
                  pos='absolute'
                  top='0'
                  right='0'
                  minW={{ base: '1.5rem', md: '2rem' }}
                  h={{ base: '1.5rem', md: '2rem' }}
                  color={'#fff'}
                  _hover={{ bg: 'red.600' }}
                  onClick={() => handleImageUrl('')}
                >
                  <Icon as={FaTimes} />
                </IconButton>
              </Container>
            )}
          </ModalBody>

          <ModalFooter pt='.5rem' borderTop='1px solid gray'>
            <Box
              as='div'
              display={'flex'}
              alignItems={'center'}
              flexWrap={'wrap'}
              w='full'
              gap={{ base: '.5rem .75rem', md: '2rem' }}
            >
              {/* image input */}
              <FormControl w='fit-content'>
                <IconButton
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                  fontSize={'1rem'}
                  bg='transparent'
                  _hover={{ bg: 'transparent' }}
                  isLoading={isMediaUploading}
                >
                  <Icon fontSize={'1.5rem'} as={FaImage} />
                </IconButton>

                <Input
                  ref={fileInputRef}
                  type='file'
                  display='none'
                  accept='.jpeg, .jpg, .png, video/mp4'
                  onChange={handleImageSelect}
                />
              </FormControl>
              {/* end of image input */}

              <EmojiPopover onEmojiClick={handleEmojiClick} />
              <GifPopover onGifClick={handleImageUrl} />

              <Spacer />
              <Text letterSpacing={'wide'}>
                <Box
                  as={'span'}
                  color={isContentOverLimit ? 'red.400' : 'inherit'}
                >
                  {inputs.content.length}
                </Box>{' '}
                / {limitAsPerVerifiedStatus}
              </Text>

              <Button
                borderRadius='2.5rem'
                bg='blue.400'
                colorScheme='blue'
                letterSpacing='widest'
                p='1rem 1.5rem'
                color='#fff'
                type='submit'
                m='auto'
                _loading={{ cursor: 'pointer' }}
                isLoading={isSubmitting}
                isDisabled={isContentOverLimit}
              >
                {!!isAddingAndMainUserData && 'Post'}
                {!!isEditingAndMainUserData && 'Update'}
              </Button>
            </Box>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
