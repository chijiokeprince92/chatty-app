import React, { Fragment } from 'react';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Test from './pages/testingCss/Test';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Messenger from "./pages/messenger/Messenger";
import Maps from './components/Map/Map';

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Fragment>
        <Routes>
          <Route exact path="/" element={user ? <Home /> : <Register /> } />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
          <Route path="/messenger" element={!user ? <Navigate to="/" /> : <Messenger />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/destination" element={<Maps />} />
          <Route path="/testing" element={<Test />} />
        </Routes>
      </Fragment>
    </Router>
  );
}

export default App;