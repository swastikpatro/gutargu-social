import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PostModal = ({ isOpen, onClose }: PostModalProps) => {
  return (
    <Modal
      isCentered
      closeOnOverlayClick={true}
      isOpen={isOpen}
      onClose={onClose}
    >
      <>
        <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(8px)' />
        <ModalContent>
          <ModalHeader>New Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>Hii</ModalBody>

          <ModalFooter>Post</ModalFooter>
        </ModalContent>
      </>
    </Modal>
  );
};

export default PostModal;
