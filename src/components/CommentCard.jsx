import {
  Box,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import UserHeader from './UserHeader';
import { getCreatedDate, showToast } from '../utils/utils';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { MODAL_TEXT_TYPE, TOAST_TYPE } from '../constants';
import ConfirmModal from './ConfirmModal';
import { useParams } from 'react-router-dom';
import { useDeleteCommentMutation } from '../store/api';

const CommentCard = ({ commentData, updateActiveCommentId, postAuthorId }) => {
  const { postId: postIdFromParam } = useParams();

  const mainUserId = useSelector((store) => store.auth.mainUserId);

  const toast = useToast();
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onClose: onConfirmModalClose,
  } = useDisclosure();

  const { _id: commentId, user, comment, createdAt } = commentData;

  const isCommentByMainUser = mainUserId === user._id;
  const [deleteComment] = useDeleteCommentMutation();

  const handleDeleteComment = async () => {
    showToast({
      toast,
      type: TOAST_TYPE.Success,
      message: 'Deleted Comment Successfully',
    });

    try {
      await deleteComment({
        postAuthorId,
        postId: postIdFromParam,
        mainUserId,
        commentId,
      }).unwrap();
    } catch (error) {
      console.error(error.message);
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: error.message,
      });
    }
  };

  return (
    <Card p='.5rem .75rem' boxShadow={'md'}>
      <CardHeader display={'flex'} gap='.5rem' p='0'>
        <Box display={'flex'} flexWrap={'wrap'} gap='0 .5rem'>
          <UserHeader user={user} />
          <Text
            m='auto'
            mt='.25rem'
            fontSize={{ base: '.7rem', md: '.8rem' }}
            letterSpacing='wider'
            color={'gray'}
            fontWeight={'semibold'}
          >
            {getCreatedDate(createdAt)}
          </Text>
        </Box>

        <Spacer />

        {isCommentByMainUser && (
          <Menu>
            <MenuButton
              variant='ghost'
              colorScheme='gray'
              borderRadius='50%'
              aria-label='Options'
              as={IconButton}
              icon={<BsThreeDotsVertical />}
            />
            <MenuList minW='10rem' p='0' boxShadow='xl' zIndex={12}>
              <MenuItem
                onClick={() => updateActiveCommentId(commentId)}
                p='1rem'
                fontSize={'1rem'}
                icon={<FaEdit fontSize={'1.15rem'} />}
              >
                Edit
              </MenuItem>

              {isConfirmModalOpen && (
                <ConfirmModal
                  isOpen={isConfirmModalOpen}
                  onClose={onConfirmModalClose}
                  modalText={MODAL_TEXT_TYPE.DELETE_COMMENT}
                  handleConfirmClick={handleDeleteComment}
                  isLoading={false}
                />
              )}

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
      </CardHeader>

      <CardBody p='0' my={'.75rem'}>
        <Text
          fontSize={{ base: '.85rem', md: '1rem' }}
          letterSpacing={{ base: 'wider', md: 'widest' }}
        >
          {comment}
        </Text>
      </CardBody>
    </Card>
  );
};

export default CommentCard;
