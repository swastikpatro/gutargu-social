import { Box } from '@chakra-ui/react';
import { LoginCard, Navbar } from '../components';

const LoginPage = () => {
  return (
    <Box as='section'>
      <Navbar />
      <LoginCard />
    </Box>
  );
};

export default LoginPage;
