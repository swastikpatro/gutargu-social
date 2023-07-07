import {
  Box,
  Container,
  Link as ChakraLink,
  useColorMode,
  IconButton,
  Icon,
  Text,
  Flex,
} from '@chakra-ui/react';
import { sectionCenterStyles } from '../styles/GlobalStyles';
import logo from '../assets/logo.svg';
import SearchBar from './SearchBar';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';

import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();

  const isInAuthPage =
    location.pathname === '/login' || location.pathname === '/signup';

  return (
    <Box
      as='nav'
      boxShadow='lg'
      pos='sticky'
      top='-.1rem'
      left='0'
      h={{ base: '4.5rem', md: '5rem' }}
      zIndex={14}
      bg={colorMode === 'light' ? '#fff' : 'gray.800'}
    >
      <Container
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={sectionCenterStyles}
        as='div'
        py={{ base: '.75rem', md: '.5rem' }}
      >
        <ChakraLink
          as={Link}
          to='/'
          display={{ base: !isInAuthPage ? 'block' : 'flex', lg: 'flex' }}
          gap='0 .5rem'
          alignItems='flex-end'
          _hover={{
            textDecoration: 'none',
          }}
          {...(isInAuthPage && { m: 'auto' })}
        >
          <Box as='img' src={logo} h={{ base: '3rem', md: '4rem' }} />

          <Text
            {...(!isInAuthPage && { hideBelow: 'xl' })}
            fontSize='2.25rem'
            color='blue.400'
            fontWeight='semibold'
            letterSpacing='wider'
          >
            Gutargu
          </Text>
        </ChakraLink>

        {!isInAuthPage && (
          <Flex
            flexGrow={1}
            justifyContent={{ base: 'center', lg: 'flex-start' }}
          >
            <SearchBar />
          </Flex>
        )}

        <IconButton
          aria-label='Toggle Mode'
          boxSize={6}
          cursor='pointer'
          onClick={toggleColorMode}
          color={colorMode === 'light' ? 'gray.800' : '#fff'}
          borderRadius='50%'
          p='1.15rem'
          bg='transparent'
          fontSize='1.25rem'
        >
          {colorMode === 'light' ? (
            <Icon as={FaMoon} />
          ) : (
            <Icon as={BsFillSunFill} />
          )}
        </IconButton>
      </Container>
    </Box>
  );
};

export default Navbar;
