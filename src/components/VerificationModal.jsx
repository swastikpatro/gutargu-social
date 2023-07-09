import {
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import { perksOfVerified } from '../constants';

const VerificationModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Verification Success</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={'1rem'} fontWeight='semibold' color='green'>
            Congratulations, you're a verified user now 🎉🎊
          </Text>

          <Text mb='.75rem' fontWeight='semibold'>
            Perks of a verified user:{' '}
          </Text>

          <UnorderedList>
            {perksOfVerified.map((singlePerk, index) => (
              <ListItem key={index} mb='.75rem'>
                {singlePerk}
              </ListItem>
            ))}
          </UnorderedList>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VerificationModal;
