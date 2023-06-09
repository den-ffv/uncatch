import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../components/Post";
import BigPost from "../components/BigPost";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { useParams } from "react-router-dom";
import MiniPost from "../components/MiniPost";
import Loading from "../components/Loading";

function Category() {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const [isLoading, setLoading] = React.useState(true);
  const { tag } = useParams();
  const filteredTags = posts.items.filter((post) => {
    return post.tags.includes(tag);
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredTags.slice(indexOfFirstPost, indexOfLastPost);
  const showLoadMoreButton = currentPosts.length < filteredTags.length;

  const handleLoadMore = () => {
    setPostsPerPage(postsPerPage + 5);
  };

  useEffect(() => {
    dispatch(fetchTags(tag));
    dispatch(fetchPosts(tag));
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [dispatch, tag]);

  
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className='wrapper'>
          <h1 className='main-title'>{tag}</h1>
          <div className='cards-categoria'>
            <div className='carts'>
              {currentPosts.slice(0, 1).map((obj) => (
                <BigPost
                  key={obj._id}
                  idPost={obj._id}
                  title={obj.title}
                  text={obj.text}
                  img={
                    obj.imgeUrl
                      ? `https://uncatch-api.onrender.com${obj.imgeUrl}`
                      : ""
                  }
                  tag={obj.tags}
                  postDate={obj.createdAt}
                  user={obj.user.fullName}
                />
              ))}
            </div>
            <div className='carts'>
              {currentPosts.slice(1, 4).map((obj) => (
                <Post
                  key={obj._id}
                  idPost={obj._id}
                  title={obj.title}
                  text={obj.text}
                  img={
                    obj.imgeUrl
                      ? `https://uncatch-api.onrender.com${obj.imgeUrl}`
                      : ""
                  }
                  tag={obj.tags}
                  postDate={obj.createdAt}
                  user={obj.user.fullName}
                />
              ))}
            </div>
          </div>
          <div className='carts'>
            {currentPosts.slice(4).map((obj, index) => (
              <Post
                key={obj._id}
                idPost={obj._id}
                title={obj.title}
                text={obj.text}
                img={
                  obj.imgeUrl
                    ? `https://uncatch-api.onrender.com${obj.imgeUrl}`
                    : ""
                }
                tag={obj.tags}
                postDate={obj.createdAt}
              />
            ))}
            {showLoadMoreButton && (
              <div className='load-more-button'>
                <button onClick={handleLoadMore}>Дивитись більше</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Category;
