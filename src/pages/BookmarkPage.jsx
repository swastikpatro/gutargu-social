import { Center, Spinner, Text, Link as ChakraLink } from '@chakra-ui/react';
import { useGetSingleUserDetailsQuery } from '../store/api';

import { PostCard, PostsContainer } from '../components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BookmarkPage = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetSingleUserDetailsQuery({ mainUserId, id: mainUserId });

  const headingText = 'Bookmarks';

  if (isMainUserLoading) {
    return (
      <PostsContainer headingText={headingText}>
        <Center>
          <Spinner />
        </Center>
      </PostsContainer>
    );
  }

  // const detailsWithUpdatedBookmarks = {
  //   ...mainUserDetails,
  //   bookmarks: mainUserDetails.bookmarks.map((post) => ({
  //     ...post,
  //     isLikedByMainUser: post.likes.likedBy.includes(mainUserId),
  //   })),
  // };

  if (mainUserDetails.bookmarks.length < 1) {
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
      {mainUserDetails.bookmarks.map((singlePost) => (
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
