import { Container, Heading } from '@chakra-ui/react';

interface PostsContainerProps {
  children: React.ReactNode;
  headingText: string;
}
const PostsContainer = ({ children, headingText }: PostsContainerProps) => {
  return (
    <Container
      display='grid'
      gap={{ base: '1rem 0', md: '1.5rem 0' }}
      p='0'
      pt={{ base: '.25rem', md: '0' }}
      // justifyContent='center'
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