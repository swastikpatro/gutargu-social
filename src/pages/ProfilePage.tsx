import { useParams, Link } from 'react-router-dom';
import { useAppSelector } from '../store/store-hooks';
import {
  useGetAllPostsOfAUserQuery,
  useGetSingleUserDetailsQuery,
} from '../store/api';
import { PostCard, PostsContainer, ProfileCard } from '../components';
import {
  Box,
  Center,
  Spinner,
  Link as ChakraLink,
  Text,
  Heading,
} from '@chakra-ui/react';

const ProfilePage = () => {
  const headingText = 'User Profile Page';

  const { profileId: profileIdFromParam } = useParams();
  const mainUserId = useAppSelector((store) => store.auth.mainUserId);

  // for bookmarks
  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetSingleUserDetailsQuery({ mainUserId, id: mainUserId });

  const {
    data: allUserPosts,
    isLoading: isPostsLoading,
    isFetching: isPostsFetching,
    isError: isPostsError,
  } = useGetAllPostsOfAUserQuery({ mainUserId, id: profileIdFromParam });

  const {
    data: singleUserDetails,
    isLoading: isUserDetailsLoading,
    isFetching: isUserDetailsFetching,
  } = useGetSingleUserDetailsQuery({ mainUserId, id: profileIdFromParam });

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
    isUserDetailsLoading ||
    isUserDetailsFetching
  ) {
    return (
      <PostsContainer headingText={headingText}>
        <Center>
          <Spinner />
        </Center>
      </PostsContainer>
    );
  }

  if (isPostsFetching) {
    return (
      <PostsContainer headingText={headingText}>
        <ProfileCard singleUserDetails={singleUserDetails} />

        <Center>
          <Spinner />
        </Center>
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
      <ProfileCard singleUserDetails={singleUserDetails} />

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
        {allUserPosts.map((singlePost) => (
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