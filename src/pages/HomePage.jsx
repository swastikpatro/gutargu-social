import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Heading,
  Icon,
  Spacer,
  Text,
  useDisclosure,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { Loader, PostCard, PostModal, PostsContainer } from '../components';
import { MdAddCircle } from 'react-icons/md';
import { useState } from 'react';
import { FaFire } from 'react-icons/fa';

import {
  useGetAllPostsQuery,
  useGetSingleUserDetailsQuery as useGetMainUserDetailsQuery,
} from '../store/api';
import {
  sortByCreatedDate,
  sortByLikeCount,
  getUpdatedWithMainUserDetails,
} from '../utils/utils';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { pollingInterval } from '../constants';

const sortTypesAvailable = [
  {
    id: 1,
    sortName: 'Latest',
    sortFunction: sortByCreatedDate,
    leftIcon: <FaFire />,
  },
  {
    id: 2,
    sortName: 'Trending',
    sortFunction: sortByLikeCount,
    leftIcon: (
      <svg
        stroke='currentColor'
        fill='currentColor'
        strokeWidth='0'
        viewBox='0 0 24 24'
        className='text-xl'
        height='1em'
        width='1em'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path fill='none' d='M0 0h24v24H0z'></path>
        <path d='M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zM8.5 15H7.3l-2.55-3.5V15H3.5V9h1.25l2.5 3.5V9H8.5v6zm5-4.74H11v1.12h2.5v1.26H11v1.11h2.5V15h-4V9h4v1.26zm7 3.74c0 .55-.45 1-1 1h-4c-.55 0-1-.45-1-1V9h1.25v4.51h1.13V9.99h1.25v3.51h1.12V9h1.25v5z'></path>
      </svg>
    ),
  },
];

const HomePage = () => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const { data: allPosts, isLoading: isAllPostsLoading } = useGetAllPostsQuery(
    mainUserId,
    { pollingInterval }
  );

  const { data: mainUserDetails, isLoading: isMainUserLoading } =
    useGetMainUserDetailsQuery({ mainUserId, id: mainUserId });

  const { onOpen, isOpen, onClose } = useDisclosure();
  const [activeSortType, setActiveSortType] = useState(sortTypesAvailable[0]);

  const headingText = 'Home';

  if (isAllPostsLoading || isMainUserLoading) {
    return (
      <PostsContainer headingText={headingText}>
        <Loader />
      </PostsContainer>
    );
  }

  const postsOfMainUserAndFollowing = allPosts.filter(
    ({ author: { _id: authorId } }) =>
      authorId === mainUserId || mainUserDetails.followingIds[authorId]
  );

  // posts of mainUser is updated
  const postsOfUserAndFollowingUpdated = getUpdatedWithMainUserDetails({
    posts: postsOfMainUserAndFollowing,
    mainUserDetails,
    propName: 'author',
  });

  const sortedPosts = [...postsOfUserAndFollowingUpdated].sort(
    activeSortType.sortFunction
  );

  const NewPostJSX = (
    <Button
      onClick={onOpen}
      colorScheme='gray'
      display='flex'
      gap={{ base: '0 .25rem', md: '0 .75rem' }}
      mt={{ base: '1rem', md: '2rem' }}
      p={{ base: '1.5rem .5rem', md: '2.5rem 1.5rem' }}
      mr='auto'
      ml='auto'
      borderRadius='full'
      boxShadow='md'
      _hover={{
        boxShadow: 'lg',
      }}
    >
      <Avatar
        size={{ base: 'sm', md: 'md' }}
        name={`${mainUserDetails.firstName} ${mainUserDetails.lastName}`}
        src={mainUserDetails.pic}
      />

      <Text
        fontSize={{ base: '.85rem', md: '1.1rem' }}
        letterSpacing={{ base: 'normal', md: 'wider' }}
        color='gray'
      >
        What's in your mind, {mainUserDetails.firstName}?
      </Text>
      <Spacer />

      <Icon fontSize={{ base: '1rem', md: '1.5rem' }} as={MdAddCircle} />
    </Button>
  );

  const postModalJSX = (
    <PostModal
      isAddingAndMainUserData={mainUserDetails}
      isOpen={isOpen}
      onClose={onClose}
    />
  );

  if (sortedPosts.length < 1) {
    return (
      <PostsContainer headingText={headingText}>
        {NewPostJSX}

        {isOpen && postModalJSX}

        <Center>
          <Text
            color={'red.400'}
            fontSize={{ base: '1rem', md: '1.1rem' }}
            fontWeight={'bold'}
            letterSpacing={'wider'}
          >
            No Posts to Display! Start Following Others or Post something to get
            updates on your Feed.
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
    <Box as='main' maxW='full'>
      <Heading
        as='h2'
        fontSize={{ base: '1.25rem', md: '1.5rem' }}
        letterSpacing='widest'
        textAlign='center'
        p='.75rem'
        borderBottom='1px solid gray'
      >
        {headingText}
      </Heading>

      <Container
        w='full'
        borderBottom='1px solid gray'
        p='1rem 0'
        display='flex'
      >
        {sortTypesAvailable.map(({ id, sortName, leftIcon }, index) => (
          <Button
            color={sortName === activeSortType.sortName ? '#ff4261' : 'inherit'}
            key={id}
            borderRadius='none'
            w='full'
            leftIcon={leftIcon}
            fontSize={{ base: '.85rem', md: '1.15rem' }}
            onClick={() => setActiveSortType(sortTypesAvailable[index])}
            letterSpacing='wider'
            p='1.5rem'
          >
            {sortName}
          </Button>
        ))}
      </Container>

      {isOpen && postModalJSX}

      {NewPostJSX}

      <Container
        display='grid'
        gap={{ base: '1rem 0', md: '1.5rem 0' }}
        py={{ base: '1rem', md: '2rem' }}
        px='0'
      >
        {sortedPosts.map((singlePost) => (
          <PostCard
            key={singlePost._id}
            postData={singlePost}
            isBookmarkedByMainUser={
              mainUserDetails.bookmarkedPostIds[singlePost._id] || false
            }
          />
        ))}
      </Container>
    </Box>
  );
};

export default HomePage;
