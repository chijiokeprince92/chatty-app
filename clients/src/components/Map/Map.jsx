import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Map, {NavigationControl, Marker, Popup}  from "react-map-gl";
import { Room, Star} from "@material-ui/icons";
import axios from 'axios';
import moment from 'moment';
import './map.css';


const Maps = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(0);
  const [viewport, setViewport] = useState({
    longitude: 17,
    latitude: 46,
    zoom: 4
  });


  const handleMarkerClick = (id,lat,long) => {
    setCurrentPlaceId(id);
    setViewport({...viewport, latitude:lat, longitude:long})
  }
  
  const handleAddClick = async (e) => {
    const {lng,lat } = await e.lngLat;

    setNewPlace({
      lat: lat,
      long: lng,
    });
    console.log('new place',lng,lat)
  };

  useEffect(() =>{
      const getPins =async ()=> {
        try {
          const res = await axios.get("/pins");
          setPins(res.data)
        } catch (err) {
            console.log(err)
        }
      }
      getPins();
  }, []);


  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newPin = {
      username: currentUser.username,
      title,
      desc,
      rating,
      lat: newPlace.lat,
      long: newPlace.long
    }

    try {
      const res = await axios.post("/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null)
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Map
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_KEY}
        {...viewport}
        width="100%"
        height="100%"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        onDblClick={handleAddClick}
        transitionDuration="200"
      >
         {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color:
                    currentUser.username === p.username ? "tomato" : "slateblue",
                  cursor: "pointer",
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
                key={p._id}
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
                anchor="left"
              >
                <div className="card">
                  <label className='maplabel'>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label className='maplabel'>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label className='maplabel'>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)}
                  </div>
                  <label className='maplabel'>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{moment(p.createdAt).fromNow()}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <Popup 
            latitude={newPlace.lat}
            longitude={newPlace.long} 
            anchor="bottom"
            onClose={() => setNewPlace(null)}>
            
            <div className="card">
              <form className="mapform" onSubmit={handleSubmit}>
                <label className="maplabel">Title</label>
                <input className="input" placeholder="Enter a title" onChange={(e)=>setTitle(e.target.value)}/>
                <label className="maplabel">Review</label>
                <textarea className="textarea" placeholder="Say something about this place" onChange={(e)=>setDesc(e.target.value)}/>
                <label className="maplabel">Rating</label>
                <select className="select" onChange={(e)=>setRating(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">Add Pin</button>
              </form>
            </div>
          </Popup>
        )}
         <NavigationControl />
      </Map>
     
    </div>
    
  );
}

export default Maps;