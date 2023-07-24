import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  Spacer,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import UserHeader from './UserHeader';
import EmojiPopover from './EmojiPopover';
import { useAddCommentMutation, useEditCommentMutation } from '../store/api';
import { showToast } from '../utils/utils';
import { LIMIT, TOAST_TYPE } from '../constants';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CommentForm = ({
  isAddingAndMainUserInfo,
  isEditingAndCommentData,
  postAuthorId,
  clearActiveCommentId,
}) => {
  const mainUserId = useSelector((store) => store.auth.mainUserId);
  const { postId: postIdFromParam } = useParams();

  const toast = useToast();

  const [comment, setComment] = useState(
    isAddingAndMainUserInfo ? '' : isEditingAndCommentData.comment
  );
  const trimmedComment = comment.trim();

  const [addComment, { isLoading: isCommentAdding }] = useAddCommentMutation();
  const [editComment] = useEditCommentMutation();

  const limitAsPerVerifiedStatus =
    isAddingAndMainUserInfo?.verified || isEditingAndCommentData?.user?.verified
      ? LIMIT.VERIFIED_CONTENT_LIMIT
      : LIMIT.CONTENT_LIMIT;

  const isCommentContentOverLimit = comment.length > limitAsPerVerifiedStatus;

  const handleAddComment = async () => {
    if (!trimmedComment) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Please fill the reply input',
      });

      return;
    }

    if (isCommentContentOverLimit) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Comment content is over limit',
      });
      return;
    }

    try {
      const { message } = await addComment({
        postId: postIdFromParam,
        comment: trimmedComment,
      }).unwrap();

      setComment('');

      showToast({
        toast,
        type: TOAST_TYPE.Success,
        message,
      });
    } catch (error) {
      console.error(error.message);
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: error.message,
      });
    }
  };

  const handleEditComment = async () => {
    const isCommentNotToUpdate =
      trimmedComment === isEditingAndCommentData.comment;

    if (!trimmedComment) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Please fill the reply input',
      });

      return;
    }

    if (isCommentNotToUpdate) {
      clearActiveCommentId();
      return;
    }

    if (isCommentContentOverLimit) {
      showToast({
        toast,
        type: TOAST_TYPE.Error,
        message: 'Comment content is over limit',
      });
      return;
    }

    // optimistic
    showToast({
      toast,
      type: TOAST_TYPE.Success,
      message: 'Comment Edited Successfully',
    });

    try {
      clearActiveCommentId();
      await editComment({
        postAuthorId,
        postId: postIdFromParam,
        mainUserId,
        commentInfo: {
          comment: trimmedComment,
          commentId: isEditingAndCommentData._id,
        },
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
    <Card as='form' p='.5rem .75rem' boxShadow={'md'} m='0'>
      <CardHeader p='0' mb='.5rem'>
        <UserHeader
          user={isAddingAndMainUserInfo || isEditingAndCommentData.user}
        />
      </CardHeader>

      <CardBody p='0' mb='.5rem'>
        <FormControl>
          <Textarea
            fontSize={{ base: '.85rem', md: '1rem' }}
            value={comment}
            placeholder='Reply'
            onChange={(e) => setComment(e.target.value)}
            letterSpacing={{ base: 'wider', md: 'widest' }}
            h='2rem'
            pl='.5rem'
            overflow={'auto'}
            _disabled={{ cursor: 'text' }}
            isDisabled={isCommentAdding}
            resize='none'
          />
        </FormControl>
      </CardBody>

      <CardFooter
        p='0'
        py='.25rem'
        display={'flex'}
        alignItems={'center'}
        gap='0 .5rem'
        flexWrap={{ base: 'wrap', md: 'nowrap' }}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={{ base: 'space-between' }}
          gap='0 .5rem'
          w={{ base: 'full', md: 'fit-content' }}
        >
          <Text
            letterSpacing={'wide'}
            fontSize={{ base: '.85rem', md: '1rem' }}
          >
            <Box
              as={'span'}
              color={isCommentContentOverLimit ? 'red.400' : 'inherit'}
            >
              {comment.length}
            </Box>{' '}
            / {limitAsPerVerifiedStatus}
          </Text>
        </Box>

        <Spacer />

        {!!isAddingAndMainUserInfo && (
          <Button
            colorScheme='blue'
            borderRadius={'full'}
            px={{ base: '1rem', md: '1.2rem' }}
            onClick={handleAddComment}
            isLoading={isCommentAdding}
          >
            Reply
          </Button>
        )}

        {!!isEditingAndCommentData && (
          <Box
            as='div'
            display={'flex'}
            gap='0 .5rem'
            justifyContent={'space-between'}
            width={{ base: '100%', md: 'fit-content' }}
          >
            <Button
              px={{ base: '1rem', md: '1.2rem' }}
              onClick={clearActiveCommentId}
              borderRadius={'full'}
            >
              Cancel
            </Button>{' '}
            <Button
              px={{ base: '1rem', md: '1.2rem' }}
              onClick={handleEditComment}
              borderRadius={'full'}
              colorScheme='blue'
            >
              Save
            </Button>
          </Box>
        )}
      </CardFooter>
    </Card>
  );
};

export default CommentForm;
