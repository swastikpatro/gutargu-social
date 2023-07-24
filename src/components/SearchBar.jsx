import {
  Box,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Center,
  useDisclosure,
  useColorModeValue,
  Spinner,
  Text,
  PopoverBody,
  InputGroup,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useGetAllUsersQuery } from '../store/api';
import { Link } from 'react-router-dom';
import { DEBOUNCED_DELAY, pollingInterval } from '../constants';
import { filterOnFirstLastAndUserName } from '../utils/utils';
import UserHeader from './UserHeader';
import { useSelector } from 'react-redux';
import { useBlur } from '../hooks';

const SearchBar = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const [searchText, setSearchText] = useState('');
  const trimmedSearchText = searchText.trim();

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isFilteringLoading, setIsFilteringLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchRef = useRef(null);
  useBlur({ searchRef, onClose });

  const { data: allUsers, isLoading: isUsersLoading } = useGetAllUsersQuery(
    mainUserId,
    { pollingInterval }
  );

  const handleSearchChange = (e) => {
    const userTypedText = e.target.value;

    setIsFilteringLoading(true);

    setSearchText((prevText) => {
      if (prevText.trim() === userTypedText.trim()) {
        setIsFilteringLoading(false);
      }
      return userTypedText;
    });
  };

  useEffect(() => {
    let timer;
    if (!isUsersLoading) {
      timer = setTimeout(() => {
        const listAsPerSearch = filterOnFirstLastAndUserName({
          list: allUsers,
          trimmedSearchText,
        });

        setFilteredUsers(listAsPerSearch);
        setIsFilteringLoading(false);
      }, DEBOUNCED_DELAY);
    }

    return () => {
      if (!isUsersLoading) {
        clearTimeout(timer);
      }
    };
  }, [trimmedSearchText]);

  const listContentJSX =
    isUsersLoading || isFilteringLoading ? (
      <Center>
        <Spinner />
      </Center>
    ) : (
      <Box maxH='10rem' h='fit-content' overflow={'auto'}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Box
              key={user._id}
              as='article'
              mb='1rem'
              onClick={() => {
                onClose();
                setSearchText('');
              }}
            >
              <UserHeader user={user} />
            </Box>
          ))
        ) : (
          <Center>
            <Text
              fontWeight={'semibold'}
              letterSpacing={'wider'}
              color='red.400'
            >
              No user found for your search '{searchText}'
            </Text>
          </Center>
        )}
      </Box>
    );

  return (
    <Box as='div' w='80%' maxW='400px' ml={{ md: '12', lg: '20' }}>
      <Popover
        initialFocusRef={searchRef}
        isOpen={isOpen && !!trimmedSearchText}
        placement='bottom'
        isLazy
      >
        <PopoverTrigger>
          <InputGroup>
            <Input
              ref={searchRef}
              size='lg'
              type='search'
              placeholder='Search Users..'
              borderRadius='3xl'
              pl='2rem'
              value={searchText}
              boxShadow='base'
              autoComplete='off'
              onFocus={onOpen}
              onChange={handleSearchChange}
              bg={useColorModeValue('#fff', 'gray.700')}
            />
          </InputGroup>
        </PopoverTrigger>

        <PopoverContent boxShadow='md' p={5}>
          <PopoverBody>{listContentJSX}</PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default SearchBar;
