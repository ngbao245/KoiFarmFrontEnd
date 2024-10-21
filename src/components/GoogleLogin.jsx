import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { googleSignin } from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  const { loginContext } = useContext(UserContext);

  const handleGoogleLoginSuccess = async (response) => {
    try {
      let res = await googleSignin(response.credential);
      if (res && res.data.token) {
        const { roleId } = res.data.user;
        loginContext(res.data.user.email, res.data.token);
        if (roleId === "0") {
          navigate("/");
        } else if (roleId === "1") {
          navigate("/admin");
        } else if (roleId === "2") {
          navigate("/admin-product");
        }
        toast.success("Google login successful!");
      } else {
        throw new Error("Google login failed!");
      }
    } catch (error) {
      toast.error("Google login failed!");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    toast.error("Google login failed!");
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLoginSuccess}
      onError={handleGoogleLoginFailure}
    />
  );
};

export default GoogleLoginButton;
