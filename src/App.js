import { useState } from "react";
import {
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

  useGetPostsQuery,
  useCreatePostsMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./services/posts"; 

function App() {
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editingPost, setEditingPost] = useState(null);

  // --- RTK Query Hooks ---
  const { data, error, isLoading } = useGetPostsQuery();
  const [createPost, { isLoading: isCreating, error: createError }] =
    useCreatePostsMutation();
  
  // ✅ FIX: Removed stray underscore from this line
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // --- Loading and Error Handling ---
  if (isLoading) return <p>Loading...</p>;
  if (createError) return <p>Error occurred while creating post</p>;
  if (error) return <p>Error occurred</p>;
  const posts = data;

  // --- Event Handlers ---

  const handleCreatePost = async () => {
    if (newPost.title && newPost.body) {
      try {
        await createPost(newPost).unwrap();
        setNewPost({ title: "", body: "" });
      } catch (err) {
        console.error("Failed to create post: ", err);
      }
    }
  };

  const handleUpdatePost = async () => {
    if (editingPost) {
      try {
        await updatePost(editingPost).unwrap();
        setEditingPost(null); 
      } catch (err) {
        console.error("Failed to update post: ", err);
      }
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id).unwrap();
    } catch (err) {
      console.error("Failed to delete post: ", err);
    }
  };

  // 
  // ✨ THIS IS THE MISSING FUNCTION ✨
  // Handler for changes in the "Edit Form"
  //
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditingPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <h1>Redux-ToolKit Query</h1>

      {/* --- SECTION 1: EDIT FORM --- */}
      {editingPost && (
        <div style={{ marginBottom: "20px", border: "1px solid blue", padding: "10px" }}>
          <h3>Edit Post (ID: {editingPost.id})</h3>
          <input
            type="text"
            placeholder="Edit title"
            name="title"
            value={editingPost.title}
            onChange={handleEditFormChange} // This now works
          />
          <input
            type="text" 
            placeholder="Edit body"
            name="body"
            value={editingPost.body}
            onChange={handleEditFormChange} // This now works
          />
          <button onClick={handleUpdatePost} disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Update"}
          </button>
          <button onClick={() => setEditingPost(null)} disabled={isUpdating}>
            Cancel
          </button>
        </div>
      )}

      {/* --- SECTION 2: CREATE FORM --- */}
      {!editingPost && (
        <div style={{ marginBottom: "20px", border: "1px solid green", padding: "10px" }}>
          <h3>Create New Post</h3>
          <input
            type="text"
            placeholder="Enter post title"
            id="title"
            value={newPost.title} 
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <input
            type="text" 
            placeholder="Enter post body"
            id="body"
            value={newPost.body} 
            onChange={(e) =>
              setNewPost((prev) => ({ ...prev, body: e.target.value }))
            }
          />
          <button onClick={handleCreatePost} disabled={isCreating}>
            {isCreating ? "Creating..." : "Create Post"}
          </button>
        </div>
      )}

      {/* --- SECTION 3: POSTS LIST --- */}
      <hr />
      <div>
        <h2>All Posts</h2>
        {/* Use slice to show only first 10, as JSONPlaceholder returns 100 */}
        {posts.slice(0, 10).map((post) => (
          <div
            key={post.id}
            style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}
          >
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            
            <button
              onClick={() => setEditingPost(post)}
              disabled={isUpdating || isDeleting || !!editingPost}
            >
              Edit
            </button>
            <button
              onClick={() => handleDeletePost(post.id)}
              disabled={isUpdating || isDeleting} 
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
