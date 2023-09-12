import {
  Box,
  Center,
  Heading,
  Spinner,
  useColorModeValue,
  Text,
} from '@chakra-ui/react';

import { useSelector } from 'react-redux';

// internals
import { useGetAllUsersQuery } from '../store/api';
import { pollingInterval } from '../constants';
import FollowerCard from './FollowerCard';

const FollowerSidebar = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const {
    data: allUsers,
    isLoading: isAllUsersLoading,
    isFetching,
  } = useGetAllUsersQuery(mainUserId, { pollingInterval });

  const suggestedUnFollowedUsers = allUsers?.filter(
    ({ _id, isMainUserFollowing }) => !isMainUserFollowing && _id !== mainUserId
  );

  return (
    <Box
      as='section'
      bg={useColorModeValue('gray.100', 'gray.700')}
      p='1rem 0 .75rem 1rem'
      borderRadius='xl'
      mt='1rem'
    >
      <Heading
        as='h2'
        fontSize='1.25rem'
        letterSpacing='wider'
        fontWeight='semibold'
        color={useColorModeValue('gray.600', 'gray.400')}
        mb='1rem'
        textAlign='center'
      >
        Suggested Users
      </Heading>

      <Box as='div' pr='.75rem' maxH='30rem' overflow='auto' borderRadius='xl'>
        {isAllUsersLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : suggestedUnFollowedUsers.length < 1 ? (
          <Text
            color={'red.400'}
            fontSize={{ base: '1rem', md: '1.1rem' }}
            fontWeight={'bold'}
            letterSpacing={'wider'}
          >
            No suggested users
          </Text>
        ) : (
          suggestedUnFollowedUsers.map((user) => (
            <FollowerCard user={user} key={user._id} />
          ))
        )}
      </Box>
    </Box>
  );
};

export default FollowerSidebar;
