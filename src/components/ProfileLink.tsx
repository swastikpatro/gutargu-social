import {
  Avatar,
  Box,
  Center,
  Link as ChakraLink,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useGetSingleUserDetailsQuery } from '../store/api';
import { useAppSelector } from '../store/store-hooks';

const ProfileLink = () => {
  const linkBg = useColorModeValue('gray.200', 'gray.700');
  const mainUserId = useAppSelector((store) => store.auth.mainUserId);
  const {
    data: mainUser,
    isLoading: isMainUserLoading,
    error,
  } = useGetSingleUserDetailsQuery({ mainUserId, id: mainUserId });

  if (isMainUserLoading) {
    return (
      <Center
        as='div'
        p={{ base: '.5rem', md: '.8rem', xl: '1rem .25rem' }}
        w={{ xl: '90%' }}
        order={3}
        bg={linkBg}
        borderRadius='2.5rem'
      >
        <Spinner />
      </Center>
    );
  }

  console.log(error);

  const { firstName, lastName, pic, username, _id } = mainUser;
  const nameOfUser = `${firstName} ${lastName}`;

  // console.log({ mainUser });

  return (
    <Box
      as='div'
      p={{ xl: '.35rem .25rem' }}
      w={{ xl: '90%' }}
      order={3}
      bg={linkBg}
      borderRadius='2.5rem'
    >
      <ChakraLink
        as={NavLink}
        to={`/profile/${_id}`}
        display={{ xl: 'flex' }}
        gap={{ xl: '0 .75rem' }}
        _hover={{
          textDecoration: 'none',
        }}
        _activeLink={{
          // fontWeight: 'bold',
          color: 'blue.400',
        }}
      >
        <Avatar
          size={{ base: 'sm', md: 'md' }}
          name={nameOfUser}
          src={pic}
          color='#fff'
        />
        <Box h='full' as='div' hideBelow='xl'>
          <Text fontWeight='semibold' as='h3'>
            {nameOfUser}
          </Text>

          <Text fontSize='1rem' fontStyle={'italic'} letterSpacing={'normal'}>
            @{username}
          </Text>
        </Box>
      </ChakraLink>
    </Box>
  );
};

export default ProfileLink;
