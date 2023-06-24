import {
  Avatar,
  Box,
  Button,
  Center,
  Heading,
  Spacer,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/store-hooks';
import { useGetAllUsersQuery } from '../store/api';

const FollowerSidebar = () => {
  const mainUserId = useAppSelector((store) => store.auth.mainUserId);

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
          suggestedUnFollowedUsers.map(
            ({ _id: userId, firstName, lastName, username, pic }) => (
              <Box
                key={userId}
                as='article'
                display='flex'
                gap='.5rem'
                mb='1rem'
                alignItems='center'
              >
                <Avatar
                  size={{ base: 'sm', md: 'md' }}
                  name={`${firstName} ${lastName}`}
                  src={pic}
                  as={Link}
                  to={`/profile/${userId}`}
                  cursor='pointer'
                />
                <Box as={Link} to={`/profile/${userId}`} cursor='pointer'>
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
                </Box>

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
            )
          )
        )}
      </Box>
    </Box>
  );
};

export default FollowerSidebar;
