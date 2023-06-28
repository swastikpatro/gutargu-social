import { Outlet, useLocation } from 'react-router-dom';
import { FollowerSidebar, Navbar, Sidebar } from '../components';
import { Box, Container, useColorModeValue } from '@chakra-ui/react';
import { sectionCenterStyles } from '../styles/GlobalStyles';
import { useEffect } from 'react';

const SharedLayout = () => {
  const location = useLocation();

  const colorMode = {
    bgSidebar: useColorModeValue('#fff', 'gray.800'),
    bgFollowerSidebar: useColorModeValue('#fff', 'gray.800'),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <Navbar />
      <Container
        sx={sectionCenterStyles}
        display='grid'
        gridTemplateColumns={{
          base: '1fr',
          md: '80px 1fr',
          lg: '80px 1fr 350px',
          xl: '250px 1fr 350px',
        }}
      >
        <Box
          pos={{ base: 'fixed', md: 'sticky' }}
          top={{ base: 'calc(100vh - 4rem)', md: '6rem' }}
          left={{ base: 0 }}
          w={{ base: '100vw', md: '80px', lg: '80px', xl: '250px' }}
          h={{ base: '4rem', md: 'calc(100vh - 6rem)' }}
          // border='2px solid red'
          bg={colorMode.bgSidebar}
          zIndex={11}
        >
          <Sidebar />
        </Box>

        <Box
          minH='calc(100vh - 5rem)'
          pt='1rem'
          pb={{ base: '5rem', md: '3rem' }}
          as='section'
          borderRight={{ lg: '2px solid #a9a9a9' }}
          borderLeft={{ md: '2px solid #a9a9a9' }}
        >
          <Outlet />
        </Box>

        <Box
          pos='sticky'
          top='5rem'
          h='calc(100vh - 5rem)'
          display={{ base: 'none', lg: 'block' }}
          bg={colorMode.bgFollowerSidebar}
          p='.5rem 1.5rem'
        >
          <FollowerSidebar />
        </Box>
      </Container>
    </>
  );
};

export default SharedLayout;
