import { Box, Center, Image, Link as ChakraLink } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <Box as='section' height='100vh' display='grid' placeItems='center'>
      <Box h='10rem'>
        <Image
          loading='lazy'
          h='100%'
          w='100%'
          src={
            'https://res.cloudinary.com/dtbd1y4en/image/upload/v1690131632/pagenotfound.fab8ad695e2026cc86b8_vn5udx.png'
          }
          alt='error-page'
        />

        <Center mt='2rem'>
          <ChakraLink
            bg={'blue.400'}
            color={'#fff'}
            display={'block'}
            as={Link}
            to='/'
            _hover={{ textDecoration: 'none', bg: 'blue.500' }}
            padding={'.35rem 1rem'}
            borderRadius={'full'}
            letterSpacing={'widest'}
          >
            Back To Home
          </ChakraLink>
        </Center>
      </Box>
    </Box>
  );
};

export default ErrorPage;
