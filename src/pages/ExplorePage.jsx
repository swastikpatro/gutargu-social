import { Center, Spinner } from '@chakra-ui/react';
import { PostCard, PostsContainer } from '../components';
import {
  useGetAllPostsQuery,
  useGetSingleUserDetailsQuery as useGetMainUserDetailsQuery,
} from '../store/api';
import { pollingInterval } from '../constants';

import { useSelector } from 'react-redux';

const ExplorePage = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const {
    data: allPosts,
    isLoading: isAllPostsLoading,
    isError,
  } = useGetAllPostsQuery(mainUserId, { pollingInterval });

  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetMainUserDetailsQuery({ mainUserId, id: mainUserId });

  const headingText = 'Explore';

  if (isError) {
    return <p>Error</p>;
  }

  if (isAllPostsLoading || isMainUserLoading) {
    return (
      <PostsContainer headingText={headingText}>
        <Center>
          <Spinner />
        </Center>
      </PostsContainer>
    );
  }

  return (
    <PostsContainer headingText={headingText}>
      {allPosts.map((singlePost) => (
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

export default ExplorePage;
