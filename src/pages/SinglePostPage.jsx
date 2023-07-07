import { useParams, Link } from 'react-router-dom';
import { PostCard, PostsContainer as PostContainer } from '../components';
import {
  useGetSinglePostQuery,
  useGetSingleUserDetailsQuery as useGetMainUserDetailsQuery,
} from '../store/api';
import {
  Center,
  Spinner,
  Text,
  Link as ChakraLink,
  Container,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { getUpdatedWithMainUserDetails } from '../utils/utils';
import CommentForm from '../components/CommentForm';
import CommentCard from '../components/CommentCard';
import { useState } from 'react';

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

  const [activeCommentId, setActiveCommentId] = useState('');

  const updateActiveCommentId = (commentId) => setActiveCommentId(commentId);

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

  const [singlePostWithUpdatedDetails] = getUpdatedWithMainUserDetails({
    posts: [singlePost],
    mainUserDetails,
    propName: 'author',
  });

  const commentsWithUpdatedDetails = getUpdatedWithMainUserDetails({
    posts: singlePost.comments,
    mainUserDetails,
    propName: 'user',
  });

  const totalComments = commentsWithUpdatedDetails.length;

  return (
    <PostContainer headingText={headingText}>
      <PostCard
        postData={singlePostWithUpdatedDetails}
        isBookmarkedByMainUser={
          mainUserDetails.bookmarkedPostIds[singlePost._id] || false
        }
      />

      <Text mt='1rem' fontWeight={'bold'} letterSpacing={'wider'}>
        {totalComments > 0 ? totalComments : 'No'} Repl
        {totalComments === 1 ? 'y' : 'ies'}
      </Text>

      <CommentForm isAddingAndMainUserInfo={mainUserDetails} />

      <Container
        p='0'
        display={'flex'}
        flexDir={'column'}
        gap={{ base: '1rem', md: '1.5rem' }}
      >
        {commentsWithUpdatedDetails.map((singleComment) =>
          activeCommentId === singleComment._id ? (
            <CommentForm
              key={singleComment._id}
              isEditingAndCommentData={singleComment}
              postAuthorId={singlePost.author._id}
              clearActiveCommentId={() => updateActiveCommentId('')}
            />
          ) : (
            <CommentCard
              key={singleComment._id}
              commentData={singleComment}
              ostAuthorId={singlePost.author._id}
              updateActiveCommentId={updateActiveCommentId}
            />
          )
        )}
      </Container>
    </PostContainer>
  );
};

export default SinglePostPage;
