import React, { useState, useCallback, useContext } from "react";
import { Button } from 'react-bootstrap';
import AuthContext from "../store/authContext";
// You can find your Page ID
// in the "About" section of your page on Facebook.
const PAGE_ID = "101936396058752";

function Login() {
  const ctxAuth = useContext(AuthContext);
  // Initializes the Facebook SDK

  // App state

  const [postText, setPostText] = useState();
	const [error, setErrors] = useState([])
  const [isPublishing, setIsPublishing] = useState(false);

  // Logs in a Facebook user
  const logInToFB = useCallback(() => {
    window.FB.login((response) => {
      let na = ""
      let fbus=""
      let fbpg=""
      fbus=response.authResponse.accessToken
			if (response.authResponse) {
				window.FB.api('/me', function(response) {
          na=response.name
          window.FB.api(
            `/${PAGE_ID}?fields=access_token&access_token=${ctxAuth.fbUserAccessToken}`,
            ({ access_token }) => {
              fbpg = access_token
              ctxAuth.login(na, fbus, fbpg);
            }
          );
				});
			 } else {
				setErrors(prevState => [...prevState, 'User cancelled login or did not fully authorize.'])
			 }
    },
    {
      config_id: '156056103964571', // configuration ID goes here
      response_type: 'code'   // must be set to 'code' for SUAT
    } 
    );
  }, []);

  // Logs out the current Facebook user
  const logOutOfFB = useCallback(() => {
    ctxAuth.logout()
  }, []);

  // Publishes a post on the Facebook page
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

  // Publishes a post on the Facebook page
  const deletePostToPage = () => {

    var postId = '213394838243041';
    window.FB.api(`${PAGE_ID}_${postId}`, 'delete',{
      access_token: ctxAuth.fbPageAccessToken,
    }, function(response) {
      if (!response || response.error) {
        console.log(response)
        alert('Error occured');
      } else {
        alert('Post was deleted');
      }
    });
  };

  // UI with custom styling from ./styles.css`
  return (
    <div id="app">
      <header className="text-center">
        <h1 id="logo-text">Facebook Posts Manager</h1>
				<p className="text-danger">{error}</p>
        {ctxAuth.fbUserAccessToken ? (
          <>
						Welcome <b>{ctxAuth.name}</b><br/>
            <Button onClick={logOutOfFB} variant="danger">
            Log out
            </Button>
          </>
        ) : (
          <>
						<Button onClick={logInToFB} variant="primary">
							Login with Facebook
						</Button>
					</>
        )}
      </header>
      <main id="app-main">
        {ctxAuth.fbPageAccessToken ? (
          <section className="app-section">
            <h3>Write something to the page</h3>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Message..."
              rows="8"
              disabled={isPublishing}
            />
            <button
              onClick={sendPostToPage}
              className="btn confirm-btn"
              disabled={!postText || isPublishing}
            >
              {isPublishing ? "Publishing..." : "Publish"}
            </button>
            <button
              onClick={deletePostToPage}
              className="btn confirm-btn"
              disabled={false}
            >
              Delete Post
            </button>
          </section>
        ) : (
          <></>
        )}
      </main>
    </div>
  );
}

export default Login;
