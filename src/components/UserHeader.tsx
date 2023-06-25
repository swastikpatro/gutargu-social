import { Avatar, Box, Text, Link as ChakraLink, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const UserHeader = ({ user }) => {
  const { id_: userId, firstName, lastName, username, pic } = user;
  return (
    <Flex gap={'.5rem'} alignItems={'center'}>
      <Avatar
        size={{ base: 'sm', md: 'md' }}
        name={`${firstName} ${lastName}`}
        src={pic}
        cursor='pointer'
      />
      <Box as='div' cursor='pointer'>
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
    </Flex>
  );
};

export default UserHeader;
