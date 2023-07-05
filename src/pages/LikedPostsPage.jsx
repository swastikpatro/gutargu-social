import { Center, Spinner, Text, Link as ChakraLink } from '@chakra-ui/react';
import {
  useGetAllPostsQuery,
  useGetSingleUserDetailsQuery as useGetMainUserDetailsQuery,
} from '../store/api';
import { PostCard, PostsContainer } from '../components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { pollingInterval } from '../constants';
import { getUpdatedPostsWithMainUserDetails } from '../utils/utils';

const LikedPostsPage = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);
  const {
    data: allPosts,
    isLoading: isAllPostsLoading,
    // isError,
  } = useGetAllPostsQuery(mainUserId, { pollingInterval });

  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetMainUserDetailsQuery({ mainUserId, id: mainUserId });

  const headingText = 'Liked Posts';

  if (isAllPostsLoading || isMainUserLoading) {
    return (
      <PostsContainer headingText={headingText}>
        <Center>
          <Spinner />
        </Center>
      </PostsContainer>
    );
  }

  const likedPostsByMainUser = allPosts.filter(
    ({ isLikedByMainUser }) => isLikedByMainUser
  );

  const likedPostsWithUpdatedDetails = getUpdatedPostsWithMainUserDetails({
    posts: likedPostsByMainUser,
    mainUserDetails,
  });

  if (likedPostsByMainUser.length < 1) {
    return (
      <PostsContainer headingText={headingText}>
        <Center>
          <Text
            color={'red.400'}
            fontSize={{ base: '1rem', md: '1.1rem' }}
            fontWeight={'bold'}
            letterSpacing={'wider'}
          >
            No Liked Posts Yet
          </Text>
        </Center>

        <Center>
          <ChakraLink
            bg={'blue.400'}
            color={'#fff'}
            display={'block'}
            as={Link}
            to='/explore'
            _hover={{ textDecoration: 'none', bg: 'blue.500' }}
            padding={'.35rem 1rem'}
            borderRadius={'full'}
            letterSpacing={'widest'}
          >
            Explore
          </ChakraLink>
        </Center>
      </PostsContainer>
    );
  }

  return (
    <PostsContainer headingText={headingText}>
      {likedPostsWithUpdatedDetails.map((singlePost) => (
        <PostCard
          key={singlePost._id}
          postData={singlePost}
          isBookmarkedByMainUser={
            mainUserDetails.bookmarkedPostIds[singlePost._id] || false
          }
        />
      ))}
    </PostsContainer>
  );
};

export default LikedPostsPage;
