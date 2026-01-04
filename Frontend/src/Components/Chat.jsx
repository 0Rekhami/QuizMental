import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import male from "../Images/male.png";
import out from "../Images/icons/logout.png";
import send from "../Images/icons/send.png";

const Chat = () => {
  const { isAuthenticated, logout } = useAuth();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [botMessages, setBotMessages] = useState([
    { text: "Hello! How can I help you today?" },
  ]);
  const [userMessages, setUserMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [botMessages]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setUserMessages([...userMessages, inputValue]);

    setInputValue("");

    try {
      const response = await axios.post("http://localhost:5000/api/ask", {
        message: inputValue,
      });
      console.log(response.data.response);

      setBotMessages((prevBotMessages) => [
        ...prevBotMessages,
        { text: response.data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout");
      logout();
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <>
      <div className="community comm">
        <div className="nav_container nav_container2">
          <nav className="navo">
            <div className="listdiv1">
              <ul className="unlist1 unlist unl">
                <li>
                  <Link to="/Home">Home</Link>
                </li>
                <li>
                  <Link to="#">About Us</Link>
                </li>
                <li>
                  <Link to="#">Services</Link>
                </li>
              </ul>
            </div>
            <div className="listdiv2">
              <ul className="unlist1 listo listo2 lis">
                <li className="unlist A logout" onClick={handleLogout}>
                  <Link>
                    <img src={out} alt="Logout" />
                  </Link>
                </li>
                <li className="Sign-up USER">
                  <Link to="/">
                    <img
                      src={`http://localhost:5000/${userData.profile_picture}`}
                      alt="Profile"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <div className="all">
        <div className="chatcontainer">
          <div className="chat">
            <div className="input-container">
              <form action="" onSubmit={handleSubmit}>
                <input
                  className="input-with-icon"
                  type="text"
                  name=""
                  id=""
                  placeholder="Question..."
                  value={inputValue}
                  onChange={handleInputChange}
                />
                <div className="icon-container">
                  <button className="sub" type="submit">
                    <img src={send} className="icon" alt="Send" />
                  </button>
                </div>
              </form>
              <div className="messagescontainer0" ref={messagesContainerRef}>
                {botMessages.map((botMessage, index) => (
                  <div key={`message-${index}`}>
                    <div className="firstmessage">
                      <div>
                        <p>{botMessage.text}</p>
                      </div>
                    </div>

                    {index < userMessages.length && (
                      <div className="firstmessage2">
                        <div>
                          <p>{userMessages[index]}</p>
                        </div>
                      </div>
                    )}
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

export default Chat;
