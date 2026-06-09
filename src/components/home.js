import React, { useState, useCallback, useEffect, useContext } from "react";
import AuthContext from "../store/authContext";
import { Button } from "react-bootstrap";

const PAGE_ID = "101936396058752";
function Home() {
	const [posts, setPosts] = useState([])
	const [addPost, setAddPost] = useState(false)
	const [postText, setPostText] = useState();
  const [isPublishing, setIsPublishing] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const ctxAuth = useContext(AuthContext);


	useEffect(() => {
		if (ctxAuth.fbPageAccessToken !=='' || deleted) {
			window.FB.api(
				`/${PAGE_ID}/feed?access_token=${ctxAuth.fbPageAccessToken}&limit=10`,
				function (response) {
					console.log("response", response)
					if (response && !response.error) {
						/* handle the result */
						setPosts(response.data)
						setDeleted(false)
					}
				}
			);
		}
  }, [ctxAuth.fbPageAccessToken, isPublishing, deleted]);

	const sendPostToPage = useCallback(() => {
    setIsPublishing(true);

    window.FB.api(
      `/${PAGE_ID}/feed`,
      "POST",
      {
        message: postText,
        access_token: ctxAuth.fbPageAccessToken,
      },
      () => {
        setPostText("");
        setIsPublishing(false);
      }
    );
  }, [postText, ctxAuth.fbPageAccessToken]);

	const deletePostToPage = (postId) => {

    window.FB.api(`${postId}`, 'delete',{
      access_token: ctxAuth.fbPageAccessToken,
    }, function(response) {
      if (!response || response.error) {
        console.log(response)
        alert('Error occured');
      } else {
				setDeleted(true)
        alert('Post was deleted');
      }
    });
  };


  return (
    <div id="app">
      <main id="app-main">
			{
				addPost ? 
				<form>
					<h3>Add Post</h3>
					<div className="mb-3">
						<textarea
							 value={postText}
							 onChange={(e) => setPostText(e.target.value)}
							 placeholder="Message..."
							 rows="8"
							 disabled={isPublishing}
						>
						</textarea>
					</div>
					<div className="">
						<button type="submit" 
						className="btn btn-success"
						disabled={!postText || isPublishing}
						onClick={sendPostToPage}
						>
							Submit Post
						</button>
						<Button variant="warning" onClick={()=> setAddPost(false)}>Show List</Button>
					</div>
				</form>
				:
				<table className="table">
					<thead>
						<tr>
							<th colSpan="2">Posts</th>
							<th colSpan="2"><Button variant="success" onClick={() => {setAddPost(true)}}>Add post</Button></th>
						</tr>
						<tr>
							<th scope="col">#</th>
							<th scope="col">Post Description</th>
							<th scope="col">Created</th>
							<th scope="col">Handle</th>
						</tr>
					</thead>
					<tbody>
							{posts.map((post, index) =>
								<tr key={index}>
									<td >{index + 1}</td>
									<td>{typeof post.message !== 'undefined' ? post.message : post.story}</td>
									<td>{post.created_time}</td>
									<td><Button variant="danger" onClick={() => deletePostToPage(post.id)}>Delete</Button></td>
								</tr>
							)}
					</tbody>
				</table>
			}
      </main>
    </div>
  );
}

export default Home;
