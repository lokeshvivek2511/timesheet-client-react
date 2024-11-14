import React, { useEffect, useState,useContext } from "react";
import emailIcon from "../img/email.svg";
import passwordIcon from "../img/password.svg";
import styles from "./SignUp.module.css";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notify } from "./toast";
import { Link } from "react-router-dom";
import { handleadminlogin } from "../api";
import {  Navigate } from "react-router-dom";
import { UserContext } from "../App";


// import axios from "axios";

const Adminlogin = () => {

  const { setUserEmail } = useContext(UserContext);


  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState();

  useEffect(()=>{
    setData({
      email: "",
      password: "",
    })
  },[])

  

  const changeHandler = (event) => {
    if (event.target.name === "IsAccepted") {
      setData({ ...data, [event.target.name]: event.target.checked });
    } else {
      setData({ ...data, [event.target.name]: event.target.value });
    }
  };

  const focusHandler = (event) => {
    setTouched({ ...touched, [event.target.name]: true });
  };

  const submitHandler = async(event) => {
    event.preventDefault();
    const responseStatus = await handleadminlogin(data);
    setStatus(responseStatus);
    if (responseStatus) {
      setUserEmail(data.email);
      // console.log(responseStatus);
      notify("You logged in successfully", "success");
    } else {
      // console.log(responseStatus);
      notify("Invalid email or password", "error");
    }
  };

  return (
    <div className={styles.container}>
      {status && <Navigate to="/admin" replace />}
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign In</h2>
        <div>
          <div>
            <input type="text" name="email" value={data.email} placeholder="E-mail" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={emailIcon} alt="" />
          </div>
        </div>
        <div>
          <div>
            <input type="password" name="password" value={data.password} placeholder="Password" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={passwordIcon} alt="" />
          </div>
        </div>

        <div>
          <button type="submit">Login</button>
          <span style={{ color: "#a29494", textAlign: "center", display: "inline-block", width: "100%" }}>
            Login as employee? <Link to="/login">Employee login</Link>
          </span>
        </div>
      </form>
      {/* <ToastContainer /> */}
    </div>
  );
};

export default Adminlogin;
