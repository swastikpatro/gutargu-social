import {
  Box,
  Button,
  List,
  Link as ChakraLink,
  ListItem,
  Text,
  Tooltip,
  useColorModeValue,
  IconButton,
  Icon,
  useDisclosure,
  Spacer,
  Avatar,
} from '@chakra-ui/react';
import { NavLink, Link } from 'react-router-dom';
import { MdExplore } from 'react-icons/md';
import { RiHome7Fill } from 'react-icons/ri';
import { IoBookmarkSharp } from 'react-icons/io5';
import { AiFillHeart, AiOutlinePlus } from 'react-icons/ai';
import PostModal from './PostModal';

const sidebarLinks = [
  {
    id: '1',
    route: '/',
    icon: <RiHome7Fill />,
    text: 'Home',
    order: 0,
  },
  {
    id: '2',
    route: '/explore',
    icon: <MdExplore />,
    text: 'Explore',
    order: 0,
  },
  {
    id: '3',
    route: '/bookmark',
    icon: <IoBookmarkSharp />,
    text: 'Bookmarks',
    order: 3,
  },
  {
    id: '4',
    route: '/liked',
    icon: <AiFillHeart />,
    text: 'Liked',
    order: 2,
  },
];

const Sidebar = () => {
  const bgOnLinkHover = useColorModeValue('gray.200', 'gray.700');
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <List
      display='flex'
      flexDirection={{ base: 'row', md: 'column' }}
      justifyContent={{ base: 'space-between' }}
      alignItems={{ base: 'center', md: 'flex-start' }}
      gap={{ base: '0 .5rem', md: '1.5rem 0', xl: '.25rem 0' }}
      ml={{ md: '1rem', xl: '0' }}
      p={{ base: '.75rem 2rem', md: '1rem 0' }}
      pb={{ md: '2rem' }}
      h={{ md: 'full' }}
    >
      {sidebarLinks.map(({ id, route, icon, text, order }) => (
        <ChakraLink
          as={NavLink}
          to={route}
          key={id}
          _hover={{
            textDecoration: 'none',
            bg: { lg: bgOnLinkHover },
          }}
          letterSpacing='widest'
          borderRadius='full'
          transition='all .3s linear'
          order={{ base: order, md: 0 }}
          _activeLink={{
            transition: 'none',
            fontWeight: 'bold',
            color: 'blue.400',
          }}
        >
          <ListItem
            display={{ xl: 'flex' }}
            alignItems={{ xl: 'center' }}
            gap={{ xl: '.95rem' }}
            minW={{ xl: '11rem' }}
            p={{ md: '.5rem', xl: '.75rem 1rem' }}
          >
            <Tooltip hasArrow label={text} bg='gray.500' color='#fff'>
              <Box fontSize={{ base: '1.75rem', md: '1.5rem' }} as='span'>
                {icon}
              </Box>
            </Tooltip>

            <Text fontSize='1.25rem' hideBelow='xl'>
              {text}
            </Text>
          </ListItem>
        </ChakraLink>
      ))}

      <Button
        borderRadius='2.5rem'
        bg='blue.400'
        colorScheme='blue'
        hideBelow='xl'
        letterSpacing='widest'
        p={{ xl: '1rem 1.5rem' }}
        fontSize={{ xl: '1.25rem' }}
        w={{ xl: '90%' }}
        h={{ xl: '3.5rem' }}
        color='#fff'
        onClick={onOpen}
        mt='.5rem'
      >
        Post
      </Button>

      <IconButton
        borderRadius='50%'
        hideFrom='xl'
        aria-label='post'
        colorScheme='gray'
        order={{ base: 1, md: 0 }}
        onClick={onOpen}
      >
        <Icon as='span' fontSize='1.5rem'>
          <AiOutlinePlus />
        </Icon>
      </IconButton>

      <PostModal isOpen={isOpen} onClose={onClose} />

      <Spacer hideBelow='md' />

      <ChakraLink
        as={Link}
        to='/profile/123'
        display={{ xl: 'flex' }}
        p={{ xl: '.35rem .25rem' }}
        w={{ xl: '90%' }}
        order={3}
        bg={useColorModeValue('gray.200', 'gray.700')}
        borderRadius='2.5rem'
        gap={{ xl: '0 .75rem' }}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Avatar
          size={{ base: 'sm', md: 'md' }}
          name='Ryan Florence'
          src='https://bit.ly/ryan-florence'
        />
        <Box h='full' as='div' hideBelow='xl'>
          <Text fontWeight='semibold' as='h3'>
            Swastik Patro
          </Text>

          <Text fontSize='1rem'>@swastikpatro</Text>
        </Box>
      </ChakraLink>
    </List>
  );
};

export default Sidebar;
