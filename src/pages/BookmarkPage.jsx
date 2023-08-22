import { Center, Text, Link as ChakraLink } from '@chakra-ui/react';
import {
  useGetBookmarkPostsQuery,
  useGetSingleUserDetailsQuery as useGetMainUserDetailsQuery,
} from '../store/api';

import { Loader, PostCard, PostsContainer } from '../components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUpdatedWithMainUserDetails } from '../utils/utils';

const BookmarkPage = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const { data: allBookmarkPosts, isLoading: isBookmarkedPostsLoading } =
    useGetBookmarkPostsQuery(mainUserId);

  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetMainUserDetailsQuery({ mainUserId, id: mainUserId });

  const bookmarkPostsWithUpdatedUser = getUpdatedWithMainUserDetails({
    posts: allBookmarkPosts,
    mainUserDetails,
    propName: 'author',
  });
  const headingText = 'Bookmarks';

  if (isBookmarkedPostsLoading || isMainUserLoading) {
    return (
      <PostsContainer headingText={headingText}>
        <Loader />
      </PostsContainer>
    );
  }

  if (allBookmarkPosts.length < 1) {
    return (
      <PostsContainer headingText={headingText}>
        <Center>
          <Text
            color={'red.400'}
            fontSize={{ base: '1rem', md: '1.1rem' }}
            fontWeight={'bold'}
            letterSpacing={'wider'}
            display={'block'}
          >
            No Bookmarks Yet
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
      {bookmarkPostsWithUpdatedUser.map((singlePost) => (
        <PostCard
          key={singlePost._id}
          postData={singlePost}
          isBookmarkedByMainUser
        />
      ))}
    </PostsContainer>
  );
};

export default BookmarkPage;
