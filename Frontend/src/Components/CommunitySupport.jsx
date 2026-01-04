import { useLocation } from 'react-router-dom';
import Image from "../Images/attachment_140941872-removebg-preview.png";
import Image1 from "../Images/mental-health-icon-logo-awareness-vector-28590941-removebg-preview.png";
import Image2 from "../Images/1683719157437.jpeg";
import Image3 from "../Images/support.jpg";
import designe from "../Images/back.gif";
import Icon1 from "../Images/icons/icons8-nouveau-message-50(1).png";
import Icon2 from "../Images/icons/icons8-téléphone-50(1).png";
import star from "../Images/icons/star.png";
import out from "../Images/icons/logout.png";
import out2 from "../Images/icons/profile.png";
import Icon3 from "../Images/icons/icons8-position-50(1).png";
import '../Styles/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import '../Styles/Community.css';
import axios from 'axios';
import { useAuth } from './AuthContext';
import male from "../Images/male.png";

const CommunitySupport = () => {
    const { isAuthenticated, logout } = useAuth();
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();
    const userdata = JSON.parse(sessionStorage.getItem("userData"));

    const handleExploreClick = (topicId, topicName) => {
      
      navigate(`/CommunitySupport/${topicName}`, { state: { topicId } });
      scrollToTop();
    };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Optional: adds smooth scrolling behavior
    });
  };

    useEffect(() => {
        axios.get('http://localhost:5000/api/community')
            .then(response => {
                setTopics(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching topics:', error);
            });
    }, []);

    const handleLogout = async () => {
        try {
          await axios.post("http://localhost:5000/api/logout");
          logout();
          
        } catch (error) {
          console.error('Error during logout:', error.message);
        }
      };
      console.log(isAuthenticated);

  return (
    <>
 <div className='heartt'>  
     {isAuthenticated ? (
 
 <div className="community comm">
 <div className="nav_container nav_container2">
   <nav className='navo'>
     <div className="listdiv1">
       <ul className="unlist1 unlist unl">
       <Link to='/Home'><li>Home</li></Link>
       <Link> <li>About Us</li></Link>
      <Link> <li>Services</li></Link>
       </ul>
     </div>
     {/* <div>
       <img className="logo" src={Image1}
         alt="" />
     </div> */}
     <div className="listdiv2">
       <ul className="unlist1 listo listo2 lis">
         <li onClick={handleLogout} className="unlist A logout"><Link><img src={out}/></Link></li>
         <li className="Sign-up USER"><Link to="/Account"><img src={`http://localhost:5000/${userdata.profile_picture}`}/></Link></li>
       </ul>
     </div>
   </nav>
 </div>
</div>
        ) : (
         <div className='community'>
         <div className="nav_container">
          <nav>
            <div className="listdiv1">
              <ul className="unlist1 unlist">
               <Link to='/'><li>Home</li></Link>
               <Link> <li>About Us</li></Link>
               <Link> <li>Services</li></Link>
              </ul>
            </div>
            <div className="listdiv2">
              <ul className="unlist1">
                <li className="unlist A log"><Link to="/Login">Login</Link></li>
                <li className="Sign-up sign"><Link to="/Sign-up">Sign-up</Link></li>
              </ul>
            </div>
          </nav>
        </div>
        </div>
        )}
     
     <h1 className='h11'>Community Topics</h1>
     <p className='h12'>Find answers, ask questions, and connect with our community of Mantal users from around the world</p>

     <img  className= 'designe'src={designe} alt="" />

      </div>   
       
       <div className='topicsdiv'>
            
            <ul className='commul'>
                
                {topics.map(topic => (
                    <li className='commlist' key={topic[0]}>
                        <img className='MYSTAR' src={star} alt="" />
                        <h3>{topic[1]}</h3>
                        <p>{topic[2]}</p>
                        <p>Created At: {topic[3]}</p>
                        
                        <button  onClick={() => handleExploreClick(topic[0], topic[1])}>Explore</button>
                        
                    </li>
                ))}
            </ul>
        </div>
        <div className="footer foot">
        <div>
          <img className="logo" src={Image1}
                 alt="" />
          <p>&copy; 2024 Mental. All rights reserved </p>
        </div>
        <div className='DIIV'>
        <label htmlFor="">Company</label>
          <Link to=''><p>About Us</p></Link>
          <Link to=''><p>Services</p></Link>
          <Link to=''><p>Contact Us</p></Link>
        </div>
        <div className='DIIV'>
          <label htmlFor="">Email</label>
          <p>Mental@Support.com</p>
          <label htmlFor="">Call</label>
          <p>+212-612226386</p>
        </div>
       </div>
        </>
  );
};

export default CommunitySupport;


