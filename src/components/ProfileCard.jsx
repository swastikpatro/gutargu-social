import {
  Avatar,
  Box,
  Button,
  Spacer,
  Text,
  useColorModeValue,
  IconButton,
  Icon,
  Badge,
  Link as ChakraLink,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { HiOutlineLogout } from 'react-icons/hi';
import { FaCalendarAlt, FaEdit } from 'react-icons/fa';

import { Link } from 'react-router-dom';

import { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

// internal imports
import {
  getFollowCacheKey,
  getFormattedDate,
  showToast,
  wait,
} from '../utils/utils';
import { MODAL_TEXT_TYPE, TOAST_TYPE } from '../constants';

import ListPopover from './ListPopover';
import ConfirmModal from './ConfirmModal';
import EditProfileModal from './EditProfileModal';

import { useFollowUserMutation, useUnfollowUserMutation } from '../store/api';
import { removeUserCredentials, updateLogOutStatus } from '../store/authSlice';

const ProfileCard = ({ singleUserDetails, isUserDetailsFetching }) => {
  const followButtonStyle = {
    bg: useColorModeValue('#222', '#fff'),
    color: useColorModeValue('#fff', '#222'),
    _hover: {
      bg: useColorModeValue('gray.600', 'gray.300'),
    },
  };

  const mainUserId = useSelector((store) => store.auth.mainUserId);
  const dispatch = useDispatch();

  const [followUser, { isLoading: isFollowUserLoading }] =
    useFollowUserMutation({
      fixedCacheKey: getFollowCacheKey(singleUserDetails._id),
    });

  const [unfollowUser, { isLoading: isUnfollowUserLoading }] =
    useUnfollowUserMutation();
  const [isLoggingOutLoading, setIsLoggingOutLoading] = useState(false);

  const toast = useToast();
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();

  const {
    isOpen: isEditProfileModalOpen,
    onOpen: onEditProfileModalOpen,
    onClose: onEditProfileModalClose,
  } = useDisclosure();

  const {
    _id: singleUserId,
    firstName,
    lastName,
    username,
    pic,
    bio,
    link,
    followers,
    following,
    createdAt,
  } = singleUserDetails;

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

  const handleFollow = async () => {
    try {
      const { message } = await followUser({
        followId: singleUserId,
        mainUserId,
      }).unwrap();
      showToast({ toast, type: TOAST_TYPE.Success, message });
    } catch (error) {
      console.error(error.message);
      showToast({ toast, type: TOAST_TYPE.Error, message: error.message });
    }
  };

  const handleUnfollow = async () => {
    try {
      const { message } = await unfollowUser({
        unfollowId: singleUserId,
        mainUserId,
      }).unwrap();
      showToast({ toast, type: TOAST_TYPE.Success, message });
    } catch (error) {
      console.error(error.message);
    }
  };

  const followButtonJSX = (
    <>
      {isConfirmModalOpen && singleUserDetails?.isMainUserFollowing && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={onConfirmModalClose}
          modalText={MODAL_TEXT_TYPE.UNFOLLOW}
          isLoading={isUnfollowUserLoading}
          handleConfirmClick={handleUnfollow}
        />
      )}

      <Button
        {...followButtonStyle}
        borderRadius='full'
        letterSpacing='wider'
        onClick={
          singleUserDetails?.isMainUserFollowing
            ? onConfirmModalOpen
            : handleFollow
        }
        isLoading={isFollowUserLoading}
        _loading={{ cursor: 'pointer' }}
      >
        {singleUserDetails?.isMainUserFollowing ? 'Unfollow' : 'Follow'}
      </Button>
    </>
  );

  const editAndLogOutButtonJSX = (
    <>
      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={onConfirmModalClose}
          modalText={MODAL_TEXT_TYPE.LOGOUT}
          isLoading={isLoggingOutLoading}
          handleConfirmClick={handleLogOut}
        />
      )}

      {isEditProfileModalOpen && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={onEditProfileModalClose}
          mainUserInfo={singleUserDetails}
        />
      )}

      <IconButton
        aria-label='logout button'
        onClick={onConfirmModalOpen}
        sx={followButtonStyle}
        borderRadius={'50%'}
      >
        <Icon fontSize={'1.25rem'} as={HiOutlineLogout} />
      </IconButton>

      <IconButton
        aria-label='edit profile button'
        onClick={onEditProfileModalOpen}
        sx={followButtonStyle}
        borderRadius={'50%'}
        isDisabled={isUserDetailsFetching}
      >
        <Icon fontSize={'1.25rem'} as={FaEdit} />
      </IconButton>
    </>
  );

  return (
    <Box w='100%' as='section' p='1rem .5rem' mb='1rem'>
      <Box
        as='article'
        display='flex'
        gap='.5rem'
        mb='1rem'
        flexWrap={'wrap'}
        alignItems='center'
        letterSpacing={'wider'}
      >
        <Avatar
          size={{ base: 'md', md: 'lg' }}
          name={`${firstName} ${lastName}`}
          src={pic}
        />
        <Box as='div'>
          <Text fontWeight='semibold'>
            {firstName} {lastName}
          </Text>
          <Text
            fontSize={{ base: '.75rem', md: '.9rem' }}
            letterSpacing='widest'
            fontStyle={'italic'}
          >
            @{username}
          </Text>

          {singleUserDetails?.isFollowingMainUser && (
            <Badge colorScheme='#222' variant={'solid'}>
              Follows you
            </Badge>
          )}
        </Box>

        <Spacer />

        {singleUserDetails._id === mainUserId
          ? editAndLogOutButtonJSX
          : followButtonJSX}
      </Box>

      {!!bio && (
        <Text mb='.75rem' letterSpacing={{ xl: 'wider' }}>
          {bio}
        </Text>
      )}

      {!!link && (
        <ChakraLink
          fontWeight={'semibold'}
          letterSpacing='wider'
          as={Link}
          to={link}
          target='_blank'
        >
          {link}
        </ChakraLink>
      )}

      <Box
        mt='.75rem'
        as='div'
        display={'flex'}
        gap={'.5rem 1rem'}
        flexWrap={'wrap'}
      >
        <ListPopover
          usersList={followers}
          type={`follower${followers.length === 1 ? '' : 's'}`}
        />
        <ListPopover usersList={following} type='following' />
        <Text
          letterSpacing='wider'
          display={'flex'}
          alignItems={'center'}
          gap='0 .35rem'
        >
          <Icon as={FaCalendarAlt} /> Joined {getFormattedDate(createdAt)}
        </Text>
      </Box>
    </Box>
  );
};

export default ProfileCard;
