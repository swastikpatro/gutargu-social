import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { URL } from '../constants';
import { isFoundInList, isIncludedInList } from '../utils/utils';

const fetchBaseQueryWithToken = fetchBaseQuery({
  baseUrl: `${URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set('authorization', token);
    }

    return headers;
  },

  validateStatus: (response) =>
    response.status >= 200 && response.status <= 299,
});

export const api = createApi({
  baseQuery: fetchBaseQueryWithToken,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  reducerPath: 'socialApi',
  tagTypes: ['Post', 'User'],
  endpoints: (builder) => ({
    // inside this list of posts, every single post contains a likedBy array that has a list of string (id's) that liked that post.
    getAllPosts: builder.query({
      query: () => '/post',
      transformResponse: (response, meta, mainUserId) => {
        return response.posts.map((post) => ({
          ...post,
          isLikedByMainUser: isIncludedInList({
            list: post.likes.likedBy,
            idToBeChecked: mainUserId,
          }),
        }));
      },
      providesTags: (results, error, mainUserId) => {
        return results
          ? [
              { type: 'Post', id: 'LIST' },
              ...results.map(({ _id }) => ({
                type: 'Post',
                id: _id,
              })),
            ]
          : [{ type: 'Post', id: 'LIST' }];
      },
    }),

    // inside this list of posts, every single post contains a likedBy array that has a list of string (id's) that liked that post.
    getAllPostsOfAUser: builder.query({
      query: ({ id: userId }) => `/user/all-posts/${userId}`,
      transformResponse: (response, meta, { id: userId, mainUserId }) => {
        return response.posts.map((post) => ({
          ...post,
          isLikedByMainUser: isFoundInList({
            list: post.likes.likedBy,
            idToBeChecked: mainUserId,
          }),
        }));
      },

      providesTags: (results, error, { id, mainUserId }) => {
        const resultsIds = results.map(({ _id }) => ({
          type: 'Post',
          id: _id,
        }));

        if (id === mainUserId)
          return [...resultsIds, { type: 'Post', id: 'LIST' }];

        return [...resultsIds];
      },
    }),

    getBookmarkPosts: builder.query({
      query: () => `/post/bookmark`,
      transformResponse: (response, meta, mainUserId) => {
        return response.bookmarks.map((post) => ({
          ...post,
          isLikedByMainUser: isIncludedInList({
            list: post.likes.likedBy,
            idToBeChecked: mainUserId,
          }),
        }));
      },

      providesTags: (results) => {
        return [
          ...results.map(({ _id }) => ({
            type: 'Post',
            id: _id,
          })),
        ];
      },
    }),

    //  this single post has a property likes, but in likedBy there is object's of those users who liked it.. (thats why findIndex and not includes)
    getSinglePost: builder.query({
      query: ({ id: postId }) => `/post/${postId}`,
      transformResponse: (response, meta, { mainUserId }) => {
        const isMainUserInLikedList = isFoundInList({
          list: response.post.likes.likedBy,
          idToBeChecked: mainUserId,
        });

        return {
          ...response.post,
          isLikedByMainUser: isMainUserInLikedList,
        };
      },
      // mainUserId and id are args to the query
      providesTags: (results, error, arg) => {
        return [{ type: 'Post', id: arg.id }];
      },
    }),

    // isMainUserFollowing prop for Home paged Feed posts
    getAllUsers: builder.query({
      query: () => '/user',
      transformResponse: (response, meta, mainUserId) => {
        return response.users.map((user) => ({
          ...user,
          isMainUserFollowing: isIncludedInList({
            list: user.followers,
            idToBeChecked: mainUserId,
          }),
        }));
      },
      providesTags: (results) =>
        results
          ? [
              { type: 'User', id: 'LIST' },
              ...results.map((_id) => ({
                type: 'User',
                id: _id,
              })),
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),

    // this contains bookmarks prop for mainUser and but not for other users, so handled it.
    getSingleUserDetails: builder.query({
      query: ({ id: userId }) => `/user/${userId}`,
      transformResponse: (response, meta, { id: userId, mainUserId }) => {
        if (userId !== mainUserId) {
          const isMainUserInFollowersList = isFoundInList({
            list: response.user.followers,
            idToBeChecked: mainUserId,
          });
          const isUserFollowingMainUser = isFoundInList({
            list: response.user.following,
            idToBeChecked: mainUserId,
          });

          return {
            ...response.user,
            isMainUserFollowing: isMainUserInFollowersList,
            isFollowingMainUser: isUserFollowingMainUser,
          };
        }

        const bookmarkedPostIds = {};
        const idsOfUsersFollowingMainUser = {};

        response.user.bookmarks.forEach((bookmarkId) => {
          bookmarkedPostIds[bookmarkId] = true;
        });

        response.user.following.forEach(({ _id: userId }) => {
          idsOfUsersFollowingMainUser[userId] = true;
        });

        return {
          ...response.user,
          bookmarkedPostIds,
          followingIds: idsOfUsersFollowingMainUser,
        };
      },
      providesTags: (result, error, arg) => {
        return [{ type: 'User', id: arg.id }];
      },
    }),

    addNewPost: builder.mutation({
      query: (body) => ({
        url: '/post',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),

    editPost: builder.mutation({
      query: ({ postIdToUpdate, ...body }) => ({
        url: `/post/${postIdToUpdate}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Post', id: arg.postIdToUpdate }];
      },
    }),

    deletePost: builder.mutation({
      query: ({ postIdToDelete }) => ({
        url: `/post/${postIdToDelete}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => {
        return [{ type: 'Post', id: arg.postIdToDelete }];
      },
    }),

    likePost: builder.mutation({
      query: ({ postData: { _id: postIdToLike } }) => ({
        url: '/post/like',
        method: 'POST',
        body: {
          postId: postIdToLike,
        },
      }),
      // async onQueryStarted(
      //   { postData, mainUserId },
      //   { dispatch, queryFulfilled }
      // ) {
      //   const updatePostLike = ({ listOfPosts }) => {
      //     const postToUpdateOptimistic = listOfPosts.find(
      //       (post) => post._id === postData._id
      //     );
      //     if (
      //       postToUpdateOptimistic &&
      //       !postToUpdateOptimistic.isLikedByMainUser
      //     ) {
      //       postToUpdateOptimistic.isLikedByMainUser = true;
      //       postToUpdateOptimistic.likes.likeCount += 1;
      //     }
      //   };

      //   const likeResultForAllPosts = dispatch(
      //     api.util.updateQueryData('getAllPosts', mainUserId, (draft) =>
      //       updatePostLike({ listOfPosts: draft })
      //     )
      //   );

      //   const likeResultForAllPostsOfAUser = dispatch(
      //     api.util.updateQueryData(
      //       'getAllPostsOfAUser',
      //       { id: postData.author._id, mainUserId },
      //       (draft) => updatePostLike({ listOfPosts: draft })
      //     )
      //   );

      //   const likeResultForSinglePost = dispatch(
      //     api.util.updateQueryData(
      //       'getSinglePost',
      //       { id: postData._id, mainUserId },
      //       (draft) => {
      //         if (!draft.isLikedByMainUser) {
      //           draft.isLikedByMainUser = true;
      //           draft.likes.likeCount += 1;
      //         }
      //       }
      //     )
      //   );

      //   const likeResultForBookmarkPosts = dispatch(
      //     api.util.updateQueryData('getBookmarkPosts', mainUserId, (draft) =>
      //       updatePostLike({ listOfPosts: draft })
      //     )
      //   );

      //   try {
      //     await queryFulfilled;
      //   } catch (error) {
      //     likeResultForAllPosts.undo();
      //     likeResultForAllPostsOfAUser.undo();
      //     likeResultForSinglePost.undo();
      //     likeResultForBookmarkPosts.undo();
      //   }
      // },
      invalidatesTags: (result, error, { postData: { _id } }) => [
        { type: 'Post', id: _id },
        { type: 'Post', id: 'LIST' },
      ],
    }),

    unlikePost: builder.mutation({
      query: ({ postData: { _id: postIdToUnlike } }) => ({
        url: '/post/dislike',
        method: 'POST',
        body: {
          postId: postIdToUnlike,
        },
      }),
      // async onQueryStarted(
      //   { postData, mainUserId },
      //   { dispatch, queryFulfilled }
      // ) {
      //   const updatePostUnlike = ({ listOfPosts }) => {
      //     const postToUpdateOptimistic = listOfPosts.find(
      //       (post) => post._id === postData._id
      //     );
      //     if (
      //       postToUpdateOptimistic &&
      //       postToUpdateOptimistic.isLikedByMainUser
      //     ) {
      //       postToUpdateOptimistic.isLikedByMainUser = false;
      //       postToUpdateOptimistic.likes.likeCount -= 1;
      //     }
      //   };

      //   const unlikeResultForAllPosts = dispatch(
      //     api.util.updateQueryData('getAllPosts', mainUserId, (draft) =>
      //       updatePostUnlike({ listOfPosts: draft })
      //     )
      //   );

      //   const unlikeResultForAllPostsOfAUser = dispatch(
      //     api.util.updateQueryData(
      //       'getAllPostsOfAUser',
      //       { id: postData.author._id, mainUserId },
      //       (draft) => updatePostUnlike({ listOfPosts: draft })
      //     )
      //   );

      //   const unlikeResultForSinglePost = dispatch(
      //     api.util.updateQueryData(
      //       'getSinglePost',
      //       { id: postData._id, mainUserId },
      //       (draft) => {
      //         if (draft.isLikedByMainUser) {
      //           draft.isLikedByMainUser = false;
      //           draft.likes.likeCount -= 1;
      //         }
      //       }
      //     )
      //   );

      //   const unlikeResultForBookmarkPosts = dispatch(
      //     api.util.updateQueryData('getBookmarkPosts', mainUserId, (draft) =>
      //       updatePostUnlike({ listOfPosts: draft })
      //     )
      //   );

      //   try {
      //     await queryFulfilled;
      //   } catch (error) {
      //     unlikeResultForAllPosts.undo();
      //     unlikeResultForAllPostsOfAUser.undo();
      //     unlikeResultForSinglePost.undo();
      //     unlikeResultForBookmarkPosts.undo();
      //   }
      // },
      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postData._id },
        { type: 'Post', id: 'LIST' },
      ],
    }),

    bookmarkPost: builder.mutation({
      query: ({ postData: { _id: postIdToBookmark } }) => ({
        url: `/post/bookmark/${postIdToBookmark}`,
        method: 'POST',
      }),
      onQueryStarted: async (
        { postData, mainUserId },
        { dispatch, queryFulfilled }
      ) => {
        const bookmarkResult = dispatch(
          api.util.updateQueryData(
            'getSingleUserDetails',
            { id: mainUserId, mainUserId },
            (draft) => {
              draft.bookmarkedPostIds[postData._id] = true;
            }
          )
        );

        const bookmarkResultForBookmarkPosts = dispatch(
          api.util.updateQueryData('getBookmarkPosts', mainUserId, (draft) => {
            draft.push(postData);
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          bookmarkResult.undo();
          bookmarkResultForBookmarkPosts.undo();
        }
      },
    }),

    unbookmarkPost: builder.mutation({
      query: ({ postIdToUnBookmark }) => ({
        url: `/post/bookmark/${postIdToUnBookmark}`,
        method: 'DELETE',
      }),
      onQueryStarted: async (
        { postIdToUnBookmark, mainUserId },
        { dispatch, queryFulfilled }
      ) => {
        const unbookmarkResult = dispatch(
          api.util.updateQueryData(
            'getSingleUserDetails',
            { id: mainUserId, mainUserId },
            (draft) => {
              if (draft.bookmarkedPostIds) {
                delete draft.bookmarkedPostIds[postIdToUnBookmark];
              }
            }
          )
        );

        const unbookmarkResultForBookmarkPosts = dispatch(
          api.util.updateQueryData('getBookmarkPosts', mainUserId, (draft) => {
            const postIndexToUnbookmarkOptimistic = draft.findIndex(
              ({ _id }) => _id === postIdToUnBookmark
            );
            if (postIndexToUnbookmarkOptimistic !== -1) {
              draft.splice(postIndexToUnbookmarkOptimistic, 1);
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          unbookmarkResult.undo();
          unbookmarkResultForBookmarkPosts.undo;
        }
      },
    }),
    followUser: builder.mutation({
      query: ({ followId }) => ({
        url: '/user/follow',
        method: 'POST',
        body: {
          followId,
        },
      }),
      invalidatesTags: (result, error, { followId, mainUserId }) => {
        return [
          { type: 'User', id: mainUserId },
          { type: 'User', id: 'LIST' },
          { type: 'User', id: followId },
        ];
      },
    }),
    unfollowUser: builder.mutation({
      query: ({ unfollowId }) => ({
        url: '/user/unfollow',
        method: 'POST',
        body: {
          unfollowId,
        },
      }),
      invalidatesTags: (result, error, { unfollowId, mainUserId }) => [
        { type: 'User', id: mainUserId },
        { type: 'User', id: 'LIST' },
        { type: 'User', id: unfollowId },
      ],
    }),

    updateUser: builder.mutation({
      query: ({ mainUserId, ...body }) => ({
        url: '/user/update',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, body) => [
        { type: 'User', id: body.mainUserId },
      ],
    }),

    addComment: builder.mutation({
      query: ({ postId, comment }) => ({
        url: `/post/comment/${postId}`,
        method: 'POST',
        body: {
          comment,
        },
      }),

      invalidatesTags: (result, error, arg) => [
        { type: 'Post', id: arg.postId },
        { type: 'Post', id: 'LIST' },
      ],
    }),

    editComment: builder.mutation({
      query: ({ postId, commentInfo }) => ({
        url: `/post/comment/${postId}`,
        method: 'PATCH',
        body: {
          ...commentInfo,
        },
      }),
      // commentInfo : {
      //   commentId,
      //   comment
      // }

      async onQueryStarted(
        { commentInfo, mainUserId, postId, postAuthorId },
        { dispatch, queryFulfilled }
      ) {
        const updatePostWithComment = ({ listOfPosts }) => {
          const postToUpdateOptimistic = listOfPosts.find(
            (post) => post._id === postId
          );

          const commentInThatPost = postToUpdateOptimistic?.comments.find(
            (comment) => comment._id === commentInfo.commentId
          );
          if (postToUpdateOptimistic && commentInThatPost) {
            commentInThatPost.comment = commentInfo.comment;
          }
        };

        const editCommentForAllPosts = dispatch(
          api.util.updateQueryData('getAllPosts', mainUserId, (draft) =>
            updatePostWithComment({ listOfPosts: draft })
          )
        );

        const editCommentForAllPostsOfAUser = dispatch(
          api.util.updateQueryData(
            'getAllPostsOfAUser',
            { id: postAuthorId, mainUserId },
            (draft) => ({ listOfPosts: draft })
          )
        );

        const editCommentForSinglePost = dispatch(
          api.util.updateQueryData(
            'getSinglePost',
            { id: postId, mainUserId },
            (draft) => {
              const commentToEdit = draft.comments.find(
                (comment) => comment._id === commentInfo.commentId
              );

              if (commentToEdit) {
                commentToEdit.comment = commentInfo.comment;
              }
            }
          )
        );

        const editCommentForBookmarkPosts = dispatch(
          api.util.updateQueryData('getBookmarkPosts', mainUserId, (draft) =>
            updatePostWithComment({ listOfPosts: draft })
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          editCommentForAllPosts.undo();
          editCommentForAllPostsOfAUser.undo();
          editCommentForSinglePost.undo();
          editCommentForBookmarkPosts.undo();
        }
      },
    }),

    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: '/post/comment/delete-comment',
        method: 'POST',
        body: {
          postId,
          commentId,
        },
      }),

      async onQueryStarted(
        { commentId, mainUserId, postId, postAuthorId },
        { dispatch, queryFulfilled }
      ) {
        const updatePostWithComment = ({ listOfPosts }) => {
          const postToUpdateOptimistic = listOfPosts.find(
            (post) => post._id === postId
          );

          const commentIndexInThatPost =
            postToUpdateOptimistic?.comments.findIndex(
              (comment) => comment._id === commentId
            );

          if (postToUpdateOptimistic && commentIndexInThatPost !== -1) {
            postToUpdateOptimistic.comments.splice(commentIndexInThatPost, 1);
          }
        };

        const deleteCommentForAllPosts = dispatch(
          api.util.updateQueryData('getAllPosts', mainUserId, (draft) =>
            updatePostWithComment({ listOfPosts: draft })
          )
        );

        const deleteCommentForAllPostsOfAUser = dispatch(
          api.util.updateQueryData(
            'getAllPostsOfAUser',
            { id: postAuthorId, mainUserId },
            (draft) => ({ listOfPosts: draft })
          )
        );

        const deleteCommentForSinglePost = dispatch(
          api.util.updateQueryData(
            'getSinglePost',
            { id: postId, mainUserId },
            (draft) => {
              const indexOfCommentToDelete = draft.comments.findIndex(
                (comment) => comment._id === commentId
              );

              if (indexOfCommentToDelete !== -1) {
                draft.comments.splice(indexOfCommentToDelete, 1);
              }
            }
          )
        );

        const deleteCommentForBookmarkPosts = dispatch(
          api.util.updateQueryData('getBookmarkPosts', mainUserId, (draft) =>
            updatePostWithComment({ listOfPosts: draft })
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          deleteCommentForAllPosts.undo();
          deleteCommentForAllPostsOfAUser.undo();
          deleteCommentForSinglePost.undo();
          deleteCommentForBookmarkPosts.undo();
        }
      },
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetAllPostsOfAUserQuery,
  useGetBookmarkPostsQuery,
  useGetSinglePostQuery,
  useGetAllUsersQuery,
  useGetSingleUserDetailsQuery,
  useAddNewPostMutation,
  useEditPostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useBookmarkPostMutation,
  useUnbookmarkPostMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useUpdateUserMutation,
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
} = api;
