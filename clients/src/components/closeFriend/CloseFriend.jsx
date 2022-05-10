import "./closeFriend.css";
import noavatar from '../../images/noavatar.png';

export default function CloseFriend({use}) {
  
  return (
    <li className="sidebarFriend">
      {use.profilePicture ? <img className="sidebarFriendImg" src={use.profilePicture} alt="friendImage" />
      : <img className="sidebarFriendImg" src={noavatar} alt="friend" />
      }
      <span className="sidebarFriendName">{use.username}</span>
    </li>
  );
}
