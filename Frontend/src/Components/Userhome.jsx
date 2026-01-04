import { useLocation } from 'react-router-dom';
import Image from "../Images/attachment_140941872-removebg-preview.png";
import Image1 from "../Images/mental-health-icon-logo-awareness-vector-28590941-removebg-preview.png";
import Image2 from "../Images/1683719157437.jpeg";
import Image3 from "../Images/support.jpg";
import Icon1 from "../Images/icons/icons8-nouveau-message-50(1).png";
import Icon2 from "../Images/icons/icons8-téléphone-50(1).png";
import out from "../Images/icons/logout.png";
import out2 from "../Images/icons/profile.png";
import Icon3 from "../Images/icons/icons8-position-50(1).png";
import '../Styles/Home.css';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from "react";
import '../Styles/Quiz.css';
import axios from 'axios';
import { useAuth } from './AuthContext';
import male from "../Images/male.png";

const Userhome = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location.state?.userData || null;
    const pageBodyDiv1Ref = useRef(null);
    const pageBodyDiv2Ref = useRef(null);
    const forumSectionRef = useRef(null);
    const newsletterRef = useRef(null);
    const contactRef = useRef(null);

    // const serializedUserData = JSON.stringify(userData);
    const userdata = JSON.parse(sessionStorage.getItem("userData"));
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth" // Optional: adds smooth scrolling behavior
      });
    };
  
    const handleScroll = () => {
        const elements = [
          pageBodyDiv1Ref.current,
          pageBodyDiv2Ref.current,
          forumSectionRef.current,
          newsletterRef.current,
          contactRef.current,
        ];
      
        const thresholdPixels = 50; 
      
        elements.forEach((element) => {
          if (isElementInViewport(element, thresholdPixels)) {
            element.classList.add('show');
          }
        });
      };
      //NEW ONE
        const isElementInViewport = (el, thresholdPercentage = 0) => {
          if (!el) return false; 
        
          const rect = el.getBoundingClientRect();
          const threshold = (rect.height * thresholdPercentage) / 100;
        
          return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + threshold &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth) + threshold
          );
        };
        
      
        useEffect(() => {
          window.addEventListener('scroll', handleScroll);
          return () => {
            window.removeEventListener('scroll', handleScroll);
          };
        }, []);


        const handleLogout = async () => {
          try {
            await axios.post("http://localhost:5000/api/logout");
            logout();
            sessionStorage.removeItem('userData');
          } catch (error) {
            console.error('Error during logout:', error.message);
          }
        };
        console.log(isAuthenticated);


  return (
    <>
      <div className="heart">
         <div className="nav_container nav_container2">
           <nav>
             <div className="listdiv1">
               <ul className="unlist1 unlist">
                 <li><a href="">About Us</a></li>
                 <li><a href="">Services</a></li>
               </ul>
             </div>
             <div>
               <img className="logo" src={Image1}
                 alt="" />
             </div>
             <div className="listdiv2">
               <ul className="unlist1 listo listo2">
                 <li onClick={handleLogout} className="unlist A logout"><Link><img src={out}/></Link></li>
                 <li className="Sign-up USER"><Link to="/Account" onClick={scrollToTop}><img src={`http://localhost:5000/profile_pictures/${userdata.profile_picture}`}/></Link></li>
               </ul>
             </div>
           </nav>
         </div>
         <div className="section1">
           <div className="subsection1">
             <h1>Improving Mental Health One Step at a Time</h1>
             <p>
               Explore a wealth of resources and compassionate support on our mental health platform, designed to guide you toward improved mental well-being. Welcome to a space dedicated to your journey towards a healthier mind.
             </p>
             <button className='btt'><a href="">Start</a></button>
           </div>
         </div>
       </div>
       <div ref={pageBodyDiv1Ref} className="pagebody2">
         <div className="page_body_div3">
           <img src={Image} alt="" />
         </div>
         <div  className="page_body_div1 page_body">
           <h1>Assess Your Mental Health with Our Comprehensive Quiz</h1>
           <p>
             Our Mental Health Quiz is designed to help you gain insights into your 
             mental well-being. Answer a series of questions and
              receive personalized results to better understand your mental health.
           </p>
           <div className="learn_more">
           <Link to='/IntQuiz'><button className="learn1"><a href="">Learn more</a></button></Link>
             <Link to='/IntQuiz' ><button className="learn2">Start <b>{'>'}</b></button></Link>
           </div>
         </div>
       </div>
     
       <div  ref={pageBodyDiv2Ref} className="pagebody">
         <div  className="page_body_div1">
           <h1>Interactive Chatbot for Personalized Support</h1>
           <p>
             Our Chatbot feature provides interactive and personalized support to
             help you navigate your mental health journey. Whether you need someone
             to talk to or guidance on finding resources, our Chatbot is here to
             assist you.
           </p>
           <div className="items_page_body">
             <div>
               <h5>Supportive</h5>
               <p>
                 Engage in meaningful conversations and receive guidance tailored
                 to your needs.
               </p>
             </div>
             <div>
               <h5>Accessible</h5>
     
               <p>
                 Connect with our Chatbot anytime, anywhere, and get the support
                 you deserve.
               </p>
             </div>
           </div>
           <div className="learn_more">
           <Link to='/Assistant' onClick={scrollToTop}>
                 <button className="learn4">Start</button>
           </Link>
           </div>
         </div>
         <div className="page_body_div2">
           <img src={Image2} alt="" />
         </div>
         
       </div>
       <div ref={forumSectionRef} className="forum-section">
         <div>
           <h1>Community Support</h1>
           <p>
             Join our community forum to share your experiences, ask questions, and support each other on your mental health journey.
           </p>
           <Link  className ='Support'to='/CommunitySupport' onClick={scrollToTop}><button className="btn2">Explore Topics</button></Link>
         </div>  
         <div className="forum-img">
           <img src={Image3} alt="" />
         </div>
       </div>

       
     <div ref={newsletterRef} className="footer0">
    
       <div  className="newsletter">
         <div className="news">
           <h1>Get Mental Health Tips Here</h1>
           <p>
             Get Mental Health Tips Here Sign up for our newsletter to receive
             regular mental health tips and updates.
           </p>
           <div>
             <form action="">
               <input type="text" placeholder="Your Email Address" />
               <button>Join Now</button>
             </form>
             <p>By joining, you agree to our Terms and Conditions.</p>
           </div>
         </div>
       </div>
     
       <div className="footer">
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
       </div>
       </>
  );
};

export default Userhome;


