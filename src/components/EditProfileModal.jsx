import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useToast,
} from '@chakra-ui/react';

//  from 'react
import { useState, useRef } from 'react';

// from internal folders
import { hasEqualProperties, showToast } from '../utils/utils';
import { TOAST_TYPE } from '../constants';
import ProfileImageEdit from './ProfileImageEdit';
import { useUpdateUserMutation } from '../store/api';

const EditProfileModal = ({ isOpen, onClose, mainUserInfo }) => {
  const initialRef = useRef(null);
  const toast = useToast();

  const { firstName, lastName, _id: mainUserId, pic, bio, link } = mainUserInfo;

  const initialState = {
    firstName,
    lastName,
    pic,
    bio,
    link: !link ? 'https://' : link,
  };

  const [userInfoInputs, setUserInfoInputs] = useState(initialState);

  const [updateUser, { isLoading: isUserUpdating }] = useUpdateUserMutation();

  const handleUserInputChange = (e) => {
    setUserInfoInputs({ ...userInfoInputs, [e.target.name]: e.target.value });
  };

  const handlePicChange = (urlLink) =>
    setUserInfoInputs({ ...userInfoInputs, pic: urlLink });

  const isNotToUpdate = hasEqualProperties({
    stateData: userInfoInputs,
    dataObj: mainUserInfo,
  });

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    const trimmedUserInputs = Object.keys(userInfoInputs).reduce(
      (acc, currKey) => {
        acc[currKey] = userInfoInputs[currKey].trim();
        return acc;
      },
      {}
    );

    if (!trimmedUserInputs.firstName) {
      showToast({
        type: TOAST_TYPE.Error,
        message: 'Please fill the first name',
        toast,
      });
      return;
    }

    if (isNotToUpdate) {
      onClose();
      return;
    }

    try {
      const { message } = await updateUser({
        mainUserId,
        ...trimmedUserInputs,
      }).unwrap();

      showToast({
        toast,
        type: TOAST_TYPE.Success,
        message,
      });

      onClose();
    } catch (error) {
      console.error(error.message);
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: error.message,
      });
    }
  };

  return (
    <Modal
      initialFocusRef={initialRef}
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!isUserUpdating}
    >
      <ModalOverlay bg='blackAlpha.300' backdropFilter='blur(8px)' />
      <ModalContent w='90vw' maxW='400px'>
        <ModalHeader>Edit Profile</ModalHeader>

        <ModalCloseButton />

        <Box as='form' onSubmit={handleUpdateUser}>
          <ModalBody pb={6}>
            <ProfileImageEdit
              handlePicChange={handlePicChange}
              activePic={userInfoInputs.pic}
              fullName={`${userInfoInputs.firstName} ${userInfoInputs.lastName}`}
            />

            <Box display={'flex'} alignItems={'center'} gap={'0 .5rem'}>
              <FormControl isRequired>
                <FormLabel>First name</FormLabel>
                <Input
                  autoComplete='off'
                  type='text'
                  ref={initialRef}
                  name='firstName'
                  onChange={handleUserInputChange}
                  placeholder='First name'
                  value={userInfoInputs.firstName}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Last name</FormLabel>
                <Input
                  autoComplete='off'
                  type='text'
                  name='lastName'
                  onChange={handleUserInputChange}
                  placeholder='Last name'
                  value={userInfoInputs.lastName}
                />
              </FormControl>
            </Box>

            <FormControl mt={4}>
              <FormLabel>Bio</FormLabel>
              <Input
                autoComplete='off'
                type='text'
                name='bio'
                onChange={handleUserInputChange}
                placeholder='Bio'
                value={userInfoInputs.bio}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Link</FormLabel>
              <Input
                autoComplete='off'
                type='url'
                name='link'
                pattern='https://.*'
                onChange={handleUserInputChange}
                placeholder='Website link'
                value={userInfoInputs.link}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter display={'flex'}>
            <Button onClick={onClose} isDisabled={isUserUpdating}>
              Cancel
            </Button>

            <Spacer />

            <Button
              colorScheme='blue'
              mr={3}
              isLoading={isUserUpdating}
              type='submit'
            >
              Update
            </Button>
          </ModalFooter>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default EditProfileModal;
