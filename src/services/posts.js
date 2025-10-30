import { jsonPlaceholderApi } from "./jsonPlaceholderApi";

export const postsService = jsonPlaceholderApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query({ query: () => "posts" }),

    createPosts: builder.mutation({
      query: (newPost) => ({
        url: "posts",
        method: "POST",
        body: newPost,
      }),
    }), 

    deletePost: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      })
    }), 

    updatePost: builder.mutation({
      query: ({ id, ...updatedPost }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: updatedPost,
      }),
    })
    }),
});

export const { 
  useGetPostsQuery, 
  useLazyGetPostsQuery,
  useCreatePostsMutation, 
  useUpdatePostMutation, 
  useDeletePostMutation 
} = postsService;