import { useParams, Link } from 'react-router-dom';
import { PostCard, PostsContainer as PostContainer } from '../components';
import {
  useGetSinglePostQuery,
  useGetSingleUserDetailsQuery as useGetMainUserDetailsQuery,
} from '../store/api';
import { Center, Spinner, Text, Link as ChakraLink } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const SinglePostPage = () => {
  const { postId } = useParams();
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const {
    data: singlePost,
    isLoading: isSinglePostLoading,
    isFetching: isSinglePostFetching,
    isError: isPostError,
  } = useGetSinglePostQuery({ mainUserId, id: postId });

  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetMainUserDetailsQuery({ mainUserId, id: mainUserId });

  const headingText = 'Single Post Page';

  if (isPostError) {
    return (
      <PostContainer headingText={headingText}>
        <Center>
          <Text
            color={'red.400'}
            fontSize={{ base: '1rem', md: '1.1rem' }}
            fontWeight={'bold'}
            letterSpacing={'wider'}
          >
            Post Not Found
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
      </PostContainer>
    );
  }

  if (isSinglePostLoading || isMainUserLoading) {
    return (
      <PostContainer headingText={headingText}>
        <Center>
          <Spinner />
        </Center>
      </PostContainer>
    );
  }

  // if (isSinglePostFetching) {
  //   console.log({ singlePost });
  //   return (
  //     <PostContainer headingText={headingText}>
  //       <PostCard
  //         key={'10'}
  //         postData={singlePost}
  //         isBookmarkedByMainUser={
  //           mainUserDetails.bookmarkedPostIds[singlePost._id] || false
  //         }
  //       />
  //       {/* <PageLoader /> */}
  //     </PostContainer>
  //   );
  // }
  // if (isSinglePostFetching) {
  //   console.log('fetching again');
  // }

  // console.log('displaying ui');

  return (
    <PostContainer headingText={headingText}>
      <PostCard
        postData={singlePost}
        isBookmarkedByMainUser={
          mainUserDetails.bookmarkedPostIds[singlePost._id] || false
        }
      />
    </PostContainer>
  );
};

export default SinglePostPage;
