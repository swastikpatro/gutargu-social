import {
  Box,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Center,
  PopoverCloseButton,
  useDisclosure,
  useColorModeValue,
  Spinner,
  Avatar,
  Text,
  PopoverBody,
  InputGroup,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useGetAllUsersQuery } from '../store/api';
import { useAppSelector } from '../store/store-hooks';
import { Link } from 'react-router-dom';
import { DEBOUNCED_DELAY } from '../constants';
import { filterOnFirstLastAndUserName } from '../utils/utils';
import UserHeader from './UserHeader';

const SearchBar = () => {
  const mainUserId = useAppSelector((store) => store.auth.mainUserId);

  const [searchText, setSearchText] = useState<string>('');
  const trimmedSearchText = searchText.trim();

  const [filteredUsers, setFilteredUsers] = useState([]);

  const [isFilteringLoading, setIsFilteringLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const searchRef = useRef(null);

  const { data: allUsers, isLoading: isUsersLoading } =
    useGetAllUsersQuery(mainUserId);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
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
    let timer: number | undefined;
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
            <ChakraLink
              key={user._id}
              as={Link}
              to={`/profile/${user._id}`}
              _hover={{ textDecoration: 'none' }}
              onClick={() => {
                onClose();
                setSearchText('');
              }}
            >
              <Box as='article' mb='1rem'>
                <UserHeader user={user} />
              </Box>
            </ChakraLink>
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
              onBlur={onClose}
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
