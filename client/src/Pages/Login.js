import React, { useEffect, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import './Login.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  const [loginemail, setloginemail] = useState();
  const [loginpassword, setloginpassword] = useState();
  const [registeremail, setregisteremail] = useState();
  const [registerpassword, setregisterpassword] = useState();
  const [registername, setregistername] = useState();

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get('redirect');

  useEffect(()=>{
    localStorage.clear("token");
  },[])

  const handleSwitch = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post("/server/api/auth/login",{
            email: loginemail,
            password: loginpassword
        });
        localStorage.setItem("token", res.data.token);
        navigate(`/test/${redirectTo}`);
        toast.success(`${res.data.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        
    } catch (error) {
        toast.error(`${error.response.data.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }
  }

  const handleregister = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post("/server/api/auth/register",{
            email: registeremail,
            password: registerpassword,
            name: registername,
        });
        setIsLogin(!isLogin);
        toast.success(`${res.data.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    } catch (error) {
        toast.error(`${error.response.data.message}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
    }
  }

  return (
    <div className="login-flip-container">
      <div className={`login-flip-card ${isLogin ? 'login-flip-login' : 'login-flip-register'}`}>
        <div className="login-flip-card-inner">
          <div className="login-flip-card-front">
            <div className="login-form">
              <h2>Login</h2>
              <form>
                <input type="email" placeholder="Email" onChange={(e)=>setloginemail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e)=>setloginpassword(e.target.value)} />
                <button type="submit" onClick={handleLogin}>Login</button>
              </form>
              <button className="login-switch-button" onClick={handleSwitch}>Switch to Register</button>
            </div>
          </div>
          <div className="login-flip-card-back">
            <div className="login-form">
              <h2>Register</h2>
              <form>
                <input type="text" placeholder="Name" onChange={(e)=>setregistername(e.target.value)} />
                <input type="email" placeholder="Email"  onChange={(e)=>setregisteremail(e.target.value)} />
                <input type="password" placeholder="Password" onChange={(e)=>setregisterpassword(e.target.value)} />
                <button type="submit" onClick={handleregister}>Register</button>
              </form>
              <button className="login-switch-button" onClick={handleSwitch}>Switch to Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
