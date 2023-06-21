import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  Icon,
  Spacer,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { PostCard, PostModal } from '../components';
import { MdAddCircle } from 'react-icons/md';
import { useState } from 'react';
import { FaFire } from 'react-icons/fa';

const sortTypesAvailable = [
  {
    id: 1,
    sortName: 'Trending',
    leftIcon: (
      <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        className='text-xl'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path fill='none' d='M0 0h24v24H0z'></path>
        <path d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-3.5V15H3.5V9h1.25l2.5 3.5V9H8.5v6zm5-4.74H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4v1.26zm7 3.74c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25v5z'></path>
      </svg>
    ),
  },
  { id: 2, sortName: 'Latest', leftIcon: <FaFire /> },
];

const HomePage = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [activeSortType, setActiveSortType] = useState(
    sortTypesAvailable[0].sortName
  );

  return (
    <Box as='main' maxW='full'>
      <Heading
        as='h2'
        fontSize={{ base: '1.25rem', md: '1.5rem' }}
        letterSpacing='widest'
        textAlign='center'
        p='.75rem'
        borderBottom='1px solid gray'
      >
        Home
      </Heading>

      <Container
        w='full'
        borderBottom='1px solid gray'
        p='1rem 0'
        display='flex'
      >
        {sortTypesAvailable.map(({ id, sortName, leftIcon }) => (
          <Button
            color={sortName === activeSortType ? '#ff4261' : 'inherit'}
            key={id}
            borderRadius='none'
            w='full'
            leftIcon={leftIcon}
            fontSize={{ base: '.85rem', md: '1.15rem' }}
            onClick={() => setActiveSortType(sortName)}
            letterSpacing='wider'
            p='1.5rem'
          >
            {sortName}
          </Button>
        ))}
      </Container>

      <PostModal isOpen={isOpen} onClose={onClose} />

      <Button
        // display='none'
        onClick={onOpen}
        colorScheme='gray'
        display='flex'
        gap={{ base: '0 .25rem', md: '0 .75rem' }}
        mt={{ base: '1rem', md: '2rem' }}
        p={{ base: '1.5rem .5rem', md: '2.5rem 1.5rem' }}
        mr='auto'
        ml='auto'
        borderRadius='full'
        boxShadow='md'
        // border='2px solid red'
        _hover={{
          boxShadow: 'lg',
        }}
      >
        <Avatar
          size={{ base: 'sm', md: 'md' }}
          name='Segun Adebayo'
          src='https://bit.ly/sage-adebayo'
        />

        <Text
          fontSize={{ base: '.85rem', md: '1.1rem' }}
          letterSpacing={{ base: 'normal', md: 'wider' }}
          color='gray'
        >
          What's on your mind, Swastik
        </Text>
        <Spacer />

        <Icon fontSize={{ base: '1rem', md: '1.5rem' }} as={MdAddCircle} />
      </Button>

      <Container
        // display='none'
        display='grid'
        gap={{ base: '1rem 0', md: '1.5rem 0' }}
        py={{ base: '1rem', md: '2rem' }}
        px='0'
      >
        {new Array(10).fill(null).map((singlePost, index) => (
          <PostCard key={index} postData={singlePost} />
        ))}
      </Container>
    </Box>
  );
};

export default HomePage;
