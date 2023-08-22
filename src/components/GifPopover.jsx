import {
  Box,
  Center,
  Container,
  FormControl,
  Icon,
  IconButton,
  Image,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';

import { MdGif } from 'react-icons/md';
import { DEBOUNCED_DELAY } from '../constants';
import { useEffect } from 'react';

const GifPopover = ({ onGifClick }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const searchRef = useRef(null);
  const [isGifLoading, setIsGifLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gifList, setGifList] = useState([]);
  const trimmedQuery = searchQuery.trim();
  const TENOR_URL = `https://tenor.googleapis.com/v2/search?q=${trimmedQuery}&key=${
    import.meta.env.VITE_REACT_TENOR_API_KEY
  }&client_key=${
    import.meta.env.VITE_REACT_TENOR_PROJECT_NAME
  }&limit=${'10'}&contentFilter='high'`;
  const clearSearch = () => setSearchQuery('');

  const fetchGifList = async () => {
    try {
      const res = await fetch(TENOR_URL);
      const json = await res.json();
      setGifList(json.results);
      setIsGifLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let timer;
    if (!trimmedQuery || !isOpen) {
      setGifList([]);
      return;
    }

    timer = setTimeout(() => {
      fetchGifList();
    }, DEBOUNCED_DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [trimmedQuery]);

  const handleSearchChange = ({ target: { value: targetValue } }) => {
    setIsGifLoading(true);

    setSearchQuery((prevText) => {
      if (prevText.trim() === targetValue.trim() || !targetValue) {
        setIsGifLoading(false);
      }
      return targetValue;
    });
  };

  const gifInfoJSX = !!trimmedQuery && (
    <Container
      p='0'
      pr='.5rem'
      mt='1rem'
      borderRadius={'fmd'}
      display={'grid'}
      gridTemplateColumns={{
        base: 'repeat(auto-fill, minmax(8rem, 1fr))',
        md: 'repeat(auto-fill, minmax(10rem, 1fr))',
      }}
      maxH='20rem'
      overflow={'auto'}
      gap='1rem'
    >
      {gifList.length < 1 ? (
        <Text color='red.400'>
          No gif found for your search '{searchQuery}'
        </Text>
      ) : (
        gifList.map(
          ({
            id,
            media_formats: {
              gif: { url },
            },
            content_description,
          }) => (
            <Box
              onClick={() => {
                onGifClick(url);
                clearSearch();
                onClose();
              }}
              borderRadius={'base'}
              bg={'#fff'}
              key={id}
              border='2px solid gray'
              h='10rem'
              w='full'
              overflow={'hidden'}
              cursor={'pointer'}
            >
              <Image
                loading='lazy'
                w='full'
                h='full'
                objectFit={'contain'}
                src={url}
                controls
                alt={content_description}
              />
            </Box>
          )
        )
      )}
    </Container>
  );

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      onClose={() => {
        clearSearch();
        onClose();
      }}
      initialFocusRef={searchRef}
    >
      <PopoverTrigger>
        <IconButton
          onClick={onOpen}
          fontSize={'2.5rem'}
          bg='transparent'
          _hover={{ bg: 'transparent' }}
        >
          <Icon as={MdGif} />
        </IconButton>
      </PopoverTrigger>

      <PopoverContent w='90vw' maxW='500px' ml='1rem' boxShadow={'lg'}>
        <PopoverArrow ml='-.5rem' />
        <PopoverCloseButton />
        <PopoverBody>
          {isOpen && (
            <Box>
              <FormControl w='calc(100% - 2rem)'>
                <Input
                  ref={searchRef}
                  w='full'
                  type='search'
                  placeholder='Search Gif..'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoComplete='off'
                />
              </FormControl>

              {isGifLoading ? (
                <Center my='1rem'>
                  <Spinner color='blue.500' />
                </Center>
              ) : (
                gifInfoJSX
              )}
            </Box>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default GifPopover;
