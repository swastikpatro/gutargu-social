import {
  Box,
  Button,
  Link as ChakraLink,
  Spacer,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import React from 'react';
import UserHeader from './UserHeader';
import { useFollowUserMutation } from '../store/api';
import { useSelector } from 'react-redux';

const FollowerCard = ({ user }) => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const followButtonStyle = {
    bg: useColorModeValue('#222', '#fff'),
    color: useColorModeValue('#fff', '#222'),
    _hover: {
      bg: useColorModeValue('gray.600', 'gray.300'),
    },
  };

  const [followUser, { isLoading: isFollowUserLoading }] =
    useFollowUserMutation({
      fixedCacheKey: `follow-user-${user._id}`,
    });

  const handleFollowUser = async () => {
    try {
      await followUser({
        followId: user._id,
        mainUserId,
      }).unwrap();
    } catch (error) {
      console.error(error.message);
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
      <ChakraLink
        as={Link}
        to={`/profile/${user._id}`}
        _hover={{ textDecoration: 'none' }}
      >
        <UserHeader user={user} />
      </ChakraLink>

      <Spacer />

      <Button
        {...followButtonStyle}
        borderRadius='full'
        letterSpacing='wider'
        onClick={handleFollowUser}
        isLoading={isFollowUserLoading}
      >
        Follow
      </Button>
    </Box>
  );
};

export default FollowerCard;
