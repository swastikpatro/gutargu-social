import {
  Avatar,
  Box,
  Button,
  Center,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
  useToast,
  IconButton,
  Icon,
  Badge,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../store/store-hooks';
import { useParams, Link } from 'react-router-dom';
import { useGetSingleUserDetailsQuery } from '../store/api';
import { removeUserCredentials, updateLogOutStatus } from '../store/authSlice';
import { getCreatedDate, showToast } from '../utils/utils';
import { TOAST_TYPE } from '../constants';
import { HiOutlineLogout } from 'react-icons/hi';
import { FaCalendarAlt } from 'react-icons/fa';

const ProfileCard = () => {
  const bgColor = useColorModeValue('gray.800', 'gray.100');
  const textColor = useColorModeValue('#fff', '#222');
  const followButtonStyle = {
    bg: useColorModeValue('#fff', '#222'),
    color: useColorModeValue('#222', '#fff'),
    _hover: {
      bg: useColorModeValue('gray.300', 'gray.600'),
    },
  };
  const { profileId } = useParams();
  const mainUserId = useAppSelector((store) => store.auth.mainUserId);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const {
    data: singleUserDetails,
    isLoading: isUserDetailsLoading,
    isFetching: isUserDetailsFetching,
  } = useGetSingleUserDetailsQuery({ mainUserId, id: profileId });

  if (isUserDetailsLoading || isUserDetailsFetching) {
    return (
      <Box minH='5rem' w='100%' bg={bgColor} borderRadius={'md'} as='section'>
        <Center h='full' w='full' display={'grid'} placeItems={'center'}>
          <Spinner color={textColor} />
        </Center>
      </Box>
    );
  }

  const handleLogOut = () => {
    dispatch(removeUserCredentials());
    dispatch(updateLogOutStatus());
    showToast({
      toast,
      type: TOAST_TYPE.Success,
      message: 'Logged out successfully',
    });
  };

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

  // console.log({ singleUserDetails });

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
      <Button sx={followButtonStyle}>Edit Profile</Button>
      <IconButton
        aria-label='logout button'
        onClick={handleLogOut}
        sx={followButtonStyle}
        borderRadius={'50%'}
      >
        <Icon fontSize={'1.25rem'} as={HiOutlineLogout} />
      </IconButton>
    </>
  );

  return (
    <Box
      w='100%'
      bg={bgColor}
      borderRadius={'md'}
      as='section'
      p='1rem 1.5rem'
      mb='1rem'
    >
      <Box
        key={profileId}
        as='article'
        display='flex'
        gap='.5rem'
        mb='1rem'
        alignItems='center'
        letterSpacing={'wider'}
      >
        <Avatar size='lg' name={`${firstName} ${lastName}`} src={pic} />
        <Box as='div'>
          <Text color={textColor} fontWeight='semibold'>
            {firstName} {lastName}
          </Text>
          <Text
            color={textColor}
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

        {profileId === mainUserId ? editAndLogOutButtonJSX : followButtonJSX}
      </Box>

      {!!bio && (
        <Text color={textColor} mb='.75rem' letterSpacing={{ xl: 'wider' }}>
          {bio}
        </Text>
      )}

      {!!link && (
        <ChakraLink
          color={textColor}
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
        color={textColor}
        flexWrap={'wrap'}
      >
        <Text letterSpacing='wider'>{followers.length} followers</Text>
        <Text letterSpacing='wider'>{following.length} following</Text>
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
