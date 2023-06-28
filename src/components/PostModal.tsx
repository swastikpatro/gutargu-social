import {
  Avatar,
  Button,
  Flex,
  FormControl,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Textarea,
  useToast,
} from '@chakra-ui/react';

import { useRef, useState } from 'react';
import { useAddNewPostMutation, useEditPostMutation } from '../store/api';
import { TOAST_TYPE } from '../constants';
import { hasEqualProperties, showToast } from '../utils/utils';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  // isAddingAndMainUserData:
}

const PostModal = ({
  isOpen,
  onClose,
  isAddingAndMainUserData = null,
  isEditingAndMainUserData = null,
}) => {
  const textareaRef = useRef(null);
  const toast = useToast();

  const [addNewPost, { isLoading: isLoadingOnAdd }] = useAddNewPostMutation();
  const [editPost, { isLoading: isLoadingOnEdit }] = useEditPostMutation();

  const isSubmitting = isLoadingOnAdd || isLoadingOnEdit;

  const { firstName, lastName, pic } = !!isAddingAndMainUserData
    ? isAddingAndMainUserData
    : isEditingAndMainUserData?.author;

  const postIdToUpdate = isEditingAndMainUserData?._id;

  const [inputs, setInputs] = useState(
    !!isEditingAndMainUserData
      ? {
          imageUrl: isEditingAndMainUserData.imageUrl,
          content: isEditingAndMainUserData.content,
        }
      : {
          imageUrl: '',
          content: '',
        }
  );

  let isPostButtonDisable = !inputs.content && !inputs.imageUrl;
  if (!!isEditingAndMainUserData) {
    // if the state has similar properties to isEditingAndMainUserData or (there is no content and image at a single time on the screen), during this post btn is disabled.
    isPostButtonDisable =
      hasEqualProperties({
        stateData: inputs,
        dataObj: isEditingAndMainUserData,
      }) || isPostButtonDisable;
  }

  const handleInputs = (e) => {
    const targetElement = e.target;
    const targetName = e.target.name;
    if (targetName === 'content') {
      setInputs({ ...inputs, [targetName]: targetElement.value });
    }
  };

  const handleSubmit = async () => {
    if (inputs.content.trim().length < 1) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Please fill the post details',
      });
      return;
    }
    try {
      let message = '';
      if (!!isAddingAndMainUserData) {
        const response = await addNewPost(inputs).unwrap();
        message = response.message;
      }

      if (!!isEditingAndMainUserData) {
        console.log({ postIdToUpdate });
        const response = await editPost({ ...inputs, postIdToUpdate }).unwrap();
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
      isCentered
      closeOnOverlayClick={!isSubmitting}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(8px)' />
      <ModalContent>
        <ModalHeader>
          {!!isAddingAndMainUserData ? 'New' : 'Edit'} Post
        </ModalHeader>

        <ModalCloseButton isDisabled={isSubmitting} />

        <ModalBody p={4} py='.75rem'>
          <Flex gap={'.5rem'} alignItems={{ md: 'flex-start' }}>
            <Avatar
              size={{ base: 'sm', md: 'md' }}
              name={`${firstName} ${lastName}`}
              src={pic}
              cursor='pointer'
              mt={{ base: '.5rem' }}
            />

            <Textarea
              ref={textareaRef}
              h='10rem'
              pl='.5rem'
              overflow={'auto'}
              name='content'
              placeholder={`What's in your mind, ${firstName} ?`}
              isDisabled={false}
              value={inputs.content}
              onChange={handleInputs}
              outline='none'
              border='none'
              resize='none'
              focusBorderColor='transparent'
            />
          </Flex>
        </ModalBody>

        <ModalFooter pt='.5rem' borderTop='1px solid gray'>
          <Flex alignItems={'center'} w='full' gap='1rem'>
            {/* <IconButton fontSize={'1rem'}>
              <Icon as={BsFillEmojiSmileFill} />
            </IconButton>

            <InputGroup>
              <Input
                type='file'
                id='profile_pic'
                name='profile_pic'
                accept='.jpg, .jpeg, .png, .mp4'
              />
              <InputLeftElement pointerEvents='pointer'>
                <Icon as={FaImage} />
              </InputLeftElement>
            </InputGroup> */}
            <Spacer />

            <Button
              borderRadius='2.5rem'
              bg='blue.400'
              colorScheme='blue'
              letterSpacing='widest'
              p='1rem 1.5rem'
              color='#fff'
              onClick={handleSubmit}
              _loading={{ cursor: 'pointer' }}
              isLoading={isSubmitting}
              isDisabled={isPostButtonDisable}
            >
              {!!isAddingAndMainUserData && 'Post'}
              {!!isEditingAndMainUserData && 'Update'}
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PostModal;
