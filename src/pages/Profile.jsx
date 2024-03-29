import { useState, useEffect } from "react";
import "../style/Profile.scss";

import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../redux/slices/auth";
import { fetchAuthMe } from "../redux/slices/auth";
import { getSavedPosts } from "../redux/slices/posts";
import { useNavigate, Link } from "react-router-dom";
import SavePost from "../components/SavePost";
import axios from "../axios";
import { updateSavedPosts } from "../redux/slices/posts";
import Loading from "../components/Loading";

function Profile() {
  const dispatch = useDispatch();
  const histori = useNavigate();
  const user = useSelector((fetchAuthMe) => fetchAuthMe.auth.data);
  const isAuth = useSelector(selectIsAuth);
  const isAdmin = user && user.role === "admin";
  const [isLoading, setLoading] = useState(true);
  const savedPosts = useSelector((state) => state.posts.savedPosts);

  useEffect(() => {
    dispatch(getSavedPosts());
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dispatch]);

  const onClickLogout = () => {
    if (window.confirm("Do you really want to leave?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
      histori("/");
    }
  };

  const [deletingPostId, setDeletingPostId] = useState(null);
  const handleSavePost = async (postId) => {
    try {
      setDeletingPostId(postId);
      await axios.delete(`/posts/${postId}/remove`);
      setTimeout(() => {
        const updatedPosts = savedPosts.filter((post) => post._id !== postId);
        removePostFromLocalStorage(postId);
        dispatch(updateSavedPosts(updatedPosts));
        setDeletingPostId(null);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };
  const removePostFromLocalStorage = (postId) => {
    const savedPosts = JSON.parse(localStorage.getItem("savedPosts")) || [];
    const updatedSavedPosts = savedPosts.filter((id) => id !== postId);
    localStorage.setItem("savedPosts", JSON.stringify(updatedSavedPosts));
  };

  if (!window.localStorage.getItem("token") && !isAuth) {
    return histori("/");
  }

  return (
    <>
      {window.localStorage.getItem("token") && isLoading ? (
        <Loading />
      ) : (
        <div className='profile'>
          <div className='profile__warpper'>
            <div className='wrapper profile__header'>
              <h1 className='profile__title'>My Account</h1>
              <p>You are logged in as {user.email}</p>
              <button onClick={onClickLogout} className='exid-btn'>
                Exit
              </button>
              {isAdmin ? <Link to={"/add-post"}>add post</Link> : ""}
            </div>
            <div className='profile__user'>
              <div className='wrapper'>
                <div className='profile__content'>
                  <p className='profile__user-name'>{user.fullName}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='wrapper wrapper-save-pages-content'>
            <h2 className='wrapper-save-pages-content__title'>
              All Saved Stories
            </h2>

            {savedPosts.length === 0 ? (
              <p>You haven't saved any stories lately.</p>
            ) : (
              savedPosts.map((post) => (
                <SavePost
                  key={post._id}
                  idPost={post._id}
                  title={post.title}
                  text={post.text}
                  img={
                    post.imgeUrl
                      ? `https://uncatch-api.onrender.com${post.imgeUrl}`
                      : ""
                  }
                  tag={post.tags}
                  postDate={post.createdAt}
                  deletePost={() => handleSavePost(post._id)}
                  isDeleting={deletingPostId === post._id}
                />
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
export default Profile;
