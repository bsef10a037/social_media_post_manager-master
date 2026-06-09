import React, { useState, useEffect } from 'react';
import { useInitFbSDK } from "../hooks/fb-hooks";

const AuthContext = React.createContext({
	email:"",
	name:"",
	fbUserAccessToken:"",
	fbPageAccessToken:"",
	login: (na, us) => {},
	logout: () => {},
	signup: (obj) => {}
});
export default AuthContext;

export const AuthContextProvider = (props) => {

	const [authDataState, setauthDataState] = useState({email:"", name:"", fbUserAccessToken:"", fbPageAccessToken:""});

	const isFbSDKInitialized = useInitFbSDK();
  useEffect(() => {
		console.log("isFbSDKInitialized", isFbSDKInitialized)
    if (isFbSDKInitialized && authDataState.name === '') {
			const PAGE_ID = "101936396058752";
      let user="", utoken="", ptoken="";
			window.FB.getLoginStatus((response) => {
				if (response.authResponse) {
					utoken = response.authResponse.accessToken
					window.FB.api('/me', function(response) {
						user=response.name
						window.FB.api(
							`/${PAGE_ID}?fields=access_token&access_token=${utoken}`,
							({ access_token }) => {
								ptoken = access_token
								setauthDataState({...authDataState, name: user, fbUserAccessToken: utoken, fbPageAccessToken: ptoken})
							}
						);
					});
				 }
      });
    }
  }, [isFbSDKInitialized, authDataState]);

	const authData = {
	    email: authDataState.email,
	    name: authDataState.name,
	    fbUserAccessToken: authDataState.fbUserAccessToken,
	    fbPageAccessToken: authDataState.fbPageAccessToken,
	    login: (na, fb, fbpg) => {
				setauthDataState({
					...authDataState,
					name:na, fbUserAccessToken:fb, fbPageAccessToken:fbpg
				});
	    },
	    logout: () => {
				window.FB.logout(function(response) {
					// user is now logged out
					setauthDataState({email:"", name:"",fbUserAccessToken:"", fbPageAccessToken:""});
				});
	    },
	    signup: (obj) => {
	      setauthDataState(obj);
	    }
	}

	return(
		<AuthContext.Provider value={authData}>
			{props.children}
		</AuthContext.Provider>
	)
}