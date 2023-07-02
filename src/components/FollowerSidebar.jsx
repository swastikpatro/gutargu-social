import {
  Box,
  Button,
  Center,
  Heading,
  Spacer,
  Spinner,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useGetAllUsersQuery } from '../store/api';
import UserHeader from './UserHeader';
import { useSelector } from 'react-redux';

const FollowerSidebar = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const { data: allUsers, isLoading: isAllUsersLoading } =
    useGetAllUsersQuery(mainUserId);

  const suggestedUnFollowedUsers = allUsers?.filter(
    ({ _id, isFollowingMainUser }) => !isFollowingMainUser && _id !== mainUserId
  );

  const followButtonStyle = {
    bg: useColorModeValue('#222', '#fff'),
    color: useColorModeValue('#fff', '#222'),
    _hover: {
      bg: useColorModeValue('gray.600', 'gray.300'),
    },
  };

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
                // isLoading
              >
                Follow
              </Button>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
};

export default FollowerSidebar;