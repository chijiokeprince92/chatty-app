import "./rightbar.css";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove, WhatsApp } from "@material-ui/icons";
import couples from "../../images/couplehands.jpg";
import birthday from "../../images/birthdayphoto.jpg";
import { CircularProgress } from '@material-ui/core';
import noavatar from '../../images/noavatar.png';


const Rightbar = ({user}) => {
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(false);
  const history = useNavigate();

  
  useEffect(() => {
    const getFriends = async () => {
      try {
        const followersList = await axios.get(`/users/friends/${user._id}`);
        setFriends(followersList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
    setFollowed(currentUser.followings.includes(user?._id));
  }, [user,currentUser.followings]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const messageUser = async () => {
  
      try {
        const res = await axios.get(`/conversations/find/${currentUser._id}/${user._id}`);
        if (res.data === null) {
          const convo = {
            senderId: currentUser._id,
            receiverId: user._id
          }
          const newConvo = await axios.post('/conversations/', convo);
          console.log(newConvo)
        } 
      } catch (err) {
        console.log(err);
      }
      history('/messenger');
  }

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={birthday} alt="friendsImage" />
          <span className="birthdayText">
            <b>Tiana Kingsley</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src={couples} alt="couplesImage" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
        {currentUser?.followers?.length === 0 ? <li>You are not followed by anyone <CircularProgress style={{fontSize: 20}}/></li>
         : currentUser?.followers.map((friend) => 
            <Link key={friend._id} to={`/profile/${friend.username}`} style={{textDecoration: "none"}}>
              <Online follower={friend} />
            </Link>
          )}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
          <button className="rightbarFollowButton" onClick={messageUser}>
            <WhatsApp/>
          </button>
          </div>
        )}
        <h4 className="rightbarTitle">{user.username}'s information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 1
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">{user.username}'s friends ({friends.length})</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link key={friend._id}
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? friend.profilePicture
                      : noavatar
                  }
                  alt="followerImg"
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username === currentUser.username ? 'You' : friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}

export default Rightbar;