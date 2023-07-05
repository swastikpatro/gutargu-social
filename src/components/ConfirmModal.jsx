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
} from '@chakra-ui/react';

// this will have delete post functionality, unfollow and log out user functionality
const ConfirmModal = ({
  isOpen,
  onClose,
  modalText,
  handleConfirmClick,
  isLoading,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!isLoading}
      isCentered
    >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(8px)' />
      <ModalContent w='90vw' maxW='400px'>
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
            onClick={async () => {
              await handleConfirmClick();
              onClose();
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
