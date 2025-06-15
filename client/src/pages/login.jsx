import React, { useEffect, useState } from 'react';
import "./css/login.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [Username, setUsername] = useState("");
  const [Password, setPassword] = useState("");
  const [isloading, setisloading] = useState(false);
  const [Warnmessage, setwarnmessage] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  const allowedRegex = /^[a-zA-Z0-9._@]*$/;
  const navigate = useNavigate(); // Variable name corrected

  // Function to check invalid characters
  const containsInvalidCharacters = (input) => {
    return !allowedRegex.test(input);
  };

  // Get geolocation
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          switch (error.code) {
            case 1:
              setwarnmessage("Location access denied. Please enable location.");
              break;
            case 2:
              setwarnmessage("Location unavailable. Try again later.");
              break;
            case 3:
              setwarnmessage("Location request timed out.");
              break;
            default:
              setwarnmessage("Failed to get your location.");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setwarnmessage("Geolocation is not supported by your browser.");
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleLogin = async () => {
    if (!userLocation) {
      setwarnmessage("Unable to find location!");
      return;
    }
    if (!Username || !Password) {
      setwarnmessage("Please enter all details!");
      return;
    }
    if (containsInvalidCharacters(Username)) {
      setwarnmessage("Username contains invalid characters!");
      return;
    }

    try {
      setisloading(true);
      const response = await axios.post("http://localhost:4000/login", {
        Username,
        Password,
        userLocation
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.message) {
        setwarnmessage(response.data.message);
      }

      if (response.data.Success === true) {
        sessionStorage.setItem('username', response.data.Username);
        sessionStorage.setItem('name', response.data.Name);
        sessionStorage.setItem('role',response.data.Role);
        sessionStorage.setItem('success', true);
        sessionStorage.setItem('token', response.data.Token);

        // Corrected switch statement
        switch (response.data.Role) {
          case 'admin':
            navigate('/admindash');
            break;
          case 'staff':
            navigate('/staffdash');
            break;
          default:
            console.error("Error in user role");
            break;
        }
      }

    } catch (err) {
      console.error("Login request error:", err);
      setwarnmessage("An error occurred during login.");
    } finally {
      setisloading(false);
    }
  };

  return (
    <div>
      <div className="signupmain">
        <div className="logo">
          <h1>GEO VERIFY</h1>
        </div>

        <div className="signupform">
          <h1 className='loginh1'>Login</h1>

          <label>Username</label>
          <input
            placeholder='Username'
            value={Username}
            onChange={(e) => {
              const val = e.target.value.toLowerCase().trim();
              if (allowedRegex.test(val)) {
                setUsername(val);
                setwarnmessage("");
              } else {
                setwarnmessage("Username contains invalid characters!");
              }
              setisloading(false);
            }}
          />

          <label>Password</label>
          <input
            type="password"
            placeholder='Password'
            value={Password}
            onChange={(e) => {
              const val = e.target.value.trim();
              if (allowedRegex.test(val)) {
                setPassword(val);
                setwarnmessage("");
              } else {
                setwarnmessage("Password contains unsupported characters!");
              }
              setisloading(false);
            }}
          />

          <button onClick={handleLogin} disabled={isloading}>
            {isloading ? "Logging in..." : "Login"}
          </button>

          <div className="passreset">
            <p>Forgot Password?</p>
          </div>
        </div>

        {Warnmessage && (
          <div className="Warnmessagecon">
            <p>{Warnmessage}</p>
            <button onClick={() => setwarnmessage("")}>X</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;