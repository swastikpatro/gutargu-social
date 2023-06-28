import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useDeletePostMutation } from '../store/api';
import { showToast, wait } from '../utils/utils';
import { removeUserCredentials, updateLogOutStatus } from '../store/authSlice';
import { TOAST_TYPE } from '../constants';
import { useDispatch } from 'react-redux';

// this will have delete post functionality and log out user functionality
const ConfirmModal = ({
  isOpen,
  onClose,
  modalText,
  isDeletingPostAndPostId,
  isUserLoggingOut,
}) => {
  const toast = useToast();

  const [deletePost, { isLoading: isPostDeleting }] = useDeletePostMutation();
  const [isLoggingOutLoading, setIsLoggingOutLoading] = useState(false);

  const isLoading = isPostDeleting || isLoggingOutLoading;

  const dispatch = useDispatch();

  const toggleIsLoggingOutLoading = () =>
    setIsLoggingOutLoading(!isLoggingOutLoading);

  const handleLogOut = async () => {
    toggleIsLoggingOutLoading();
    await wait();
    toggleIsLoggingOutLoading();

    dispatch(removeUserCredentials());
    dispatch(updateLogOutStatus());
    showToast({
      toast,
      type: TOAST_TYPE.Success,
      message: 'Logged out successfully',
    });
  };

  const handleDeletePost = async () => {
    try {
      const { message } = await deletePost({
        postIdToDelete: isDeletingPostAndPostId,
      }).unwrap();

      showToast({ toast, type: TOAST_TYPE.Success, message });
      onClose();
    } catch (error) {
      console.log({ error: error.message });
      showToast({ toast, type: TOAST_TYPE.Error, message: error.message });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!isLoading}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textTransform={'capitalize'}>{modalText}</ModalHeader>
        <ModalCloseButton isDisabled={isLoading} />
        <ModalBody>
          <Text>Are you sure you want to {modalText}?</Text>
        </ModalBody>

        <ModalFooter
          mt='1rem'
          display={'flex'}
          justifyContent={'space-between'}
        >
          <Button
            colorScheme='blue'
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            variant='ghost'
            bg={'red.500'}
            _hover={{ bg: 'red.600' }}
            color='#fff'
            isLoading={isLoading}
            onClick={() => {
              isUserLoggingOut && handleLogOut();
              isDeletingPostAndPostId && handleDeletePost();
            }}
            textTransform={'capitalize'}
          >
            {modalText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmModal;
