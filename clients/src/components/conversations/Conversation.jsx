import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";
import noavatar from '../../images/noavatar.png';


const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios("/users?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? user.profilePicture
            : noavatar
        }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}

export default Conversation;