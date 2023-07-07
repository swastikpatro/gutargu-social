import {
  Box,
  Button,
  List,
  Link as ChakraLink,
  ListItem,
  Text,
  useColorModeValue,
  IconButton,
  Icon,
  useDisclosure,
  Spacer,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { MdExplore } from 'react-icons/md';
import { RiHome7Fill } from 'react-icons/ri';
import { IoBookmarkSharp } from 'react-icons/io5';
import { AiFillHeart, AiOutlinePlus } from 'react-icons/ai';
import PostModal from './PostModal';
import { ProfileLink } from '.';
import { useGetSingleUserDetailsQuery as useGetMainUserDetailsQuery } from '../store/api';
import { useSelector } from 'react-redux';

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

  const mainUserId = useSelector((store) => store.auth.mainUserId);
  const {
    data: mainUserDetails,
    isLoading: isMainUserLoading,
    // error,
  } = useGetMainUserDetailsQuery({ mainUserId, id: mainUserId });

  return (
    <List
      display='flex'
      flexDirection={{ base: 'row', md: 'column' }}
      justifyContent={{ base: 'space-between' }}
      alignItems={{ base: 'center', md: 'flex-start' }}
      gap={{ base: '0 1rem', md: '1.5rem 0', xl: '.25rem 0' }}
      ml={{ md: '1rem', xl: '0' }}
      p={{ base: '0 1.25rem', md: '1rem 0' }}
      pt={{ base: '.5rem' }}
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
            <Box fontSize={{ base: '1.75rem', md: '1.5rem' }} as='span'>
              {icon}
            </Box>

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
        isDisabled={isMainUserLoading}
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
        isDisabled={isMainUserLoading}
      >
        <Icon as={AiOutlinePlus} fontSize='1.5rem' />
      </IconButton>

      {isOpen && (
        <PostModal
          isAddingAndMainUserData={mainUserDetails}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}

      <Spacer hideBelow='md' />

      <ProfileLink />
    </List>
  );
};

export default Sidebar;
