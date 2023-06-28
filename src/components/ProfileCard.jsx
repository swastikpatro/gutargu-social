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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { getCreatedDate } from '../utils/utils';
import { MODAL_TEXT_TYPE } from '../constants';
import { HiOutlineLogout } from 'react-icons/hi';
import { FaCalendarAlt } from 'react-icons/fa';
import ListPopover from './ListPopover';
import ConfirmModal from './ConfirmModal';
import { useSelector } from 'react-redux';

const ProfileCard = ({ singleUserDetails }) => {
  const followButtonStyle = {
    bg: useColorModeValue('#222', '#fff'),
    color: useColorModeValue('#fff', '#222'),
    _hover: {
      bg: useColorModeValue('gray.600', 'gray.300'),
    },
  };
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();

  const {
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

  const followButtonJSX = (
    <Button
      {...followButtonStyle}
      borderRadius='full'
      letterSpacing='wider'
      // isLoading
    >
      {singleUserDetails?.isMainUserInFollowersList ? 'Unfollow' : 'Follow'}
    </Button>
  );

  const editAndLogOutButtonJSX = (
    <>
      {isConfirmModalOpen && (
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={onConfirmModalClose}
          modalText={MODAL_TEXT_TYPE.LOGOUT}
          isUserLoggingOut
        />
      )}

      <Button sx={followButtonStyle}>Edit Profile</Button>
      <IconButton
        aria-label='logout button'
        onClick={onConfirmModalOpen}
        sx={followButtonStyle}
        borderRadius={'50%'}
      >
        <Icon fontSize={'1.25rem'} as={HiOutlineLogout} />
      </IconButton>
    </>
  );

  return (
    <Box w='100%' as='section' p='1rem 1.5rem' mb='1rem'>
      <Box
        as='article'
        display='flex'
        gap='.5rem'
        mb='1rem'
        alignItems='center'
        letterSpacing={'wider'}
      >
        <Avatar size='lg' name={`${firstName} ${lastName}`} src={pic} />
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
          <Icon as={FaCalendarAlt} /> Joined {getCreatedDate(createdAt)}
        </Text>
      </Box>
    </Box>
  );
};

export default ProfileCard;
