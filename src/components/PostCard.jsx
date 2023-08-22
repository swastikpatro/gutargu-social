import {
  Avatar,
  Box,
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

// react router dom
import { Link } from 'react-router-dom';

// redux internal
import {
  useLikePostMutation,
  useUnlikePostMutation,
  useUnbookmarkPostMutation,
  useBookmarkPostMutation,
  useDeletePostMutation,
} from '../store/api';
import { useSelector } from 'react-redux';

// react icons
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import {
  BsBookmark,
  BsThreeDotsVertical,
  BsHeart,
  BsFillHeartFill,
  BsFillBookmarkFill,
} from 'react-icons/bs';
import { HiShare } from 'react-icons/hi';
import { TfiComment } from 'react-icons/tfi';

// from internal files
import { getCreatedDate, showToast } from '../utils/utils';
import PostModal from './PostModal';
import ConfirmModal from './ConfirmModal';
import { DEBOUNCED_DELAY, MODAL_TEXT_TYPE, TOAST_TYPE } from '../constants';

// react icons
import { useEffect, useRef, useState } from 'react';

const PostCard = ({ postData, isBookmarkedByMainUser = false }) => {
  let isMountRef = useRef(null);
  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const [likePost, { isLoading: isLikeLoading }] = useLikePostMutation();
  const [unlikePost, { isLoading: isUnlikeLoading }] = useUnlikePostMutation();

  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnbookmarkPostMutation();

  const [deletePost, { isLoading: isPostDeleting }] = useDeletePostMutation();

  const [isBookmarkedLocal, setIsBookmarkedLocal] = useState(
    isBookmarkedByMainUser
  );

  const toggleBookmark = () => {
    setIsBookmarkedLocal(!isBookmarkedLocal);
  };

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

  const {
    _id: postId,
    author: { _id: authorId, firstName, lastName, username, pic, verified },
    content,
    imageUrl,
    createdAt,
    isLikedByMainUser,
    likes: { likeCount },
    comments,
  } = postData;

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

  const handleDeletePost = async () => {
    try {
      const { message } = await deletePost({
        postIdToDelete: postId,
      }).unwrap();

      showToast({ toast, type: TOAST_TYPE.Success, message });
    } catch (error) {
      console.log({ error: error.message });
      showToast({ toast, type: TOAST_TYPE.Error, message: error.message });
    }
  };

  useEffect(() => {
    // if in the cache, post is bookmarked my main user, and also the isBookmarked state is true, then no need to update optimistically.
    if (isBookmarkedByMainUser === isBookmarkedLocal) {
      return;
    }

    let timer = setTimeout(() => {
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
                <Heading
                  size={{ base: 'xs', md: 'md' }}
                  display={'flex'}
                  alignItems={'center'}
                  gap='.25rem'
                >
                  {firstName} {lastName}{' '}
                  {verified && (
                    <Box as='span'>
                      <Box
                        h='1rem'
                        fill='blue.400'
                        as='svg'
                        viewBox='0 0 22 22'
                        aria-label='Verified account'
                        role='img'
                        className='r-1cvl2hr r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-f9ja8p r-og9te1 r-bnwqim r-1plcrui r-lrvibr'
                        data-testid='icon-verified'
                      >
                        <g>
                          <path d='M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z'></path>
                        </g>
                      </Box>
                    </Box>
                  )}
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
                  p='1rem'
                  fontSize={'1rem'}
                  icon={<FaEdit fontSize={'1.15rem'} />}
                >
                  Edit
                </MenuItem>

                <MenuItem
                  icon={<FaTrashAlt fontSize={'1.15rem'} />}
                  onClick={onConfirmModalOpen}
                  p='1rem'
                  fontSize={'1rem'}
                >
                  Delete
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardHeader>

      <CardBody pt='0' pb='1rem' as='main'>
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
            handleConfirmClick={handleDeletePost}
            isLoading={isPostDeleting}
          />
        )}

        <Text
          cursor='text'
          letterSpacing={{ base: 'mormal', md: 'wide' }}
          fontSize={{ base: '.9rem', md: '1.1rem' }}
        >
          {content}
        </Text>

        {!!imageUrl && (
          <Container
            w='full'
            // minH='20rem'
            h='fit-content'
            mt={'.75rem'}
            p='0'
            borderRadius='md'
            overflow={'hidden'}
          >
            {!imageUrl.includes('.mp4') ? (
              <Image
                loading='lazy'
                objectFit='cover'
                w='full'
                h='full'
                bg={'#fff'}
                src={imageUrl}
                alt='post image'
              />
            ) : (
              <video controls src={imageUrl} />
            )}
          </Container>
        )}
        {/* </ChakraLink> */}
      </CardBody>

      <CardFooter
        py={{ base: '.5rem' }}
        px='0.35rem'
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
            isLoading={isLikeLoading || isUnlikeLoading}
            color={isLikedByMainUser ? 'red' : 'inherit'}
            variant='ghost'
            aria-label='Like Unlike Toggle'
            cursor='pointer'
            borderRadius='50%'
            fontSize={{ base: '1rem', md: '1.25rem' }}
            w='2rem'
            _hover={{ bg: 'transparent' }}
            _loading={{ color: 'gray' }}
          >
            <Icon as={isLikedByMainUser ? BsFillHeartFill : BsHeart} />
          </IconButton>

          {likeCount > 0 && <Text>{likeCount}</Text>}
        </Box>

        <ChakraLink
          as={Link}
          to={`/post/${postId}`}
          _hover={{ textDecoration: 'none' }}
          display='flex'
          alignItems='center'
          gap={{ base: '0', md: '.1rem' }}
        >
          <IconButton
            variant='ghost'
            aria-label='Comment'
            cursor='pointer'
            borderRadius='50%'
            bg='transparent'
            fontSize={{ base: '1rem', md: '1.25rem' }}
            w='2rem'
          >
            <Icon as={TfiComment} />
          </IconButton>

          {comments.length > 0 && <Text>{comments.length}</Text>}
        </ChakraLink>

        <IconButton
          onClick={toggleBookmark}
          color={isBookmarkedLocal ? 'green' : 'inherit'}
          variant='ghost'
          aria-label='Bookmark Unbookmark Toggle'
          cursor='pointer'
          borderRadius='50%'
          bg='transparent'
          fontSize={{ base: '1rem', md: '1.25rem' }}
          w='2rem'
          _hover={{ bg: 'transparent' }}
        >
          <Icon as={isBookmarkedLocal ? BsFillBookmarkFill : BsBookmark} />
        </IconButton>

        <Spacer />

        <IconButton
          onClick={handleCopyToClipboard}
          variant='ghost'
          aria-label='Copy Post Url to Clipboard'
          boxSize={6}
          cursor='pointer'
          borderRadius='50%'
          p='1.15rem'
          bg='transparent'
          fontSize={{ base: '1rem', md: '1.25rem' }}
        >
          <Icon as={HiShare} />
        </IconButton>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
