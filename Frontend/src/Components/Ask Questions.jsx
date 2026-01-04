import { useLocation } from 'react-router-dom';
import Image from "../Images/attachment_140941872-removebg-preview.png";
import Image1 from "../Images/mental-health-icon-logo-awareness-vector-28590941-removebg-preview.png";
import Image2 from "../Images/1683719157437.jpeg";
import Image3 from "../Images/support.jpg";
import pers1 from "../Images/pers1.jpg";
import pers2 from "../Images/pers2.jpeg";
import uss from "../Images/uss.png";
import pers3 from "../Images/pers3.jpg";
import Icon1 from "../Images/icons/icons8-nouveau-message-50(1).png";
import Icon2 from "../Images/icons/icons8-téléphone-50(1).png";
import comment from "../Images/icons/comment.png";
import out from "../Images/icons/logout.png";
import out2 from "../Images/icons/profile.png";
import Icon3 from "../Images/icons/icons8-position-50(1).png";
import star from "../Images/icons/star.png";
import '../Styles/Home.css';
import '../Styles/Chat.css';
import '../Styles/communitys.css';
import send from "../Images/icons/send.png";
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import '../Styles/Community.css';
import axios from 'axios';
import { useAuth } from './AuthContext';
import male from "../Images/male.png";
import female from "../Images/female.png";

