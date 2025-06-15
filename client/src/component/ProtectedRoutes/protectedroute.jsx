import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function protectedroute({children}) {
  
  const isLoggedin=sessionStorage.getItem('isloggedin');
  const jwt=sessionStorage.getItem('jwttoken');
  const role=sessionStorage.getItem('role');

  useEffect(()=>{
    if(!isLoggedin){
        navigate('/login');
    }
  },[isLoggedin,navigate]);

  const allowedRoles=['staff','admin'];
  if(!allowedRoles.includes(role)){
    console.log("Unauthorized role");
    navigate('/');
    return null;
  }
  return isLoggedin? children:null;
}

export default protectedroute
