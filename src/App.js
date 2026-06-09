import React, { useContext } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Button } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Login from './components/login'
import SignUp from './components/signup'
import Home from './components/home'
import AddPost from './components/addPost'
import AuthContext from './store/authContext'

function App() {
  const ctxAuth = useContext(AuthContext);
  const navigateToRoot = <Home />;
  const authRoutes = 
  <div className="home-wrapper">
    <div className="home-inner">
      <Routes>
        <Route path='/' element={navigateToRoot} />
        <Route path='/login' element={navigateToRoot} />
        <Route path='/signup' element={navigateToRoot} />
        <Route path='/home' element={<Home />} />
        <Route path='/add-post' element={<AddPost />} />
      </Routes>
    </div>
  </div>;

  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/'}>
              Facebook Posts Manager
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              { ctxAuth.name === '' ?
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={'/login'}>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/signup'}>
                      Sign up
                    </Link>
                  </li>
                </ul> : 
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item">
                    <Link className="nav-link" to={'/home'}>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to={'/add-post'}>
                      Add Post
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Button className="btn-danger" onClick={ctxAuth.logout}>
                      Logout
                    </Button>
                  </li>
                </ul>
              }
            </div>
          </div>
        </nav>
        { ctxAuth.name === '' ?
          <div className="auth-wrapper">
            <div className="auth-inner">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </div>
          </div> :
          authRoutes
        }
      </div>
    </Router>
  )
}
export default App