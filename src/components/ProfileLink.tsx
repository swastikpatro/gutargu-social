import {
  Box,
  Center,
  Link as ChakraLink,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { useGetSingleUserDetailsQuery } from '../store/api';
import { useAppSelector } from '../store/store-hooks';
import UserHeader from './UserHeader';

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
        to={`/profile/${mainUser._id}`}
        display={{ xl: 'flex' }}
        gap={{ xl: '0 .75rem' }}
        _hover={{
          textDecoration: 'none',
        }}
        _activeLink={{
          color: 'blue.400',
        }}
      >
        <UserHeader user={mainUser} />
      </ChakraLink>
    </Box>
  );
};

export default ProfileLink;
