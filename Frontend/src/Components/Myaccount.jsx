import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Image1 from "../Images/mental-health-icon-logo-awareness-vector-28590941-removebg-preview.png";
import out from "../Images/icons/logout.png";
import out2 from "../Images/icons/profile.png";
import account from "../Images/icons/compte3.png";
import protection from "../Images/icons/protection.png";
import information from "../Images/icons/information (2).png";
import contact from "../Images/icons/contact2.png";
import contacts from "../Images/icons/contacts.png";
import male from "../Images/male.png";

import "../Styles/Home.css";
import "../Styles/account.css";

const Myaccount = () => {
  const { isAuthenticated, logout } = useAuth();
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    id: userData.id,
    first_name: userData.first_name,
    last_name: userData.last_name,
    gender: userData.gender,
    profile_picture: null,
  });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if a file is selected
    if (file) {
      setFormData({ ...formData, profile_picture: file });
    } else {
      // If no file is selected, set profile_picture to null
      setFormData({ ...formData, profile_picture: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", userData.id);
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("profile_picture", formData.profile_picture);

      const response = await axios.post("http://localhost:5000/update-profile", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage(response.data.message);
      console.log("Success!");
      const newUserData = response.data.user;
      const serializedUserData = JSON.stringify(newUserData);
      sessionStorage.setItem('userData', serializedUserData);
      sessionStorage.setItem('successMessage', response.data.message);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  useEffect(() => {
    const storedMessage = sessionStorage.getItem('successMessage');
    if (storedMessage) {
      setSuccessMessage(storedMessage);
      sessionStorage.removeItem('successMessage'); // Remove stored message after retrieving it
    }
  }, []);

  const handleClick = (tab) => {
    setActiveTab(tab);
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
                <Link to="/Home">
                  <li>Home</li>
                </Link>
                <Link>
                  <li>About Us</li>
                </Link>
                <Link>
                  <li>Services</li>
                </Link>
              </ul>
            </div>
            <div className="listdiv2">
              <ul className="unlist1 listo listo2 lis">
                <li onClick={handleLogout} className="unlist A logout">
                  <Link>
                    <img src={out} />
                  </Link>
                </li>
                <li className="Sign-up USER">
                  <Link to="/Account">
                    <img
                      src={`http://localhost:5000/profile_pictures/${userData.profile_picture}`}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <div className="account">
        <h1 className="h1">Account</h1>
        <p>Manage your Mental profile</p>
        <div className="cont">
          <div className="containerdiv">
            <div className="acc">
              <img
                src={`http://localhost:5000/profile_pictures/${userData.profile_picture}`}
              ></img>
              <div className="namelog">
                <h4>
                  {userData.first_name} {userData.last_name}
                </h4>
                <Link onClick={handleLogout} className="link">
                  Logout
                </Link>
              </div>
              <br></br>
            </div>
            <div className="info">
              <div
                className={`infosections ${
                  activeTab === "personal" ? "a" : ""
                }`}
                onClick={() => handleClick("personal")}
              >

                <img className="imageinfo" src={information}></img>
                <h4>Personal Information</h4>
              </div>

              {/* <div
                className={`infosections ${activeTab === "contact" ? "a" : ""}`}
                onClick={() => handleClick("contact")}
              >
                <img className="imageinfo contactimg" src={contact}></img>
                <h4>Contact Information</h4>
              </div> */}
            </div>
          </div>

          <div
            className={`infopage ${activeTab === "personal" ? "active" : ""}`}
          >
            <div className="infohead">
              <img src={protection} />
              <h1>Personal Information</h1>
            </div>
            <div className="datacontainer">
              <form onSubmit={handleSubmit}>
                <div className="fullname">
                  <div>
                    <h5 htmlFor="first_name">First Name</h5>
                    <input
                      type="text"
                      name="first_name"
                      id="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <h5 htmlFor="last_name">Last Name</h5>
                    <input
                      type="text"
                      name="last_name"
                      id="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="gender">
                  <fieldset>
                    <legend>
                      <h5 htmlFor="gender">Gender</h5>
                    </legend>
                    <div className="sousgender">
                      <div>
                        <label htmlFor="Male">Male</label>
                        <input
                          className="radio"
                          type="radio"
                          name="gender"
                          id="Male"
                          value="Male"
                          checked={formData.gender === "Male"}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="female">
                        <label htmlFor="Female">Female</label>
                        <input
                          className="radio"
                          type="radio"
                          name="gender"
                          id="Female"
                          value="Female"
                          checked={formData.gender === "Female"}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="gender gender2">
                  <fieldset>
                    <legend>
                      <h5> Add a profile picture</h5>
                    </legend>
                    <div className="souspicture">
                      <div className="Picture">
                        <p>
                          Please upload an image in PNG, JPG, JPEG, or GIF
                          format:
                        </p>
                        <input
                          type="file"
                          name="profile_picture"
                          id="profile_picture"
                          accept=".png, .jpg, .jpeg, .gif"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                  </fieldset>
                </div>
                <div className="submitform">
                  <button className="gender" type="submit">
                    Update
                  </button>
                  {successMessage && <p className="success">{successMessage}</p>}
                </div>
              </form>
            </div>
          </div>

          {/* <div className={`infopage infopage2 ${activeTab === 'contact' ? 'active' : ''}`}>
            <div className="infohead">
              <img src={contacts} />
              <h1>Contact Information</h1>
            </div>
            <div className="datacontainer">
              <form action="">
                <div className="fullname">
                  <div>
                    <h5 htmlFor="">Email Address</h5>
                    <input type="text" value={userData.email} />
                  </div>
                </div>
                <div className="gender gen">
                <div>
                    <h5 htmlFor="">Phone number</h5>
                    <input type="tel" name="" id="" />
                  </div>
                </div>
                <div className="submitform">
                  <button className="gender " type="submit">
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Myaccount;
