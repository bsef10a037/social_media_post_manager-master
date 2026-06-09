import React, { useState, useCallback, useContext } from "react";
import AuthContext from "../store/authContext";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PAGE_ID = "101936396058752";
function Home() {
	const navigate = useNavigate()
	const [postText, setPostText] = useState();
	const [isPublishing, setIsPublishing] = useState(false);
	const ctxAuth = useContext(AuthContext);


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



  return (
    <div id="app">
      <main id="app-main">
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
						<Button onClick={() => navigate("/home")} variant="warning">Show List</Button>
					</div>
				</form>
      </main>
    </div>
  );
}

export default Home;
