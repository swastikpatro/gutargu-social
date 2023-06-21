import { Box } from '@chakra-ui/react';
import { Navbar, SignupCard } from '../components';

const SignupPage = () => {
  return (
    <Box as='section'>
      <Navbar />
      <SignupCard />
    </Box>
  );
};

export default SignupPage;
