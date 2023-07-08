import {
  Box,
  Button,
  Link as ChakraLink,
  Spacer,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

//  from internal files
import { useFollowUserMutation } from '../store/api';
import UserHeader from './UserHeader';
import { getFollowCacheKey, showToast } from '../utils/utils';
import { TOAST_TYPE } from '../constants';

const FollowerCard = ({ user }) => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);
  const toast = useToast();

  const followButtonStyle = {
    bg: useColorModeValue('#222', '#fff'),
    color: useColorModeValue('#fff', '#222'),
    _hover: {
      bg: useColorModeValue('gray.600', 'gray.300'),
    },
  };

  const [followUser, { isLoading: isFollowUserLoading }] =
    useFollowUserMutation({
      fixedCacheKey: getFollowCacheKey(user._id),
    });

  const handleFollowUser = async () => {
    try {
      const { message } = await followUser({
        followId: user._id,
        mainUserId,
      }).unwrap();

      showToast({ toast, type: TOAST_TYPE.Success, message });
    } catch (error) {
      console.error(error.message);
      showToast({ toast, type: TOAST_TYPE.Error, message: error.message });
    }
  };

  return (
    <Box
      key={user._id}
      as='article'
      display='flex'
      gap='.5rem'
      alignItems='center'
      mb={'1rem'}
    >
      <UserHeader user={user} />

      <Spacer />

      <Button
        {...followButtonStyle}
        borderRadius='full'
        letterSpacing='wider'
        onClick={handleFollowUser}
        isLoading={isFollowUserLoading}
        _loading={{ cursor: 'pointer' }}
      >
        Follow
      </Button>
    </Box>
  );
};

export default FollowerCard;
