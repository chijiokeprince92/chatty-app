import "./online.css";
import noavatar from '../../images/noavatar.png';


export default function Online({follower}) {

  return (
    <li className="rightbarFriend">
      <div className="rightbarProfileImgContainer">
        {follower.profilePicture ? <img className="rightbarProfileImg" src={follower.profilePicture} alt="friendsImage" />
         : <img className="rightbarProfileImg" src={noavatar} alt="friendsImage" />
        }
        
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{follower.username}</span>
    </li>
  );
}