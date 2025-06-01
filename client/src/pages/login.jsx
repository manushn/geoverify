import React, { useState } from 'react';
import "./css/login.css";
import axios from 'axios';
function login() {
    const [Username,setUsername]=useState("");
    const [Password,setPassword]=useState("");
    const [isloading,setisloading]=useState(false);

    const [Warnmessage,setwarnmessage]=useState("");

    const handleLogin=async()=>{
        if(!Username||!Password){
            setwarnmessage("Please Enter all details!");
        }

        try{
            setisloading(true);
            const response= await axios.post("http://localhost:4000/login",{
                Username:Username,
                Password:Password

            },{
                headers:{
                    'Content-Type':'application/json'
                }
            });

            if(response.data.message){
                setwarnmessage(response.data.message);
            };

            if (response.data.sucess===true){
                setwarnmessage("Login Successfull!")
            };


        }catch(err){
            setisloading(false);
            console.log(err)
        };
    };

  return (
    <div>
      <div className="signupmain">
        <div className="logo">
            <h1>GEO VERIFY</h1>
        </div>
        <div className="signupform">
            <h1 className='loginh1'>Login</h1>
            <label >Username</label>
            <input
            placeholder='username'
            value={Username}
            onChange={(e)=>{
                setUsername(e.target.value.toLowerCase().trim());
                setisloading(false)}}
            />
            <label >Password</label>
            <input
            placeholder='Password'
            value={Password}
            onChange={(e)=>{
                setPassword(e.target.value.trim());
                setisloading(false)}}
            />

            <button onClick={handleLogin} disabled={isloading}>
                {isloading ?("Loging..."):("Login")}
            </button>

            <div className="passreset">
                <p>Forget Password!</p>
            </div>
           

        </div>
        {Warnmessage&&(
            <div className="Warnmessagecon">
                <p>{Warnmessage}</p>
                <button onClick={()=>{setwarnmessage("")}}>X</button>
            </div>
        )}
      </div>
    </div>
  )
}

export default login
