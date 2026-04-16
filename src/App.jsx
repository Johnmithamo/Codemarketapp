import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home_screen';
import Login from './components/login_page';
import Navbar from './components/navbar_page';
import Register from './components/register_page';
import OtpPage from './components/forgot_password_page';
import Account from './components/account_creation_page';
import Splash from './components/splash_screen';
import Settings from './components/settings_page';
import Buyer from './components/buyer_seller_page';
import Seller from './components/seller_seller_page';
import Protected from './components/protected_route';
import Profile from './components/profile_page';
import Profile1 from './components/profile_page1';
import Account1 from './components/account_creation';
import Favorites from "./components/favorite_page"; 
import Policy from "./components/privacy_policy"; 
import Terms from "./components/terms_of_use"; 
import About from "./components/about"; 

function App() {
  return (
    <div className="main-layout">
      <Routes>
        {/* Open routes */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Protected routes */}
        <Route path="/home" element={ <Protected> <Navbar /> </Protected> }/>
        <Route path="/home_screen" element={ <Protected> <Home /> </Protected> }/>
        <Route path="/settings" element={ <Protected> <Settings /> </Protected> }/>
        <Route path="/otp" element={ <Protected> <OtpPage /> </Protected> }/>
        <Route path="/creation" element={ <Protected> <Account /> </Protected> }/>
        <Route path="/buyer/:id" element={ <Protected> <Buyer /> </Protected> }/>
        <Route path="/seller" element={ <Protected> <Seller /> </Protected> }/>
        <Route path="/Profile" element={ <Protected> <Profile /> </Protected> }/>
        <Route path="/Profile1" element={ <Protected> <Profile1 /> </Protected> }/>
        <Route path="/creation1" element={ <Protected> <Account1 /> </Protected> }/>
        <Route path="/favorite" element={ <Protected> <Favorites /> </Protected> }/>
        <Route path="/policy" element={ <Protected> <Policy /> </Protected> }/>
        <Route path="/terms" element={ <Protected> <Terms /> </Protected> }/>
        <Route path="/about" element={ <Protected> <About /> </Protected> }/>
      </Routes>
    </div>
  );
}

export default App;