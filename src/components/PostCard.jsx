import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Link as ChakraLink,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Container,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  BsBookmark,
  BsThreeDotsVertical,
  BsHeart,
  BsFillHeartFill,
  BsFillBookmarkFill,
} from 'react-icons/bs';
// import { TfiComment } from 'react-icons/tfi';
import { HiShare } from 'react-icons/hi';
import { getCreatedDate, showToast } from '../utils/utils';
import PostModal from './PostModal';
import ConfirmModal from './ConfirmModal';
import { DEBOUNCED_DELAY, MODAL_TEXT_TYPE, TOAST_TYPE } from '../constants';
import {
  useLikePostMutation,
  useUnlikePostMutation,
  useUnbookmarkPostMutation,
  useBookmarkPostMutation,
} from '../store/api';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';

const PostCard = ({ postData, isBookmarkedByMainUser = false }) => {
  let isMountRef = useRef(null);
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  // const []

  const [likePost, { isLoading: isLikeLoading }] = useLikePostMutation();
  const [unlikePost, { isLoading: isUnlikeLoading }] = useUnlikePostMutation();

  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnbookmarkPostMutation();

  const [isBookmarkedLocal, setIsBookmarkedLocal] = useState(
    isBookmarkedByMainUser
  );

  const toggleBookmark = () => {
    setIsBookmarkedLocal(!isBookmarkedLocal);
  };

  useEffect(() => {
    // if in the cache, post is bookmarked my main user, and also the isBookmarked state is true, then no need to update optimistically.
    if (isBookmarkedByMainUser === isBookmarkedLocal) {
      return;
    }

    let timer = setTimeout(() => {
      console.log('Im called');
      handleBookmarkUnbookmark();
    }, DEBOUNCED_DELAY);

    return () => {
      // if timer is present and user navigates to different route so component gets out of view, so then, dont clear the timeout, let the last post request fly!

      // else if timer is present and user toggles isBookmarkedLocal, clear the previous timer
      if (!isMountRef.current) {
        return;
      }
      clearTimeout(timer);
    };
  }, [isBookmarkedLocal]);

  const {
    _id: postId,
    author: { _id: authorId, firstName, lastName, username, pic },
    content,
    imageUrl,
    createdAt,
    isLikedByMainUser,
    likes: { likeCount },
  } = postData;

  const {
    isOpen: isPostModalOpen,
    onOpen: onPostModalOpen,
    onClose: onPostModalClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();

  const toast = useToast();

  const isPostByMainUser = mainUserId === authorId;

  const handleCopyToClipboard = () => {
    showToast({
      toast,
      type: TOAST_TYPE.Success,
      message: 'Copied to clipboard',
    });
    navigator.clipboard.writeText(
      `https://gutargu-social.vercel.app/post/${postId}`
    );
  };

  const handleLikeUnlikePost = async () => {
    try {
      await (!isLikedByMainUser
        ? likePost({
            postData,
            mainUserId,
          })
        : unlikePost({
            postData,
            mainUserId,
          })
      ).unwrap();
    } catch (error) {
      console.log({ error });
    }
  };

  const handleBookmarkUnbookmark = async () => {
    try {
      await (isBookmarkedLocal
        ? bookmarkPost({ postData, mainUserId })
        : unbookmarkPost({ postIdToUnBookmark: postId, mainUserId })
      ).unwrap();
    } catch (error) {
      console.log({ error: error.message });
    }
  };

  return (
    <Card boxShadow='md' cursor='default' ref={isMountRef}>
      <CardHeader as='header' pb={{ base: '.5rem', md: '1rem' }}>
        <Flex>
          <ChakraLink
            as={Link}
            to={`/profile/${authorId}`}
            _hover={{
              textDecoration: 'none',
            }}
          >
            <Flex
              gap={{ base: '2', md: '4' }}
              alignItems='center'
              flexWrap='wrap'
            >
              <Avatar
                size={{ base: 'md', md: 'lg' }}
                name={`${firstName} ${lastName}`}
                src={pic}
              />

              <Box>
                <Heading size={{ base: 'xs', md: 'md' }}>
                  {firstName} {lastName}
                </Heading>

                <Text
                  fontSize={{ base: '.75rem', md: '.9rem' }}
                  letterSpacing='widest'
                  fontStyle={'italic'}
                >
                  @{username}
                </Text>

                <Text
                  fontSize={{ base: '.7rem', md: '.8rem' }}
                  letterSpacing='wider'
                  color={'gray'}
                  fontWeight={'semibold'}
                >
                  {getCreatedDate(createdAt)}
                </Text>
              </Box>
            </Flex>
          </ChakraLink>

          <Spacer />

          {isPostByMainUser && (
            <Menu>
              <MenuButton
                variant='ghost'
                colorScheme='gray'
                borderRadius='50%'
                aria-label='Options'
                as={IconButton}
                icon={<BsThreeDotsVertical />}
              />
              <MenuList minW='10rem' p='0' boxShadow='xl'>
                <MenuItem
                  onClick={onPostModalOpen}
                  as={Button}
                  borderRadius='none'
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={onConfirmModalOpen}
                  as={Button}
                  borderRadius='none'
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardHeader>

      <CardBody pt='0' as='main'>
        {isPostModalOpen && (
          <PostModal
            isOpen={isPostModalOpen}
            onClose={onPostModalClose}
            isEditingAndMainUserData={postData}
          />
        )}

        {isConfirmModalOpen && (
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={onConfirmModalClose}
            modalText={MODAL_TEXT_TYPE.DELETE_POST}
            isDeletingPostAndPostId={postId}
          />
        )}

        <ChakraLink
          as={Link}
          to={`/post/${postId}`}
          _hover={{ textDecoration: 'none' }}
        >
          <Text
            letterSpacing={{ base: 'mormal', md: 'wide' }}
            fontSize={{ base: '.9rem', md: '1.1rem' }}
          >
            {content}
          </Text>

          {!!imageUrl && !imageUrl.includes('.mp4') && (
            <Container
              w='full'
              minH='20rem'
              h='fit-content'
              mt={'.75rem'}
              p='0'
              borderRadius='md'
              overflow={'hidden'}
            >
              <Image
                objectFit='cover'
                w='full'
                h='full'
                bg={'#fff'}
                src={imageUrl}
                alt='post image'
              />
            </Container>
          )}

          {imageUrl.includes('.mp4') && <video controls src={imageUrl} />}
        </ChakraLink>
      </CardBody>

      <CardFooter
        py={{ base: '.5rem' }}
        as='footer'
        display='flex'
        alignItems='center'
        gap={{ base: '.75rem', md: '.95rem' }}
        borderTop={'1px solid gray'}
      >
        <Box
          display='flex'
          alignItems='center'
          gap={{ base: '0', md: '.1rem' }}
        >
          <IconButton
            onClick={handleLikeUnlikePost}
            variant='ghost'
            aria-label='Like Unlike Toggle'
            cursor='pointer'
            borderRadius='50%'
            fontSize={{ base: '1rem', md: '1.25rem' }}
            w='2rem'
            color={isLikedByMainUser ? 'red' : 'inherit'}
            _hover={{ bg: 'transparent' }}
            isLoading={isLikeLoading || isUnlikeLoading}
            _loading={{ color: '#fff' }}
          >
            <Icon as={isLikedByMainUser ? BsFillHeartFill : BsHeart} />
          </IconButton>

          {likeCount > 0 && <Text>{likeCount}</Text>}
        </Box>

        {/* <Box
          display='flex'
          alignItems='center'
          gap={{ base: '0', md: '.1rem' }}
        >
          <IconButton
            variant='ghost'
            aria-label='Like Unlike Toggle'
            cursor='pointer'
            borderRadius='50%'
            bg='transparent'
            fontSize={{ base: '1rem', md: '1.25rem' }}
            w='2rem'
          >
            <Icon as={TfiComment} />
          </IconButton>

          <Text>3</Text>
        </Box> */}

        <IconButton
          onClick={toggleBookmark}
          variant='ghost'
          aria-label='Like Unlike Toggle'
          cursor='pointer'
          borderRadius='50%'
          bg='transparent'
          fontSize={{ base: '1rem', md: '1.25rem' }}
          w='2rem'
          color={isBookmarkedLocal ? 'green' : 'inherit'}
          _hover={{ bg: 'transparent' }}
        >
          <Icon as={isBookmarkedLocal ? BsFillBookmarkFill : BsBookmark} />
        </IconButton>

        <Spacer />

        <IconButton
          variant='ghost'
          aria-label='Like Unlike Toggle'
          boxSize={6}
          cursor='pointer'
          borderRadius='50%'
          p='1.15rem'
          bg='transparent'
          fontSize={{ base: '1rem', md: '1.25rem' }}
          onClick={handleCopyToClipboard}
        >
          <Icon as={HiShare} />
        </IconButton>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
