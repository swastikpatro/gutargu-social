import {
  Box,
  Center,
  Heading,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { useGetAllUsersQuery } from '../store/api';

import { useSelector } from 'react-redux';
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
      bg={useColorModeValue('gray.200', 'gray.700')}
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
