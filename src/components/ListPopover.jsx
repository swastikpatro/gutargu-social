import {
  Box,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Link as ChakraLink,
  useDisclosure,
} from '@chakra-ui/react';

import { Link } from 'react-router-dom';

import UserHeader from './UserHeader';

const ListPopover = ({ usersList, type }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover isLazy isOpen={isOpen} onClose={onClose}>
      <PopoverTrigger>
        <Text
          letterSpacing='wider'
          color='blue.500'
          fontWeight='semibold'
          cursor={'pointer'}
          textDecoration={'underline'}
          onClick={onOpen}
        >
          {usersList.length} {type}
        </Text>
      </PopoverTrigger>

      <PopoverContent w='fit-content' boxShadow='md'>
        <PopoverArrow />

        <PopoverBody p={0}>
          <Flex
            flexDir='column'
            p={5}
            pb='.5rem'
            minH='4rem'
            maxH='15rem'
            overflow={'auto'}
          >
            {usersList.length > 0 ? (
              usersList.map((user) => (
                <Box as='article' key={user._id} mb={'1rem'}>
                  <ChakraLink
                    as={Link}
                    to={`/profile/${user._id}`}
                    _hover={{ textDecoration: 'none' }}
                    onClick={onClose}
                  >
                    <UserHeader user={user} />
                  </ChakraLink>
                </Box>
              ))
            ) : (
              <Text
                letterSpacing={'wider'}
                textAlign='center'
                fontSize='0.9rem'
                color={'red.400'}
                fontWeight={'semibold'}
              >
                No {type} Yet
              </Text>
            )}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default ListPopover;
