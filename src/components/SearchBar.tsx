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
} from '@chakra-ui/react';
import { ChangeEvent, useRef, useState } from 'react';

const SearchBar = () => {
  const [searchText, setSearchText] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
    onOpen();
  };

  return (
    <Box as='div' w='80%' maxW='400px' ml={{ md: '12', lg: '20' }}>
      <Popover
        isOpen={isOpen}
        initialFocusRef={searchRef}
        onOpen={onOpen}
        onClose={onClose}
        placement='bottom'
      >
        <PopoverTrigger>
          <Input
            size='lg'
            type='search'
            placeholder='Search Users..'
            borderRadius='3xl'
            pl='2rem'
            value={searchText}
            boxShadow='base'
            autoComplete='off'
            ref={searchRef}
            onChange={handleSearchChange}
            bg={useColorModeValue('#fff', 'gray.700')}
          />
        </PopoverTrigger>

        {isOpen && (
          <PopoverContent boxShadow='md' p={5}>
            <PopoverCloseButton onClick={onClose} />
            {!searchText ? <Center>Search Users</Center> : 'Hii'}
          </PopoverContent>
        )}
      </Popover>
    </Box>
  );
};

export default SearchBar;
