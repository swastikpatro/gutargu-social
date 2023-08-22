import { useParams, Link } from 'react-router-dom';

import {
  useGetAllPostsOfAUserQuery,
  useGetSingleUserDetailsQuery,
} from '../store/api';
import { Loader, PostCard, PostsContainer, ProfileCard } from '../components';
import {
  Box,
  Center,
  Link as ChakraLink,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { pollingInterval } from '../constants';
import { getUpdatedWithMainUserDetails } from '../utils/utils';

const ProfilePage = () => {
  const { profileId: profileIdFromParam } = useParams();
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  // for bookmarks
  // aka useGetMainUserDetailsQuery
  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetSingleUserDetailsQuery({ mainUserId, id: mainUserId });

  const {
    data: allUserPosts,
    isLoading: isPostsLoading,
    isError: isPostsError,
  } = useGetAllPostsOfAUserQuery(
    { mainUserId, id: profileIdFromParam },
    { pollingInterval }
  );

  const {
    data: singleUserDetails,
    isLoading: isUserDetailsLoading,
    isFetching: isUserDetailsFetching,
  } = useGetSingleUserDetailsQuery({ mainUserId, id: profileIdFromParam });

  const userPostsWithUpdatedDetails = getUpdatedWithMainUserDetails({
    posts: allUserPosts,
    mainUserDetails,
    propName: 'author',
  });

  const headingText = `${
    profileIdFromParam === mainUserId ? '' : 'User '
  }Profile Page`;

  const exploreLinkJSX = (
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
  );

  if (isPostsError) {
    return (
      <PostsContainer headingText={headingText}>
        <Center>
          <Text
            color={'red.400'}
            fontSize={{ base: '1rem', md: '1.1rem' }}
            fontWeight={'bold'}
            letterSpacing={'wider'}
          >
            User Not Found
          </Text>
        </Center>

        {exploreLinkJSX}
      </PostsContainer>
    );
  }

  if (
    isPostsLoading ||
    isMainUserLoading ||
    isUserDetailsLoading
    // isUserDetailsFetching
  ) {
    return (
      <PostsContainer headingText={headingText}>
        <Loader />
      </PostsContainer>
    );
  }

  if (allUserPosts.length < 1) {
    return (
      <PostsContainer headingText={headingText}>
        <ProfileCard singleUserDetails={singleUserDetails} />
        <Center>
          <Text
            color={'red.400'}
            fontSize={{ base: '1rem', md: '1.1rem' }}
            fontWeight={'bold'}
            letterSpacing={'wider'}
          >
            No posts
          </Text>
        </Center>

        {mainUserId === profileIdFromParam && exploreLinkJSX}
      </PostsContainer>
    );
  }

  return (
    <PostsContainer headingText={headingText}>
      <ProfileCard
        singleUserDetails={singleUserDetails}
        isUserDetailsFetching={isUserDetailsFetching}
      />

      <Box
        as='section'
        display='grid'
        gap={{ base: '1rem 0', md: '1.5rem 0' }}
        p='0'
        pt={{ base: '.25rem', md: '0' }}
      >
        <Heading
          color={'blue.500'}
          textAlign={'center'}
          as='h3'
          fontSize={'1.5rem'}
          letterSpacing={'widest'}
        >
          Posts
        </Heading>
        {userPostsWithUpdatedDetails.map((singlePost) => (
          <PostCard
            key={singlePost._id}
            postData={singlePost}
            isBookmarkedByMainUser={
              mainUserDetails.bookmarkedPostIds[singlePost._id] || false
            }
          />
        ))}
      </Box>
    </PostsContainer>
  );
};

export default ProfilePage;
