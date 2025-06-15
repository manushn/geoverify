import { useState,lazy} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const Login =lazy(()=>import ('./pages/login'));
const Admindash=lazy(()=>import('./pages/admindas'));
const Passreset=lazy(()=>import('./pages/passreset'));
const protectedroute=lazy(()=>import('./component/ProtectedRoutes/protectedroute'));
const staffpage=lazy(()=>import('./pages/Staff'));

function App() {
  return (
   <Router>
      <Routes>

        <Route path="/login" element={<Login/>}/>

        <Route 
        path='/admindash' 
        element={
          <protectedroute>
            <Admindash/>
          </protectedroute>
          }/>

        <Route 
        path='/staffdash'
        element={
          <protectedroute>
            <staffpage/>
          </protectedroute>
        }
        />

        <Route  path='*' element={<Login/>}/>
      </Routes>
   </Router>
  )
}

export default App
