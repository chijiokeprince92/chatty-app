import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
import { CircularProgress } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CloseFriend from "../closeFriend/CloseFriend";


export default function Sidebar() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const userId = user._id;
  const history = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      const res = await axios.get(`/users/friends/${userId}`);
      setUsers(res.data);
    };
    fetchFollowers();
  }, [userId]);

  const logout = ()=> {
    localStorage.clear();
    history('/login');
  }

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <Bookmark className="sidebarIcon" />
            <span className="sidebarListItemText">Bookmarks</span>
          </li>
          <li className="sidebarListItem">
            <HelpOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Questions</span>
          </li>
          <li className="sidebarListItem">
            <WorkOutline className="sidebarIcon" />
            <span className="sidebarListItemText">Jobs</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon" />
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
            <School className="sidebarIcon" />
            <span className="sidebarListItemText">Courses</span>
          </li>
            <li className="sidebarListItem" onClick={logout}>
            <ExitToAppIcon className="sidebarIcon" />
            <span className="sidebarListItemText">Logout</span>
          </li>
        </ul>
        <button className="sidebarButton">Show More</button>
        <hr className="sidebarHr" />
        <ul className="sidebarFriendList">
        <span className="sidebarListItemText"><b>Following</b></span><br/><br/>
          {users?.length === 0 ? <li>You are not following anyone <CircularProgress style={{fontSize: 20}}/></li> : users.map((use) => 
            <Link to={`/profile/${use.username}`} style={{textDecoration: "none"}}>
              <CloseFriend key={use._id} use={use} />
            </Link>
          )}
        </ul>
      </div>
    </div>
  );
}