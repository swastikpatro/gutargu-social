import { Container, Heading } from '@chakra-ui/react';

const PostsContainer = ({ children, headingText }) => {
  return (
    <Container
      display='grid'
      gap={{ base: '1rem 0', md: '1.5rem 0' }}
      pt={{ md: '0' }}
    >
      <Heading
        as='h2'
        fontSize={{ base: '1.25rem', md: '1.5rem' }}
        letterSpacing='widest'
        textAlign='center'
        p={{ base: '.25rem', md: '.75rem' }}
        borderBottom='1px solid gray'
      >
        {headingText}
      </Heading>
      {children}
    </Container>
  );
};

export default PostsContainer;
