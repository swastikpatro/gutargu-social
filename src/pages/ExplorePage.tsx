import { Container } from '@chakra-ui/react';
import { PostCard } from '../components';

const ExplorePage = () => {
  return (
    <Container
      display='grid'
      gap={{ base: '1rem 0', md: '1.5rem 0' }}
      py='2rem'
      justifyContent='center'
    >
      {new Array(10).fill(null).map((singlePost, index) => (
        <PostCard key={index} postData={singlePost} />
      ))}
    </Container>
  );
};

export default ExplorePage;