const Intro = () => {
  const { isAuthenticated, logout } = useAuth();
  // const [topics, setTopics] = useState([]);
  const [comments, setComments] = useState([]);
  const [RES, setResponse] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [responsevalue, setresponse] = useState('');
  const messageContainerRef = useRef(null);
  const [responseFormsVisible, setResponseFormsVisible] = useState({});
  const [responseVisible, setResponseVisible] = useState({});
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  //IN ALL PAGES
  const location = useLocation();
  const topicId = location.state && location.state.topicId;
  const user_id = sessionStorage.getItem('userId')

  console.log(topicId)

  const toggleResponseForm = (commentId) => {
    setResponseFormsVisible({
      ...responseFormsVisible,
      [commentId]: !responseFormsVisible[commentId]
    });
  };
  const toggleResponseVisibility = (commentId) => {
    setResponseVisible(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }));
  };

  useEffect(() => {
    fetchComments();
    fetchresponse();
  }, []);
  useEffect(() => {
    fetchresponse();
  }, []);

  const fetchComments = async (topicId) => {
    console.log('fetchComments topicId:', topicId); 
    try {
      const response = await fetch(`http://localhost:5000/api/posts/8`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      console.log(data);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };
  const fetchresponse = async (topicId) => {
    console.log('fetchComments topicId:', topicId); 
    try {
      const response = await fetch(`http://localhost:5000/api/response/8`);
      if (!response.ok) {
        throw new Error('Failed to fetch responses');
      }
      const data = await response.json();
      console.log(data);
      setResponse(data);
    } catch (error) {
      console.error('Error fetching response:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/introduction', {
        user_id: user_id,
        topicId: topicId,
        introduction: inputValue 
      });

      if (response.status !== 201) { 
        throw new Error('Failed to submit comment');
      }

      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      fetchComments();


      setInputValue('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleresponseSubmit = async (e, id) => {
    e.preventDefault(); 

    try {
      const response = await axios.post('http://localhost:5000/api/responses', {
        user_id: user_id,
        topicId: topicId,
        postid: id,
        resvalue: responsevalue 
      });

      if (response.status !== 201) {
        throw new Error('Failed to submit comment');
      }

      fetchresponse();

      setresponse('');
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };


  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleresponseChange = (e) => {
    setresponse(e.target.value);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout");
      logout();

    } catch (error) {
      console.error('Error during logout:', error.message);
    }
  };
  console.log(isAuthenticated);
  console.log(sessionStorage.getItem('userId'))

  return (
    <>
      {isAuthenticated ? (
        <div className="community comm">
          <div className="nav_container nav_container2">
            <nav>
              <div className="listdiv1">
                <ul className="unlist1 unlist">
                  <Link to='/Home'><li>Home</li></Link>
                  <Link> <li>About Us</li></Link>
                  <Link> <li>Services</li></Link>
                </ul>
              </div>
              <div className="listdiv2">
                <ul className="unlist1 listo listo2">
                  <li onClick={handleLogout} className="unlist A logout"><Link><img src={out} /></Link></li>
                  <li className="Sign-up USER"><Link to="/Account"><img src={`http://localhost:5000/${userData.profile_picture}`} /></Link></li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      ) : (
        <div className='community comm'>
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

      <div className="all all2">
        <div className='head'>
          <img className='MYSTAR1' src={star} alt="" />
          <h1 className='introductionh1'>Ask Questions</h1>
        </div>

        <div className="chatcontainer chatcontainer0">
          <div className="chat chat0">
            <div className="input-container">
              <form className='form' onSubmit={handleSubmit}>
                <input
                  className="input-with-icon"
                  type="text"
                  name="introduction"
                  id="introduction"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Do you have any questions?"
                />
                <div className="icon-container xx">
                  <button className="sub" type="submit">
                    <img src={send} className="icon" />
                  </button>
                </div>
              </form>

              <div />
              <div className="messagescontainer" ref={messageContainerRef}>

                <div className="firstmessage firstmessagee">
                  <div className='childmessage'>
                    <img className='pers' src={male} alt="" />
                    <div className='infoandcomm'>
                      <h4>Michel Chost</h4>
                      <p>
                        Michel Chost, a luminary in mental health advocacy, employs his literary prowess to shed light on the intricacies of the human mind, fostering empathy and understanding through his poignant narratives.
                      </p>
                      <div className='commentcontainer'>
                        <button>
                          <img className='comment' src={comment} alt="" />
                          <h6>0  Response</h6>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="firstmessage firstmessagee">
                  <div className='childmessage'>
                    <img className='pers' src={female} alt="" />
                    <div className='infoandcomm'>
                      <h4>Natlina Berger</h4>
                      <p>
                        Natlina Berger, a beacon of resilience and compassion, uses her voice to advocate for mental health awareness, offering solace and support to those navigating their own journeys toward healing and self-discovery.
                      </p>
                      <div className='commentcontainer'>
                        <button>
                          <img className='comment' src={comment} alt="" />
                          <h6>0  Response</h6>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {comments.map((comm, index) => (
                  <div key={index} className="firstmessage firstmessagee">
                    <div className='childmessage'>
                      <img className='pers' src={`http://localhost:5000/${userData.profile_picture}`} alt="" />
                      <div className='infoandcomm'>
                        <div className='userdata'>
                          <h4>{comm.user_data['first_name']} {comm.user_data['last_name']} </h4>
                        </div>
                        <p>{comm.content}</p>
                        <div className='commentcontainer'>
                          <button onClick={() => toggleResponseForm(comm.id)}>
                            <img className='comment' src={comment} alt="" />
                            <h6>({RES.filter(response => response.post_id === comm.id).length}) Response</h6>
                          </button>
                          <h4 className='date'>{comm.created_at}</h4>
                        </div>
                      </div>
                    </div>
                    {RES.some(response => response.post_id === comm.id) && (
                      <h6  className='resbutton'  onClick={() => toggleResponseVisibility(comm.id)}>
                        Show Responses
                      </h6>
                    )}
                    {responseVisible[comm.id] && RES.map(response => {
                      if (response.post_id === comm.id) {
                        return (
                          <div key={response.response_id} className='childmessage childmess'>
                            
                            <img className='pers' src={`http://localhost:5000/${userData.profile_picture}`} alt="" />
                            <div className='infoandcomm infoo'>
                              
                              <h4 className='fullname'>{response.user_data['first_name']} {response.user_data['last_name']}</h4>
                              
                              <p className='content'>{response.content}</p>
                              
                              <div className='commentcontainer'>
                                <button>
                                  <img className='comment' src={comment} alt="" />
                                  <h6>0 Response</h6>
                                  <h4 className='date dateresponse'>{response.created_at}</h4>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null; 
                    })}
                    <div className='for'>

                      {responseFormsVisible[comm.id] && (
                        <form className='form form2' onSubmit={(e) => handleresponseSubmit(e, comm.id)}>
                          <input
                            className="input-with-icon"
                            type="text"
                            name="response"
                            id="response"
                            value={responsevalue}
                            onChange={handleresponseChange}
                            placeholder="Response"
                          />
                          <button><img src={send} className="icon" /></button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}




              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Intro;


