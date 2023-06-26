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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {
  BsBookmark,
  BsThreeDotsVertical,
  BsHeart,
  BsFillHeartFill,
  BsFillBookmarkFill,
} from 'react-icons/bs';
import { TfiComment } from 'react-icons/tfi';
import { HiShare } from 'react-icons/hi';
import { getCreatedDate } from '../utils/utils';
import { useAppSelector } from '../store/store-hooks';
import { PostModal } from '.';
import ConfirmModal from './ConfirmModal';
import { MODAL_TEXT_TYPE } from '../constants';

const PostCard = ({ postData, isBookmarkedByMainUser = false }) => {
  const mainUserId = useAppSelector((store) => store.auth.mainUserId);

  const {
    _id,
    likes: { likeCount },
    author: { _id: authorId, firstName, lastName, username, pic },
    content,
    imageUrl,
    createdAt,
    isLikedByMainUser,
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

  const isPostByMainUser = mainUserId === authorId;

  const handleCopyToClipboard = () => {
    // navigator.clipboard.writeText()
    console.log('copy');
  };

  return (
    <Card boxShadow='md' cursor='default'>
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
            isDeletingPostAndPostId={_id}
          />
        )}

        <ChakraLink
          as={Link}
          to={`/post/${_id}`}
          _hover={{ textDecoration: 'none' }}
        >
          <Text
            letterSpacing={{ base: 'mormal', md: 'wide' }}
            fontSize={{ base: '.9rem', md: '1.1rem' }}
          >
            {content}
          </Text>
        </ChakraLink>
      </CardBody>

      {!!imageUrl && !imageUrl.includes('.mp4') && (
        <Container w='full' minH='20rem' h='fit-content' pb='.5rem'>
          <Image
            borderRadius='md'
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
            variant='ghost'
            aria-label='Like Unlike Toggle'
            cursor='pointer'
            borderRadius='50%'
            bg='transparent'
            fontSize={{ base: '1rem', md: '1.25rem' }}
            w='2rem'
            color={isLikedByMainUser ? 'red' : 'inherit'}
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
          variant='ghost'
          aria-label='Like Unlike Toggle'
          cursor='pointer'
          borderRadius='50%'
          bg='transparent'
          fontSize={{ base: '1rem', md: '1.25rem' }}
          w='2rem'
          color={isBookmarkedByMainUser ? 'green' : 'inherit'}
        >
          <Icon as={isBookmarkedByMainUser ? BsFillBookmarkFill : BsBookmark} />
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
