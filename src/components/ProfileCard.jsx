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
  Popper,
  getFollowCacheKey,
  getFormattedDate,
  showToast,
  wait,
} from '../utils/utils';
import {
  MODAL_TEXT_TYPE,
  TOAST_TYPE,
  logo,
  verificationAmountRs,
} from '../constants';

import ListPopover from './ListPopover';
import ConfirmModal from './ConfirmModal';
import EditProfileModal from './EditProfileModal';

import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUpdateUserMutation,
} from '../store/api';
import { removeUserCredentials, updateLogOutStatus } from '../store/authSlice';
import PageLoader from './PageLoader';
import VerificationModal from './VerificationModal';

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

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

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
    isOpen: isVerificationModalOpen,
    onOpen: onVerificationModalOpen,
    onClose: onVerificationModalClose,
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
    verified,
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

  const loadScript = async (url) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = url;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    try {
      const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js'
      );

      if (!res) {
        showToast({
          toast,
          type: TOAST_TYPE.Error,
          message: 'Razorpay SDK failed to load, check you connection',
        });
        return;
      }

      const options = {
        key: import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID,
        amount: verificationAmountRs * 100,
        currency: 'INR',
        name: 'Gutargu',
        description: 'Get verified',
        image: logo,

        handler: async (response) => {
          const tempObj = {
            amount: verificationAmountRs,
            paymentId: response.razorpay_payment_id,
          };

          await updateUser({
            mainUserId,
            verified: true,
          }).unwrap();

          onVerificationModalOpen();

          Popper();

          showToast({
            toast,
            type: TOAST_TYPE.Success,
            message: 'Payment Successful',
          });
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          // email: email,
          contact: '9082931945',
        },
        theme: {
          color: 'blue',
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log(error);
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
      {isUpdating && <PageLoader />}
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
          <Text
            fontWeight='semibold'
            display={'flex'}
            alignItems={'center'}
            gap={'.15rem'}
          >
            {firstName} {lastName}{' '}
            {verified && (
              <Box as='span'>
                <Box
                  h='1rem'
                  fill='blue.400'
                  as='svg'
                  viewBox='0 0 22 22'
                  aria-label='Verified account'
                  role='img'
                  className='r-1cvl2hr r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr'
                  data-testid='icon-verified'
                >
                  <g>
                    <path d='M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z'></path>
                  </g>
                </Box>
              </Box>
            )}
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

        {isVerificationModalOpen && (
          <VerificationModal
            isOpen={isVerificationModalOpen}
            onClose={onVerificationModalClose}
          />
        )}

        {singleUserDetails._id === mainUserId && !verified && (
          <Button mt='.5rem' colorScheme='blue' onClick={displayRazorpay}>
            Get Verified
          </Button>
        )}

        {/* only on local */}
        {singleUserDetails._id === mainUserId && verified && (
          <Button
            onClick={async () => {
              await updateUser({
                mainUserId,
                verified: false,
              }).unwrap();
            }}
          >
            Click
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProfileCard;
